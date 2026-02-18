# Polyphonic Debris: SoundSculptor

<p align="center">
  <img src="img/hero.png" alt="Polyphonic Debris SoundSculptor Hero Image" width="100%">
</p>

A next-generation retro game sound effects generator and rhythmic EDM machine powered by **Genkit AI** and the **Web Audio API**. Sculpt unique audio assets using natural language prompts, seeded randomization, or detailed synthesis controls, then arrange them into multi-track loops.

## 🚀 [Try it Now: Live Demo](https://neurofuzzy.github.io/sfx-generator/)

---

## 🚀 Features

### 🎨 Sound Sculptor
- **AI-Powered Generation**: Describe a sound (e.g., "metallic laser with a heavy echo") and let Gemini 2.5 Flash generate the synthesis parameters.
- **Entropy Engine**: A seeded PRNG randomizer. Generate unique sounds that are perfectly reproducible and shareable via seed numbers.
- **Advanced Synthesis Engine**:
  - **Oscillators**: Multiple waveforms (Sine, Square, Sawtooth, Triangle) with harmony and frequency drift.
  - **Distortion (Crunch)**: A non-linear waveshaper to add grit and harmonic saturation.
  - **Arpeggiator**: Integrated pitch sequencer with "Once," "Repeat," and "Ping-Pong" playback modes.
  - **Sculptor Filters**: Low-pass cutoff with resonance and a metallic **Comb Filter** for industrial textures.
  - **Envelopes**: Intuitive presets (Piano, Strings, Percussive, Reverse) to define the "feel" of your sound.

### 🎹 EDM Composer
- **8-Track Sequencer**: Arrange your sculpted sounds into complex patterns.
- **Melodic Control**: Per-step note selection (A-G) with global **Key** and **Scale** (Major, Minor, Natural) synchronization.
- **Loop Library**: Save and load full compositions. Each loop captures a snapshot of the specific sounds used in its tracks.
- **WAV Export**: Render your entire 8-track loop directly to a high-quality audio file.

### 🌐 Sharing & Library
- **URL Sharing**: All synthesis parameters are compressed into a compact URL string for instant sharing.
- **Library Management**: Import/Export your entire preset library as JSON.
- **Persistence**: All sounds and loops are saved to browser local storage.

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
2. Go to your repository **Settings > Pages**.
3. Under **Build and deployment > Source**, change the dropdown to **GitHub Actions**.
4. The included GitHub Action will automatically build and deploy your site.

*Note: The app automatically detects the `/sfx-generator/` base path during GitHub Actions builds.*
