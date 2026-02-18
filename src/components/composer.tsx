"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SoundParams, CompositionState, GAME_PRESETS } from "@/types/audio";
import { audioEngine } from "@/lib/audio-engine";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Square, 
  Trash2, 
  Music, 
  LayoutGrid, 
  Volume2, 
  Settings2,
  ChevronDown,
  Download,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComposerProps {
  library: SoundParams[];
}

const MUSICAL_KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALES = ["Major", "Minor", "Natural", "Chromatic"];
const NOTES_POOL = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"];

const INITIAL_COMPOSITION: CompositionState = {
  bpm: 128,
  key: "C",
  scale: "Major",
  tracks: Array.from({ length: 8 }, (_, i) => ({
    id: `track-${i}`,
    soundId: null,
    steps: Array(8).fill(false),
    stepNotes: Array(8).fill("C4"),
    volume: 0.8
  }))
};

export default function Composer({ library }: ComposerProps) {
  const userLibrary = useMemo(() => {
    const gamePresetNames = GAME_PRESETS.map(p => p.name);
    return library.filter(p => !gamePresetNames.includes(p.name));
  }, [library]);

  const [comp, setComp] = useState<CompositionState>(INITIAL_COMPOSITION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [editingStep, setEditingStep] = useState<{tIdx: number, sIdx: number} | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("sound-composition");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setComp({
          ...INITIAL_COMPOSITION,
          ...parsed,
          tracks: parsed.tracks.map((t: any) => ({
            ...INITIAL_COMPOSITION.tracks[0],
            ...t,
            stepNotes: t.stepNotes || Array(8).fill(t.note || "C4")
          }))
        });
      } catch (e) {
        console.error("Failed to load composition");
      }
    }
  }, []);

  const saveComp = (newComp: CompositionState) => {
    setComp(newComp);
    localStorage.setItem("sound-composition", JSON.stringify(newComp));
  };

  const handleCellClick = (tIdx: number, sIdx: number) => {
    const newTracks = [...comp.tracks];
    // If it's not active, activate it first with a default note
    if (!newTracks[tIdx].steps[sIdx]) {
      newTracks[tIdx].steps[sIdx] = true;
      newTracks[tIdx].stepNotes[sIdx] = "C4";
      saveComp({ ...comp, tracks: newTracks });
    }
    // Open picker
    setEditingStep({ tIdx, sIdx });
  };

  const removeStep = (tIdx: number, sIdx: number) => {
    const newTracks = [...comp.tracks];
    newTracks[tIdx].steps[sIdx] = false;
    saveComp({ ...comp, tracks: newTracks });
    if (editingStep?.tIdx === tIdx && editingStep?.sIdx === sIdx) {
      setEditingStep(null);
    }
  };

  const setStepNote = (trackIndex: number, stepIndex: number, note: string) => {
    const newTracks = [...comp.tracks];
    newTracks[trackIndex].stepNotes[stepIndex] = note;
    saveComp({ ...comp, tracks: newTracks });
    setEditingStep(null);
  };

  const assignSound = (trackIndex: number, soundId: string | null) => {
    const newTracks = [...comp.tracks];
    newTracks[trackIndex].soundId = soundId;
    saveComp({ ...comp, tracks: newTracks });
  };

  const updateBpm = (val: number) => {
    saveComp({ ...comp, bpm: val });
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

  const exportWav = async () => {
    const blob = await audioEngine.exportCompositionToWav(comp, library);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `composition-${Date.now()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard listener for note entry
  useEffect(() => {
    if (!editingStep) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      // Melodic notes
      if (["A", "B", "C", "D", "E", "F", "G"].includes(key)) {
        setStepNote(editingStep.tIdx, editingStep.sIdx, `${key}4`);
      }
      // Removal shortcut
      if (key === "X") {
        removeStep(editingStep.tIdx, editingStep.sIdx);
      }
      if (e.key === "Escape") setEditingStep(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingStep, comp]);

  return (
    <div className="flex flex-col gap-6 p-4 glass-panel rounded-3xl border-accent/20 bg-accent/5">
      {/* Transport & Global Settings */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex flex-wrap items-center gap-6">
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
                PLAY LOOP
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            onClick={exportWav}
            className="h-14 rounded-2xl border-white/10 hover:bg-white/10"
          >
            <Download className="w-5 h-5 mr-2" />
            EXPORT .WAV
          </Button>

          <div className="flex flex-col gap-1 min-w-[120px]">
            <div className="flex justify-between text-xs font-bold text-accent uppercase tracking-widest">
              <span>Tempo</span>
              <span>{comp.bpm}</span>
            </div>
            <Slider 
              value={[comp.bpm]} 
              min={60} 
              max={200} 
              step={1} 
              onValueChange={([v]) => updateBpm(v)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Key</span>
              <Select value={comp.key} onValueChange={(v) => saveComp({...comp, key: v})}>
                <SelectTrigger className="h-9 w-20 bg-white/5 border-white/10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MUSICAL_KEYS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Scale</span>
              <Select value={comp.scale} onValueChange={(v) => saveComp({...comp, scale: v})}>
                <SelectTrigger className="h-9 w-28 bg-white/5 border-white/10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCALES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => saveComp(INITIAL_COMPOSITION)} className="text-muted-foreground hover:text-destructive h-9 rounded-xl">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Grid
            </Button>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <LayoutGrid className="w-4 h-4" />
                8x8 Melodic Sequencer
            </div>
        </div>
      </div>

      {/* Sequencing Grid */}
      <div className="space-y-4">
        {comp.tracks.map((track, tIdx) => (
          <div key={track.id} className="flex items-center gap-3 group">
            {/* Track Info / Sound Selector */}
            <div className="w-48 flex shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`flex-1 justify-between h-12 rounded-xl border-white/10 text-[10px] font-medium bg-white/5 hover:bg-white/10 ${track.soundId ? 'text-foreground' : 'text-muted-foreground italic'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                        <Music className={`w-3.5 h-3.5 ${track.soundId ? 'text-accent' : 'text-muted-foreground'}`} />
                        <span className="truncate">{track.soundId ? userLibrary.find(s => s.id === track.soundId)?.name : "Assign..."}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 glass-panel border-white/10">
                  <DropdownMenuItem onClick={() => assignSound(tIdx, null)} className="text-destructive">
                    Remove Sound
                  </DropdownMenuItem>
                  {userLibrary.length === 0 ? (
                    <div className="p-3 text-xs text-muted-foreground italic">Save a sound in Sculptor first!</div>
                  ) : (
                    userLibrary.map((sound) => (
                      <DropdownMenuItem key={sound.id} onClick={() => assignSound(tIdx, sound.id!)}>
                        {sound.name}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Steps with per-cell notes */}
            <div className="flex-1 grid grid-cols-8 gap-2 h-12">
              {track.steps.map((isActive, sIdx) => (
                <div key={sIdx} className="relative group/cell">
                  <Popover 
                    open={editingStep?.tIdx === tIdx && editingStep?.sIdx === sIdx} 
                    onOpenChange={(open) => setEditingStep(open ? {tIdx, sIdx} : null)}
                  >
                    <PopoverTrigger asChild>
                      <button
                        onClick={() => handleCellClick(tIdx, sIdx)}
                        className={`w-full h-full rounded-xl border transition-all duration-200 active:scale-95 flex flex-col items-center justify-center ${
                          isActive 
                            ? 'bg-accent shadow-lg shadow-accent/40 border-accent' 
                            : 'bg-white/5 border-white/5 hover:border-white/20'
                        } ${activeStep === sIdx ? 'ring-2 ring-white/40' : ''}`}
                      >
                        {activeStep === sIdx && (
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl pointer-events-none" />
                        )}
                        {isActive && (
                            <span className="text-[10px] font-bold text-white/80 select-none">
                                {track.stepNotes[sIdx].replace(/[0-9]/, '')}
                            </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 glass-panel p-2">
                        <div className="grid grid-cols-4 gap-1">
                            {NOTES_POOL.map(note => (
                                <Button 
                                    key={note} 
                                    size="sm" 
                                    variant={track.stepNotes[sIdx] === note ? "default" : "ghost"}
                                    className="h-8 text-[10px] font-bold"
                                    onClick={() => setStepNote(tIdx, sIdx, note)}
                                >
                                    {note.replace(/[0-9]/, '')}
                                </Button>
                            ))}
                        </div>
                        <div className="mt-2 text-[8px] text-muted-foreground text-center uppercase tracking-widest font-bold">
                            Shortcut: Press A-G or X
                        </div>
                    </PopoverContent>
                  </Popover>

                  {/* Corner Remove Button (X) */}
                  {isActive && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStep(tIdx, sIdx);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/cell:opacity-100 flex items-center justify-center shadow-md transition-opacity z-10 hover:scale-110 active:scale-90"
                      title="Remove Note (Shortcut: X)"
                    >
                        <X className="w-3 h-3" strokeWidth={3} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <Settings2 className="w-3 h-3" />
            Polyphonic Master Out • 44.1kHz • Per-Step Note Rendering
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
