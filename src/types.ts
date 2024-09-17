export class StdErrError extends Error {
  constructor(stderr: string) {
    const err = stderr.match(/(.*)\s*$/)?.[0]?.trim()
    super(err != null ? `buildx failed with: ${err}` : 'unknown error')
  }
}
export type NonEmptyArray<T> = [T, ...T[]]
export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0
