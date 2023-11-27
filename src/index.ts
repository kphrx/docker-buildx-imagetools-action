/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'
import { run, cleanup } from './main'

const IsPost = !!core.getState('isPost')

if (!IsPost) {
  core.saveState('isPost', 'true')
  run()
} else {
  cleanup()
}
