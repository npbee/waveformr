import { WaveformData as BBCWaveformData } from "./deps.ts";

export interface WaveformDataJson {
  duration: number;
  sample_rate: number;
  bits: number;
  normalized_data: Array<number>;
}

export class WaveformData {
  #waveformData: BBCWaveformData;

  constructor(waveformData: BBCWaveformData) {
    this.#waveformData = waveformData;
  }

  static create(buffer: ArrayBuffer) {
    const wf = BBCWaveformData.create(buffer);
    return new WaveformData(wf);
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

  toJSON(samples = this.#waveformData.length): WaveformDataJson {
    let duration = this.#waveformData.duration;
    let sample_rate = this.#waveformData.sample_rate;
    let bits = this.#waveformData.bits;
    let normalized_data = this.getNormalizedData(samples);
    return {
      duration,
      sample_rate,
      bits,
      normalized_data,
    };
  }
}

function normalize(data: Array<number>) {
  const multiplier = Math.pow(Math.max(...data), -1);
  return data.map((n) => n * multiplier);
}
