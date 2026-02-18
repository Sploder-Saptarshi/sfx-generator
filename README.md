# Polyphonic Debris: SoundSculptor

A next-generation retro game sound effects generator powered by **Genkit AI** and the **Web Audio API**. Sculpt unique audio assets for your games using natural language prompts or detailed synthesis controls.

## 🚀 Features

- **AI-Powered Sculpting**: Describe a sound (e.g., "metallic laser with a heavy echo") and let Gemini 2.5 Flash generate the synthesis parameters.
- **Advanced Synthesis Engine**:
  - **Oscillators**: Multiple waveforms (Sine, Square, Sawtooth, Triangle) with harmony and frequency drift.
  - **Pitch Sequencer**: Create melodic progressions (up to 4 steps) for "ca-ching" coin sounds, power-ups, and more.
  - **Sculptor Filters**: Low-pass cutoff with resonance and a metallic **Comb Filter** for industrial textures.
  - **Envelopes**: Intuitive presets (Piano, Strings, Percussive, Reverse) to define the "feel" of your sound.
  - **Space & Mod**: Integrated Reverb, Echo, and a Volume LFO (Tremolo) for rhythmic pulsing.
- **Game FX Quick Bank**: Instant access to classic game archetypes like "8-Bit Jump," "Mega Explosion," and "Teleport Warp."
- **Library Management**:
  - Save presets to browser local storage.
  - Import and Export your entire library as JSON files.
  - Export sculpted sounds directly to high-quality **.WAV** files.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **AI**: Genkit with Google AI (Gemini 2.5 Flash)
- **Audio**: Custom Web Audio API Engine
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

## 🌐 Deployment to GitHub Pages

This project is configured for static export. To deploy to GitHub Pages:

1. Push your code to a GitHub repository.
2. The included GitHub Action (`.github/workflows/nextjs.yml`) will automatically build and deploy your site to the `gh-pages` branch.
3. In your GitHub repository settings, under **Pages**, ensure the source is set to "GitHub Actions".

*Note: If hosting on a project subpath (e.g., `username.github.io/repo-name`), remember to set the `basePath` in `next.config.ts`.*
