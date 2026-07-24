import { readFile } from 'node:fs/promises'

export async function readPackage() {
  return JSON.parse(await readFile('package.json', { encoding: 'utf-8' }))
}
