export class StdErrError extends Error {
  constructor(stderr: string) {
    super(
      `buildx failed with: ${stderr.match(/(.*)\s*$/)?.[0]?.trim()}` ??
        'unknown error'
    )
  }
}
export type NonEmptyArray<T> = [T, ...T[]]
export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0
