import type * as imagetools from '../src/imagetools'
import { jest } from '@jest/globals'

export const create = jest.fn<typeof imagetools.create>()
export const createDryRun = jest.fn<typeof imagetools.createDryRun>()
export const inspect = jest.fn<typeof imagetools.inspect>()
