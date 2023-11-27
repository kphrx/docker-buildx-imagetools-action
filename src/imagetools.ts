import * as core from '@actions/core'
import { Exec } from '@docker/actions-toolkit/lib/exec'
import type { Toolkit } from '@docker/actions-toolkit/lib/toolkit'

class StdErrError extends Error {
  constructor(stderr: string) {
    super(
      `buildx failed with: ${stderr.match(/(.*)\s*$/)?.[0]?.trim()}` ??
        'unknown error'
    )
  }
}

export interface CreateOptions {
  annotations?: string[]
  tags?: string[]
}

export interface CreateDryRunOptions {
  annotations?: string[]
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
  opts: CreateDryRunOptions
): Promise<string> {
  return await createRaw(toolkit, { ...opts, dryRun: true })
}

async function createRaw(
  toolkit: Toolkit,
  opts: CreateRawOptions
): Promise<string> {
  const args = ['imagetools', 'create']

  if (
    (await toolkit.buildx.versionSatisfies('>=0.12.0')) &&
    opts.annotations != null
  ) {
    for (const annotation of opts.annotations) {
      args.push('--annotation', annotation)
    }
  }

  if (!opts.dryRun && opts.tags != null && opts.tags.length > 0) {
    for (const tag of opts.tags) {
      args.push('--tag', tag)
    }
  }

  if (opts.dryRun) {
    args.push('--dry-run')
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
