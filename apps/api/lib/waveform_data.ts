import {
  BBCWaveformData,
  type JsonWaveformData,
  WaveformDataAudioBufferOptions,
  WaveformDataAudioContextOptions,
} from "../deps.ts";

export type { JsonWaveformData };

export class WaveformData {
  #waveformData: BBCWaveformData;

  constructor(waveformData: BBCWaveformData) {
    this.#waveformData = waveformData;
  }

  static create(buffer: ArrayBuffer | JsonWaveformData) {
    const wf = BBCWaveformData.create(buffer);
    return new WaveformData(wf);
  }

  static createFromAudio(
    options: WaveformDataAudioBufferOptions | WaveformDataAudioContextOptions,
  ): Promise<WaveformData> {
    return new Promise((res, rej) => {
      BBCWaveformData.createFromAudio(options, (err, wf) => {
        if (err) {
          rej(err);
        } else {
          res(new WaveformData(wf));
        }
      });
    });
  }

  get duration() {
    return this.#waveformData.duration;
  }

  get channels() {
    return this.#waveformData.channels;
  }

  get sample_rate() {
    return this.#waveformData.sample_rate;
  }

  getNormalizedData(samples = this.#waveformData.length) {
    const channel = this.#waveformData.channel(0);
    const blockSize = Math.floor(this.#waveformData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(channel.max_sample(blockStart + j)); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }

    return normalize(filteredData);
  }

  toJSON(): JsonWaveformData {
    return this.#waveformData.toJSON();
  }

  length(): number {
    return this.#waveformData.length;
  }
}

function normalize(data: Array<number>) {
  const multiplier = Math.pow(Math.max(...data), -1);
  return data.map((n) => n * multiplier);
}
