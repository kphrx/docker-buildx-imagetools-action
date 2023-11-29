import * as core from '@actions/core'
import { Exec } from '@docker/actions-toolkit/lib/exec'
import type { Toolkit } from '@docker/actions-toolkit/lib/toolkit'

import type { NonEmptyArray } from './types'

class StdErrError extends Error {
  constructor(stderr: string) {
    super(
      `buildx failed with: ${stderr.match(/(.*)\s*$/)?.[0]?.trim()}` ??
        'unknown error'
    )
  }
}

export interface CreateOptions {
  annotations: string[]
  sources: NonEmptyArray<string>
  tags: string[]
}

interface CreateRawOptions extends CreateOptions {
  dryRun: boolean
}

export async function create(
  toolkit: Toolkit,
  opts: CreateOptions
): Promise<void> {
  const stdout = await createRaw(toolkit, { ...opts, dryRun: false })
  core.info(stdout)
}

export async function createDryRun(
  toolkit: Toolkit,
  opts: CreateOptions
): Promise<string> {
  return await createRaw(toolkit, { ...opts, dryRun: true })
}

async function createRaw(
  toolkit: Toolkit,
  opts: CreateRawOptions
): Promise<string> {
  const args = ['imagetools', 'create', ...opts.sources]

  if (opts.dryRun) {
    args.push('--dry-run')
  } else if (opts.tags.length === 0) {
    throw new Error('needs input tags or dry-run')
  }

  for (const tag of opts.tags) {
    args.push('--tag', tag)
  }

  if (await toolkit.buildx.versionSatisfies('>=0.12.0')) {
    for (const annotation of opts.annotations) {
      args.push('--annotation', annotation)
    }
  }

  const cmd = await toolkit.buildx.getCommand(args)
  const { exitCode, stdout, stderr } = await Exec.getExecOutput(
    cmd.command,
    cmd.args,
    {
      ignoreReturnCode: true
    }
  )
  if (stderr.length > 0 && exitCode !== 0) {
    throw new StdErrError(stderr)
  }
  return stdout
}

export async function inspect(
  toolkit: Toolkit,
  name: string,
  format?: string | boolean
): Promise<string> {
  const args = ['imagetools', 'inspect']

  if (typeof format === 'boolean' && format) {
    args.push('--raw')
  } else if (format) {
    args.push('--format', format)
  }
  args.push(name)

  const cmd = await toolkit.buildx.getCommand(args)
  const { exitCode, stdout, stderr } = await Exec.getExecOutput(
    cmd.command,
    cmd.args,
    { ignoreReturnCode: true }
  )
  if (stderr.length > 0 && exitCode !== 0) {
    throw new StdErrError(stderr)
  }

  return stdout
}
