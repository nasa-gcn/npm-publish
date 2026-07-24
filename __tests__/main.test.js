/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as exec from '../__fixtures__/exec.js'
import * as readPackage from '../__fixtures__/readPackage.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/exec', () => exec)
jest.unstable_mockModule('../src/readPackage.js', () => readPackage)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.js', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Publishes without an NPM tag for version 1.0.0', async () => {
    readPackage.readPackage.mockImplementation(() => ({
      version: '1.0.0'
    }))

    await run()

    // Verify the time output was set.
    expect(core.notice).not.toHaveBeenCalled()
    expect(exec.exec).toHaveBeenNthCalledWith(1, 'npm', [
      'publish',
      '--access',
      'public'
    ])
  })

  it('Publishes with the correct NPM tag for version 1.0.0-alpha.1', async () => {
    readPackage.readPackage.mockImplementation(() => ({
      version: '1.0.0-alpha.1'
    }))

    await run()

    // Verify the time output was set.
    expect(core.notice).toHaveBeenNthCalledWith(1, 'prerelease tag: alpha')
    expect(exec.exec).toHaveBeenNthCalledWith(1, 'npm', [
      'publish',
      '--access',
      'public',
      '--tag',
      'alpha'
    ])
  })

  it('Sets a failed status', async () => {
    readPackage.readPackage.mockImplementation(() => {
      throw new Error('oops')
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(1, 'oops')
  })
})
