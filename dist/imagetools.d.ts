import type { Toolkit } from '@docker/actions-toolkit/lib/toolkit';
import type { NonEmptyArray } from './types';
export interface CreateOptions {
    annotations: string[];
    sources: NonEmptyArray<string>;
    tags: string[];
}
export declare function create(toolkit: Toolkit, opts: CreateOptions): Promise<void>;
export declare function createDryRun(toolkit: Toolkit, opts: CreateOptions): Promise<string>;
export declare function inspect(toolkit: Toolkit, name: string, format?: string | boolean): Promise<string>;
