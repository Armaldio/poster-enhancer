import ffprobe from 'ffprobe'
import { access, cp, readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execa } from 'execa';
import { UltimateTextToImage } from "ultimate-text-to-image";
import sharp from 'sharp'

// ffprobe -v quiet -print_format json -show_format -show_streams Barbie\ \(2023\)\ Bluray-2160p.mkv
// format > tags > title: original title
// streams > "codec_type = audio" > tag > title > (x can include vff)

interface AudioStream {
    codec_name: string
    codec_type: 'audio'
    tags: {
        language: string
        title?: string
    }
}

interface FFProbe {
    streams: Array<AudioStream>
    format: {
        filename: string
    }

}

const checkIfVFF = (audiotracks: FFProbe['streams']) => {
    let isVFF = false

    for (const track of audiotracks) {
        if (
            track.tags.title?.includes('VFF')
        ) {
            isVFF = true
        }
    }

    return isVFF
}

const getAudioTracks = (data: FFProbe) => {
    return data.streams.filter(x => x.codec_type === 'audio')
}

export const handleMovieFolder = async (moviePath: string) => {
    console.log(moviePath)

    let nfoPath: string | undefined
    let fanartPath: string | undefined
    let posterPath: string | undefined

    const files = await readdir(moviePath)

    // console.log('files', files)

    if (!files.some(x => x.includes('.nfo'))) {
        console.log('No nfo, skipping')
        return
    }

    if (!files.some(x => x.includes('poster.jpg'))) {
        console.log('No poster, skipping')
        return
    }

    const foundFiles = [
        ...files.filter(x => x.endsWith('.mkv')),
        ...files.filter(x => x.endsWith('.mp4'))
    ]

    if (foundFiles.length > 1) {
        console.error('Too much files to handle')
        return
    }

    if (foundFiles.length === 0) {
        console.error('No files to handle')
        return
    }

    const foundFile = foundFiles[0]

    console.log('handling file', moviePath)
    console.log('found', foundFile)

    const fullPathToVideoFile = join(moviePath, foundFile)
    const fullPathToPoster = join(moviePath, 'poster.jpg')
    const fullPathToPosterBackup = join(moviePath, 'poster-original.jpg')
    const fullPathToFanart = join(moviePath, 'fanart.jpg')
    const fullPathToFanartBackup = join(moviePath, 'fanart-original.jpg')

    const { stdout } = await execa('ffprobe', [
        '-v',
        'quiet',
        '-print_format',
        'json',
        '-show_format',
        '-show_streams',
        fullPathToVideoFile
    ]);

    const result = JSON.parse(stdout) as FFProbe

    // console.log('result', result)

    const audioTracks = getAudioTracks(result)

    const isVFF = checkIfVFF(audioTracks)

    console.log('isVFF', isVFF)

    // replace poster
    try {
        await access(fullPathToPosterBackup)
    } catch (e) {
        console.log('Backing up poster')
        await cp(fullPathToPoster, fullPathToPosterBackup)
    }
    if (isVFF) {
        const textToImage = new UltimateTextToImage("VFF", {
            margin: 20,
            fontSize: 200,
            // fontFamily: "Arial",
            fontColor: "#000000",
            backgroundColor: "#ffffff",
            
        }).render();
        const bufferJpeg = textToImage.toBuffer("image/jpeg", { quality: 80, progressive: true });

        await sharp(fullPathToPosterBackup)
            .composite([
                { input: bufferJpeg, gravity: 'southwest' },
            ])
            .toFile(fullPathToPoster);
    }
}

export const handleMoviesFolder = async (moviesPath: string) => {
    console.log('hande movie', moviesPath)

    const rootFolders = await readdir(moviesPath)

    for (const moviePath of rootFolders) {
        const movieFullPath = join(moviesPath, moviePath)

        console.log('--- ')
        await handleMovieFolder(movieFullPath)
        console.log('---')
        console.log('')
    }
}