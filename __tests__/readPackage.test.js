/**
 * Unit tests for src/wait.js
 */
import { readPackage } from '../src/readPackage.js'

describe('readPackage.js', () => {
  it('Correctly reads the package name', async () => {
    const { name } = await readPackage()

    expect(name).toBe('@nasa-gcn/npm-publish')
  })
})
