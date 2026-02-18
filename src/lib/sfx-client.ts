import { SoundParams } from "@/types/audio";
import { audioEngine } from "./audio-engine";

/**
 * SFX Client for Game Developers
 * 
 * This class provides a simple interface to load and play back 
 * procedurally generated sounds created in SoundSculptor.
 */
export class SfxClient {
  private library: Map<string, SoundParams> = new Map();

  constructor() {}

  /**
   * Loads a JSON library of sound effects.
   * @param json A JSON string containing an array of SoundParams objects.
   */
  loadLibrary(json: string) {
    try {
      const data = JSON.parse(json);
      const sounds = Array.isArray(data) ? data : [data];
      
      sounds.forEach((sound: SoundParams) => {
        if (sound.name) {
          this.library.set(sound.name, sound);
        }
      });
      console.log(`SFX Client: Loaded ${this.library.size} sounds.`);
    } catch (e) {
      console.error("SFX Client: Failed to load library", e);
    }
  }

  /**
   * Plays a sound from the library with optional runtime overrides.
   * @param key The name of the sound to play.
   * @param volume Local volume multiplier (0.0 to 1.0).
   * @param lowpassFreq Cutoff frequency override in Hz (e.g. for distance effects).
   */
  async playSound(key: string, volume: number = 1.0, lowpassFreq?: number) {
    const params = this.library.get(key);
    if (!params) {
      console.warn(`SFX Client: Sound "${key}" not found in library.`);
      return;
    }

    // Ensure the Web Audio context is active
    await audioEngine.init();

    // Create a temporary override for distance simulation
    const activeParams: SoundParams = {
      ...params,
      filterCutoff: lowpassFreq !== undefined ? lowpassFreq : params.filterCutoff,
    };

    // Trigger playback through the core engine
    audioEngine.play(activeParams, 0, undefined, volume);
  }

  /**
   * Returns a list of all registered sound names.
   */
  getKeys(): string[] {
    return Array.from(this.library.keys());
  }
}

// Export a singleton instance for easy web use
export const sfx = new SfxClient();