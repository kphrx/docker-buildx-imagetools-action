/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const metadataRegex = /^{/

// Mock the GitHub Actions core library
// let debugMock: jest.SpiedFunction<typeof core.debug>
// let groupMock: jest.SpiedFunction<typeof core.group>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let getBooleanInputMock: jest.SpiedFunction<typeof core.getBooleanInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // debugMock = jest.spyOn(core, 'debug').mockImplementation()
    // groupMock = jest.spyOn(core, 'group').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    getBooleanInputMock = jest
      .spyOn(core, 'getBooleanInput')
      .mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('sets the metadata output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        case 'dry-run':
          return true
        default:
          return false
      }
    })
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'sources':
          return 'sha256:5c40b3c27b9f13c873fefb2139765c56ce97fd50230f1f2d5c91e55dec171907,sha256:c4ba6347b0e4258ce6a6de2401619316f982b7bcc529f73d2a410d0097730204'
        case 'tags':
          return 'alpine:test'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    // expect(debugMock).toHaveBeenNthCalledWith(1, 'Exec.exec: docker version')
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'metadata',
      expect.stringMatching(metadataRegex)
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        default:
          return false
      }
    })
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'sources':
          return ''
        case 'tags':
          return ''
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'needs input sources')
    expect(errorMock).not.toHaveBeenCalled()
  })
})
