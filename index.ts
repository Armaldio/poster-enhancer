import { readdir } from 'node:fs/promises'
import { join } from 'path'
import { handleMovieFolder } from './handlers/movie'

const input = process.env.INPUT

if (!input) {
    throw new Error('Missing INPUT variable')
}

console.log('input', input)

const cwd = process.cwd()

console.log('cwd', cwd)

const fullPathInput = join(cwd, input)
const rootFolders = await readdir(fullPathInput)

console.log('rootFolders', rootFolders)

for (const rootFolder of rootFolders) {
    const fullPathRootFolder = join(fullPathInput, rootFolder)
    console.log('fullPathRootFolder', fullPathRootFolder)

    if (rootFolder === 'movies') {
        await handleMovieFolder(fullPathRootFolder)
    }
}