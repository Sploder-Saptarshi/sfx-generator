# Polyphonic Debris: SoundSculptor

<p align="center">
  <img src="img/hero.png" alt="Polyphonic Debris SoundSculptor Hero Image" width="100%">
</p>

A next-generation procedural audio engine for game developers. Sculpt unique audio assets using natural language prompts, seeded randomization, or detailed synthesis controls, then arrange them into multi-track rhythmic loops.

## 🚀 [Try it Now: Live Demo](https://neurofuzzy.github.io/sfx-generator/)

---

## 🎨 Features

### 🛠️ Portable SFX Library for Game Developers
SoundSculptor is more than just a toy—it's a "Procedural SFX Pipeline." Instead of shipping large, static WAV files, you can ship tiny JSON objects and synthesize high-fidelity sounds on the fly at runtime.

#### Using the SFX Client
The `SfxClient` is a self-contained JavaScript class that works in any environment (Phaser, Three.js, Vanilla JS, React).

```typescript
import { SfxClient } from './lib/sfx-client';

// 1. Load your exported JSON library
const sfx = new SfxClient();
sfx.loadLibrary(mySoundLibraryJson);

// 2. Play a sound by name
sfx.playSound("Laser_01");

// 3. Simulate distance (lower volume, muffled lowpass)
sfx.playSound("Explosion_Large", 0.5, 800); 

// 4. Trigger variations (pitch multiplier)
sfx.playSound("Coin", 1.0, undefined, 1.2); 
```

### 🧠 AI Sound Sculptor
- **AI-Powered Generation**: Describe a sound (e.g., "rusty gate creaking") and Gemini 2.5 Flash generates the synthesis parameters.
- **Entropy Engine**: A seeded PRNG randomizer. Generate unique sounds that are perfectly reproducible and shareable via seed numbers.

### 🎹 EDM Composer
- **8-Track Sequencer**: Arrange your sculpted sounds into complex patterns.
- **Loop Library**: Save and load full compositions. Each loop captures a snapshot of the specific sounds used in its tracks.
- **WAV Export**: Render your entire loop directly to a high-quality audio file for external use.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **AI**: Genkit with Google AI (Gemini 2.5 Flash)
- **Audio**: Custom Web Audio API Synthesis Engine
- **Icons**: Lucide React

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file and add your `GOOGLE_GENAI_API_KEY`.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is configured for static export. To deploy to GitHub Pages, simply push to your repository. The included GitHub Action will automatically build and deploy the site.

---
*Created with ❤️ for sound designers and game developers.*
