'use server';
/**
 * @fileOverview A Genkit flow for generating sound effect parameters from a text description.
 *
 * - generateSoundEffectFromDescription - A function that generates sound parameters based on a text description.
 * - GenerateSoundEffectFromDescriptionInput - The input type for the generateSoundEffectFromDescription function.
 * - GenerateSoundEffectFromDescriptionOutput - The return type for the generateSoundEffectFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSoundEffectFromDescriptionInputSchema = z
  .string()
  .describe('A text description of the desired sound effect, e.g., "space gun laser" or "forest ambiance".');
export type GenerateSoundEffectFromDescriptionInput = z.infer<typeof GenerateSoundEffectFromDescriptionInputSchema>;

const GenerateSoundEffectFromDescriptionOutputSchema = z.object({
  attack: z
    .number()
    .min(0)
    .max(1)
    .describe('The attack time of the sound in seconds (0 to 1).'),
  decay: z
    .number()
    .min(0)
    .max(1)
    .describe('The decay time of the sound in seconds (0 to 1).'),
  baseFrequency: z
    .number()
    .min(20)
    .max(20000)
    .describe('The fundamental frequency of the sound in Hz (20 to 20000).'),
  harmony: z
    .number()
    .min(0)
    .max(1)
    .describe('Harmonic complexity (0 to 1).'),
  timbre: z
    .string()
    .describe('Tonal quality description.'),
  waveformPairs: z
    .array(z.enum(['sine', 'square', 'sawtooth', 'triangle']))
    .min(1)
    .max(2)
    .describe('Oscillator waveforms to blend.'),
  noiseAmount: z
    .number()
    .min(0)
    .max(1)
    .describe('The volume of the noise layer (0 to 1).'),
  noiseType: z
    .enum(['white', 'pink', 'brown', 'velvet'])
    .describe('The flavor of noise.'),
  noiseModulation: z
    .number()
    .min(0)
    .max(1)
    .describe('How much the noise jitters/breaks the oscillator pitch (0 to 1). Higher for broken/debris sounds.'),
  filterCutoff: z
    .number()
    .min(20)
    .max(10000)
    .describe('The filter cutoff frequency in Hz.'),
  filterResonance: z
    .number()
    .min(0)
    .max(20)
    .describe('The filter resonance/Q factor.'),
  vibratoDepth: z
    .number()
    .min(0)
    .max(1)
    .describe('Vibrato intensity.'),
  vibratoRate: z
    .number()
    .min(0)
    .max(20)
    .describe('Vibrato rate in Hz.'),
  reverbAmount: z
    .number()
    .min(0)
    .max(1)
    .describe('Reverb mix.'),
  echoAmount: z
    .number()
    .min(0)
    .max(1)
    .describe('Echo mix.'),
  echoDelay: z
    .number()
    .min(0.01)
    .max(2)
    .describe('Echo delay time.'),
});
export type GenerateSoundEffectFromDescriptionOutput = z.infer<typeof GenerateSoundEffectFromDescriptionOutputSchema>;

const generateSoundEffectPrompt = ai.definePrompt({
  name: 'generateSoundEffectPrompt',
  input: {schema: GenerateSoundEffectFromDescriptionInputSchema},
  output: {schema: GenerateSoundEffectFromDescriptionOutputSchema},
  prompt: `You are an expert sound designer. Interpret the following description and generate synthesis parameters.

Description: {{{this}}}

Guidelines for Scuplting:
- Use "noiseModulation" for broken, grit, or debris-like sounds. It modifies the oscillator pitch using the noise.
- Use "filterCutoff" and "filterResonance" to glue noise and oscillators together.
- For "lo-fi" or "dirty" sounds, use brown/white noise with high noiseModulation and low filterCutoff.
- For "clean" sounds, keep noiseModulation low and filterCutoff high.`,
});

const generateSoundEffectFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateSoundEffectFromDescriptionFlow',
    inputSchema: GenerateSoundEffectFromDescriptionInputSchema,
    outputSchema: GenerateSoundEffectFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateSoundEffectPrompt(input);
    return output!;
  }
);

export async function generateSoundEffectFromDescription(
  input: GenerateSoundEffectFromDescriptionInput
): Promise<GenerateSoundEffectFromDescriptionOutput> {
  return generateSoundEffectFromDescriptionFlow(input);
}
