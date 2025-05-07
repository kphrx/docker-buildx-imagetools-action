export declare class StdErrError extends Error {
    constructor(stderr: string);
}
export type NonEmptyArray<T> = [T, ...T[]];
export declare const isNonEmptyArray: <T>(arr: T[]) => arr is NonEmptyArray<T>;
