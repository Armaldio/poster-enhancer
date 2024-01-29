import ffprobe from 'ffprobe'
import { writeFile } from 'node:fs/promises'

console.log('ffprobe', ffprobe)

// ffprobe -v quiet -print_format json -show_format -show_streams Barbie\ \(2023\)\ Bluray-2160p.mkv
// format > tags > title: original title
// streams > "codec_type = audio" > tag > title > (x can include vff)

export const handleMovieFolder = async (moviesPath: string) => {
    console.log('hande movie')

    let nfoPath: string | undefined
    let fanartPath: string | undefined
    let posterPath: string | undefined

    const result = await ffprobe(
        '/home/quentin/Projects/poster-enhancer/tester/movies/Avatar (2009)/Avatar (2009) Bluray-2160p.mov',
        {
            path: 'ffprobe'
        }
    )
    // console.log('result', result)

    await writeFile('./result.json', JSON.stringify(result, undefined, 2))

    // const files =
}