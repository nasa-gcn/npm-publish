import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { parse } from 'semver'
import { readFile } from 'node:fs/promises'
import { readPackage } from './readPackage'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const args = ['publish', '--access', 'public']

    const { version } = readPackage()
    const preid = parse(version)?.prerelease[0]
    if (preid) {
      core.notice(`prerelease tag: ${preid}`)
      args.push('--tag', preid)
    }

    await exec('npm', args)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
