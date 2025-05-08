import { Exec } from '@docker/actions-toolkit/lib/exec'
import type { Toolkit } from '@docker/actions-toolkit/lib/toolkit'

import { StdErrError } from './types'
import type { NonEmptyArray } from './types'

export interface CreateOptions {
  annotations: string[]
  sources: NonEmptyArray<string>
  tags: string[]
}

interface CreateRawOptions extends CreateOptions {
  dryRun: boolean
}

/**
 * Create multi image manifest index. Use {@link createDryRun} to dry run.
 *
 * @param {Toolkit} toolkit Instance of `Toolkit`.
 * @param {CreateOptions} opts Options for `docker imagetools create` arguments.
 * @returns {Promise<void>} Resolves when the manifest index created.
 */
export async function create(
  toolkit: Toolkit,
  opts: CreateOptions
): Promise<void> {
  await createRaw(toolkit, { ...opts, dryRun: false })
}

/**
 * Dry run to create multi image manifest index. Use {@link create} to create.
 *
 * @param {Toolkit} toolkit Instance of `Toolkit`.
 * @param {CreateOptions} opts Options for `docker imagetools create` arguments.
 * @returns {Promise<string>} Resolves with stdout value after the command is success.
 */
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
    { silent: opts.dryRun, ignoreReturnCode: true }
  )
  if (stderr.length > 0 && exitCode !== 0) {
    throw new StdErrError(stderr)
  }
  return stdout
}

/**
 * Inspect image manifest.
 *
 * @param {Toolkit} toolkit Instance of `Toolkit`.
 * @param {string} name The tag name of image.
 * @param {(string|boolean)} [format] If set string, pass to `--format=<format>` option. If set `true`, add `--raw` option.
 * @returns {Promise<string>} Resolves with stdout value after the command is success.
 */
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
    { silent: true, ignoreReturnCode: true }
  )
  if (stderr.length > 0 && exitCode !== 0) {
    throw new StdErrError(stderr)
  }

  return stdout
}
