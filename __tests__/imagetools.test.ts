/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { Toolkit } from '@docker/actions-toolkit/lib/toolkit'
import { createDryRun } from '../src/imagetools'

// Other utilities
const metadataRegex = /^{/

describe('imagetools.ts', () => {
  it('dry-run', async () => {
    const result = await createDryRun(new Toolkit(), {
      sources: [
        'sha256:5c40b3c27b9f13c873fefb2139765c56ce97fd50230f1f2d5c91e55dec171907',
        'sha256:c4ba6347b0e4258ce6a6de2401619316f982b7bcc529f73d2a410d0097730204'
      ],
      tags: ['alpine:test'],
      annotations: []
    })

    // Verify that all of the core library functions were called correctly
    expect(result).toMatch(metadataRegex)
  })
})
