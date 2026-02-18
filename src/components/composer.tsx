"use client";

import { useState, useEffect, useCallback } from "react";
import { SoundParams, CompositionState, ComposerTrack } from "@/types/audio";
import { audioEngine } from "@/lib/audio-engine";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Square, 
  Trash2, 
  Music, 
  LayoutGrid, 
  Volume2, 
  Settings2,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ComposerProps {
  library: SoundParams[];
}

const INITIAL_COMPOSITION: CompositionState = {
  bpm: 128,
  tracks: Array.from({ length: 8 }, (_, i) => ({
    id: `track-${i}`,
    soundId: null,
    steps: Array(8).fill(false),
    volume: 0.8
  }))
};

export default function Composer({ library }: ComposerProps) {
  const [comp, setComp] = useState<CompositionState>(INITIAL_COMPOSITION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("sound-composition");
    if (saved) {
      try {
        setComp(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load composition");
      }
    }
  }, []);

  const saveComp = (newComp: CompositionState) => {
    setComp(newComp);
    localStorage.setItem("sound-composition", JSON.stringify(newComp));
  };

  const toggleStep = (trackIndex: number, stepIndex: number) => {
    const newTracks = [...comp.tracks];
    newTracks[trackIndex].steps[stepIndex] = !newTracks[trackIndex].steps[stepIndex];
    saveComp({ ...comp, tracks: newTracks });
  };

  const assignSound = (trackIndex: number, soundId: string | null) => {
    const newTracks = [...comp.tracks];
    newTracks[trackIndex].soundId = soundId;
    saveComp({ ...comp, tracks: newTracks });
  };

  const updateBpm = (val: number) => {
    saveComp({ ...comp, bpm: val });
  };

  const clearGrid = () => {
    saveComp(INITIAL_COMPOSITION);
    if (isPlaying) stop();
  };

  const play = () => {
    if (isPlaying) {
      stop();
    } else {
      setIsPlaying(true);
      audioEngine.playComposition(comp, library, (step) => {
        setActiveStep(step);
      });
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setActiveStep(-1);
    audioEngine.stopComposition();
  };

  useEffect(() => {
    // If BPM changes while playing, restart loop
    if (isPlaying) {
        audioEngine.playComposition(comp, library, (step) => {
            setActiveStep(step);
        });
    }
  }, [comp.bpm, library]);

  return (
    <div className="flex flex-col gap-6 p-4 glass-panel rounded-3xl border-accent/20 bg-accent/5">
      {/* Transport Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Button 
            size="lg" 
            onClick={play}
            className={`w-48 h-14 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-destructive hover:bg-destructive/90' : 'bg-accent hover:bg-accent/90 shadow-accent/20'}`}
          >
            {isPlaying ? (
              <>
                <Square className="w-6 h-6 mr-2 fill-current" />
                STOP LOOP
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2 fill-current" />
                START COMPOSER
              </>
            )}
          </Button>
          <div className="flex flex-col gap-1 min-w-[150px]">
            <div className="flex justify-between text-xs font-bold text-accent uppercase tracking-widest">
              <span>Tempo</span>
              <span>{comp.bpm} BPM</span>
            </div>
            <Slider 
              value={[comp.bpm]} 
              min={60} 
              max={200} 
              step={1} 
              onValueChange={([v]) => updateBpm(v)}
              className="accent-accent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearGrid} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Grid
            </Button>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <LayoutGrid className="w-4 h-4" />
                8x8 Sequencer
            </div>
        </div>
      </div>

      {/* Sequencing Grid */}
      <div className="space-y-4">
        {comp.tracks.map((track, tIdx) => (
          <div key={track.id} className="flex items-center gap-3 group">
            {/* Track Info / Sound Selector */}
            <div className="w-48 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`w-full justify-between h-12 rounded-xl border-white/10 text-xs font-medium bg-white/5 hover:bg-white/10 ${track.soundId ? 'text-foreground' : 'text-muted-foreground italic'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                        <Music className={`w-3.5 h-3.5 ${track.soundId ? 'text-accent' : 'text-muted-foreground'}`} />
                        <span className="truncate">{track.soundId ? library.find(s => s.id === track.soundId)?.name : "Assign Sound..."}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 glass-panel border-white/10">
                  <DropdownMenuItem onClick={() => assignSound(tIdx, null)} className="text-destructive">
                    Remove Sound
                  </DropdownMenuItem>
                  {library.map((sound) => (
                    <DropdownMenuItem key={sound.id} onClick={() => assignSound(tIdx, sound.id!)}>
                      {sound.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Steps */}
            <div className="flex-1 grid grid-cols-8 gap-2 h-12">
              {track.steps.map((isActive, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => toggleStep(tIdx, sIdx)}
                  className={`relative rounded-xl border transition-all duration-200 active:scale-90 ${
                    isActive 
                      ? 'bg-accent shadow-lg shadow-accent/40 border-accent' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  } ${activeStep === sIdx ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-background' : ''}`}
                >
                  {activeStep === sIdx && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
                  )}
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto shadow-sm" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <Settings2 className="w-3 h-3" />
            Polyphonic Master Out • 44.1kHz • 16-Step Resolution
          </div>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <Volume2 className="w-3 h-3 text-muted-foreground" />
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[80%] h-full bg-accent" />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}