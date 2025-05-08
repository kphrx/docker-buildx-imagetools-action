/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as imagetools from '../__fixtures__/imagetools'

// Mock modules
jest.mock('@actions/core', () => core)
jest.unstable_mockModule('../src/imagetools', () => imagetools)

const { run } = await import('../src/main')

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    core.getInput.mockImplementation(() => '')
    core.getBooleanInput.mockImplementation((name) => {
      switch (name) {
        case 'dry-run':
          return true
        default:
          return false
      }
    })
  })

  it('sets the metadata output', async () => {
    // Set the action's inputs as return values from core.getInput()
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case 'sources':
          return 'sha256:5c40b3c27b9f13c873fefb2139765c56ce97fd50230f1f2d5c91e55dec171907,sha256:c4ba6347b0e4258ce6a6de2401619316f982b7bcc529f73d2a410d0097730204'
        case 'tags':
          return 'alpine:test'
        default:
          return ''
      }
    })

    imagetools.createDryRun.mockImplementation(async (_toolkit, opts) =>
      JSON.stringify(opts)
    )

    await run()

    // Verify that all of the core library functions were called correctly
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'metadata',
      JSON.stringify({
        annotations: [],
        sources: [
          'sha256:5c40b3c27b9f13c873fefb2139765c56ce97fd50230f1f2d5c91e55dec171907',
          'sha256:c4ba6347b0e4258ce6a6de2401619316f982b7bcc529f73d2a410d0097730204'
        ],
        tags: ['alpine:test']
      })
    )
  })

  it('sets a failed status', async () => {
    await run()

    // Verify that all of the core library functions were called correctly
    expect(core.setOutput).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenNthCalledWith(1, 'needs input sources')
  })
})
