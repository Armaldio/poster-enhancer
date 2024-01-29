import { readdir } from 'node:fs/promises'
import { join } from 'path'
import { handleMoviesFolder } from './handlers/movie'

const ensureEnv = (env: keyof NodeJS.ProcessEnv) => {
    const value = process.env[env]
    if (!value) {
        throw new Error('Missing INPUT variable')
    }
    return value
}

const input = ensureEnv('INPUT')
const jf_apiKey = ensureEnv('JELLYFIN_API_KEY')
const jf_host = ensureEnv('JELLYFIN_HOST')
const jf_port = ensureEnv('JELLYFIN_PORT')

console.log('input', input)

const cwd = '' // process.cwd()

console.log('cwd', cwd)

const fullPathInput = join(cwd, input)
const rootFolders = await readdir(fullPathInput)

console.log('rootFolders', rootFolders)

// for (const rootFolder of rootFolders) {
//     const fullPathRootFolder = join(fullPathInput, rootFolder)
//     console.log('fullPathRootFolder', fullPathRootFolder)

//     if (rootFolder === 'movies') {
//         await handleMoviesFolder(fullPathRootFolder)
//     }
// }

// trigger refresh
const url = `http://${jf_host}:${jf_port}/library/refresh?api_key=${jf_apiKey}`
console.log('url', url)
await fetch(url, {
    method: 'POST'
})