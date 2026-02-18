"use client";

import { useState } from "react";
import { SoundParams, defaultSoundParams, WaveformType, NoiseType, EnvelopeShape, PlaybackMode } from "@/types/audio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dices, RefreshCw } from "lucide-react";

interface RandomizerProps {
  onRandomize: (params: SoundParams) => void;
}

export default function Randomizer({ onRandomize }: RandomizerProps) {
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 999999));

  // Simple seeded PRNG (Mulberry32)
  const mulberry32 = (a: number) => {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };

  const handleRandomize = () => {
    const nextRand = mulberry32(seed);
    
    const pick = <T,>(arr: T[]): T => arr[Math.floor(nextRand() * arr.length)];
    const range = (min: number, max: number) => min + nextRand() * (max - min);
    const intRange = (min: number, max: number) => Math.floor(range(min, max + 1));

    const waveforms: WaveformType[] = ["sine", "square", "sawtooth", "triangle"];
    const noiseTypes: NoiseType[] = ["white", "brown", "pink", "velvet"];
    const envelopeShapes: EnvelopeShape[] = ["piano", "strings", "percussive", "reverse"];
    const playbackModes: PlaybackMode[] = ["once", "repeat", "ping-pong"];

    // Randomize Waveforms (1 or 2)
    const w1 = pick(waveforms);
    const w2 = pick(waveforms);
    const waveformPairs = nextRand() > 0.3 ? [w1, w2] : [w1];

    const randomParams: SoundParams = {
      ...defaultSoundParams,
      name: `Random #${seed}`,
      attack: range(0, 0.5),
      decay: range(0.1, 1.5),
      envelopeShape: pick(envelopeShapes),
      baseFrequency: range(40, 1200),
      frequencyDrift: intRange(-24, 24),
      harmony: range(0, 1),
      quantize: nextRand() > 0.5 ? pick([0, 12, 24, 48]) : 0,
      waveformPairs: waveformPairs as WaveformType[],
      distortion: nextRand() > 0.5 ? range(0, 1) : 0,
      noiseAmount: range(0, 0.8),
      noiseType: pick(noiseTypes),
      lfoAmount: nextRand() > 0.7 ? range(0, 1) : 0,
      lfoRate: range(0.1, 15),
      filterCutoff: nextRand() > 0.3 ? range(200, 8000) : 0,
      filterResonance: range(0, 15),
      combAmount: nextRand() > 0.8 ? range(0, 0.9) : 0,
      combDelay: range(0.001, 0.03),
      vibratoDepth: nextRand() > 0.7 ? range(0, 0.8) : 0,
      vibratoRate: range(1, 15),
      reverbAmount: range(0.1, 0.8),
      echoAmount: nextRand() > 0.8 ? range(0, 0.6) : 0,
      echoDelay: range(0.1, 0.5),
      sequenceSteps: intRange(1, 4),
      sequenceOffsets: [intRange(-12, 12), intRange(-12, 12), intRange(-12, 12), intRange(-12, 12)],
      sequenceBpm: intRange(120, 800),
      playbackMode: pick(playbackModes),
      loopCount: intRange(1, 4),
    };

    onRandomize(randomParams);
    // Increment seed for the next click if user wants another variation
    setSeed(s => s + 1);
  };

  return (
    <div className="w-full bg-muted/20 border-y border-white/5 py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/50 select-none shrink-0">
          <Dices className="w-4 h-4" />
          Entropy Engine
        </div>
        
        <div className="flex flex-1 items-center gap-2 w-full">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">Seed</span>
            <Input
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
              className="pl-12 h-10 bg-white/5 border-white/10 rounded-xl font-mono text-sm focus:ring-accent/50"
            />
          </div>
          
          <Button 
            onClick={handleRandomize}
            className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 rounded-xl h-10 px-8 font-bold gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            RANDOMIZE
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSeed(Math.floor(Math.random() * 999999))}
            className="h-10 w-10 rounded-xl hover:bg-white/10"
            title="New Random Seed"
          >
            <RefreshCw className="w-4 h-4 rotate-45" />
          </Button>
        </div>
      </div>
    </div>
  );
}
