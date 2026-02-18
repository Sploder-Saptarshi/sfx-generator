export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';
export type NoiseType = 'white' | 'brown' | 'pink' | 'velvet';

export interface SoundParams {
  id?: string;
  name: string;
  attack: number;
  decay: number;
  baseFrequency: number;
  harmony: number;
  timbre: string;
  waveformPairs: WaveformType[];
  noiseAmount: number;
  noiseType: NoiseType;
  vibratoDepth: number;
  vibratoRate: number;
  reverbAmount: number;
  echoAmount: number;
  echoDelay: number;
  createdAt?: number;
}

export const defaultSoundParams: SoundParams = {
  name: "New Sound",
  attack: 0.1,
  decay: 0.5,
  baseFrequency: 440,
  harmony: 0.5,
  timbre: "bright",
  waveformPairs: ["sine"],
  noiseAmount: 0,
  noiseType: "white",
  vibratoDepth: 0,
  vibratoRate: 0,
  reverbAmount: 0.2,
  echoAmount: 0,
  echoDelay: 0.3,
};
