import * as path from 'path'
import * as core from '@actions/core'
import { GitHub } from '@docker/actions-toolkit/lib/github'
import { Docker } from '@docker/actions-toolkit/lib/docker/docker'
import { Toolkit } from '@docker/actions-toolkit/lib/toolkit'
import { Util } from '@docker/actions-toolkit/lib/util'
import type {
  ConfigFile,
  ProxyConfig
} from '@docker/actions-toolkit/lib/types/docker'

import { create, createDryRun, inspect } from './imagetools'

import { isNonEmptyArray } from './types'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    await main()
  } catch (e) {
    if (e instanceof Error) core.setFailed(e.message)
  }
}

/**
 * The main function without error handling.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function main(): Promise<void> {
  const annotations = Util.getInputList('annotations', { ignoreComma: true })
  const sources = Util.getInputList('sources')
  const tags = Util.getInputList('tags')
  const isDryRun = core.getBooleanInput('dry-run')

  if (!isNonEmptyArray(sources)) {
    throw new Error('needs input sources')
  }
  const inputs = { annotations, sources, tags }

  const toolkit = new Toolkit()

  await core.group(`GitHub Actions runtime token ACs`, async () => {
    try {
      await GitHub.printActionsRuntimeTokenACs()
    } catch (e) {
      if (e instanceof Error) core.warning(e.message)
    }
  })

  await core.group(`Docker info`, async () => {
    try {
      await Docker.printVersion()
      await Docker.printInfo()
    } catch (e) {
      if (e instanceof Error) core.info(e.message)
    }
  })

  await core.group(`Proxy configuration`, async () => {
    let dockerConfig: ConfigFile | undefined
    let dockerConfigMalformed = false
    try {
      dockerConfig = Docker.configFile()
    } catch (e) {
      dockerConfigMalformed = true
      core.warning(
        `Unable to parse config file ${path.join(
          Docker.configDir,
          'config.json'
        )}: ${e}`
      )
    }
    if (dockerConfig && dockerConfig.proxies) {
      for (const host in dockerConfig.proxies) {
        let prefix = ''
        if (Object.keys(dockerConfig.proxies).length > 1) {
          prefix = '  '
          core.info(host)
        }
        let key: keyof ProxyConfig
        for (key in dockerConfig.proxies[host]) {
          core.info(`${prefix}${key}: ${dockerConfig.proxies[host][key]}`)
        }
      }
    } else if (!dockerConfigMalformed) {
      core.info('No proxy configuration found')
    }
  })

  if (!(await toolkit.buildx.isAvailable())) {
    throw new Error(
      'Docker buildx is required. See https://github.com/docker/setup-buildx-action to set up buildx.'
    )
  }

  await core.group(`Buildx version`, async () => {
    await toolkit.buildx.printVersion()
  })

  if (isDryRun) {
    const metadata = await createDryRun(toolkit, inputs)
    if (metadata.length > 0) {
      await core.group(`Metadata`, async () => {
        core.info(metadata)
        core.setOutput('metadata', metadata)
      })
    }
    return
  }

  await create(toolkit, inputs)

  const digest = await inspect(toolkit, tags[0], '{{index .Manifest.Digest}}')
  if (digest.length > 0) {
    await core.group(`Digest`, async () => {
      core.info(digest)
      core.setOutput('digest', digest)
    })
  }

  const metadata = await inspect(toolkit, tags[0], true)
  if (metadata.length > 0) {
    await core.group(`Metadata`, async () => {
      core.info(metadata)
      core.setOutput('metadata', metadata)
    })
  }
}

/**
 * The post function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function cleanup(): Promise<void> {}
