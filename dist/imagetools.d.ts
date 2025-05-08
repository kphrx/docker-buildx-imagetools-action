import type { Toolkit } from '@docker/actions-toolkit/lib/toolkit';
import type { NonEmptyArray } from './types';
export interface CreateOptions {
    annotations: string[];
    sources: NonEmptyArray<string>;
    tags: string[];
}
/**
 * Create multi image manifest index. Use {@link createDryRun} to dry run.
 *
 * @param {Toolkit} toolkit Instance of `Toolkit`.
 * @param {CreateOptions} opts Options for `docker imagetools create` arguments.
 * @returns {Promise<void>} Resolves when the manifest index created.
 */
export declare function create(toolkit: Toolkit, opts: CreateOptions): Promise<void>;
/**
 * Dry run to create multi image manifest index. Use {@link create} to create.
 *
 * @param {Toolkit} toolkit Instance of `Toolkit`.
 * @param {CreateOptions} opts Options for `docker imagetools create` arguments.
 * @returns {Promise<string>} Resolves with stdout value after the command is success.
 */
export declare function createDryRun(toolkit: Toolkit, opts: CreateOptions): Promise<string>;
/**
 * Inspect image manifest.
 *
 * @param {Toolkit} toolkit Instance of `Toolkit`.
 * @param {string} name The tag name of image.
 * @param {(string|boolean)} [format] If set string, pass to `--format=<format>` option. If set `true`, add `--raw` option.
 * @returns {Promise<string>} Resolves with stdout value after the command is success.
 */
export declare function inspect(toolkit: Toolkit, name: string, format?: string | boolean): Promise<string>;
