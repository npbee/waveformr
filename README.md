![Waveformr logo](./public/logo.svg)

This is a tool for generating SVG waveforms of audio files.
It uses [audiowaveform](https://github.com/bbc/audiowaveform) and  [waveform-data](https://github.com/bbc/waveform-data.js) to accept an audio URL and return an SVG of the waveform.

Like this!
![audio waveform example](https://waveformr.com/render?url=https%3A%2F%2Fres.cloudinary.com%2Fdhhjogfy6%2Fvideo%2Fupload%2Fv1575833691%2Faudio%2Freflection.mp3&stroke=%230a9396&fill=%23001219ff&type=mirror&samples=200&stroke-width=2&stroke-linecap=round)

Built with:
- [Remix](https://remix.run/)
- [Fly](https://fly.io/)

## Development

Requires Node 24+ and [`audiowaveform`](https://github.com/bbc/audiowaveform) on your `PATH`.

```sh
pnpm dev          # app on :3000, waveforms served from /render
pnpm test         # snapshot + unit tests
pnpm test:update  # rewrite snapshots in test/__images__
```

## Acknowledgements

- [waveform-path](https://github.com/jerosoler/waveform-path)
