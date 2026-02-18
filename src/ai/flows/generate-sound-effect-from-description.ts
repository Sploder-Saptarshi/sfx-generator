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
    .describe('The flavor of noise. Use "white" for harsh, "pink" for natural/rain, "brown" for deep/rumble, "velvet" for clicks.'),
  vibratoDepth: z
    .number()
    .min(0)
    .max(1)
    .describe('Vibrato intensity (0 to 1).'),
  vibratoRate: z
    .number()
    .min(0)
    .max(20)
    .describe('Vibrato rate in Hz (0 to 20).'),
  reverbAmount: z
    .number()
    .min(0)
    .max(1)
    .describe('Reverb mix (0 to 1).'),
  echoAmount: z
    .number()
    .min(0)
    .max(1)
    .describe('Echo mix (0 to 1).'),
  echoDelay: z
    .number()
    .min(0.01)
    .max(2)
    .describe('Echo delay time (0.01 to 2).'),
});
export type GenerateSoundEffectFromDescriptionOutput = z.infer<typeof GenerateSoundEffectFromDescriptionOutputSchema>;

const generateSoundEffectPrompt = ai.definePrompt({
  name: 'generateSoundEffectPrompt',
  input: {schema: GenerateSoundEffectFromDescriptionInputSchema},
  output: {schema: GenerateSoundEffectFromDescriptionOutputSchema},
  prompt: `You are an expert sound designer. Interpret the following description and generate synthesis parameters.

Description: {{{this}}}

Guidelines:
- If the sound is "noisy", "windy", or "mechanical", increase noiseAmount.
- Choose noiseType: 'white' (static/harsh), 'pink' (soothing/rain), 'brown' (low rumble), 'velvet' (sparse sparks).
- Set oscillators (waveformPairs) for tonal elements.
- Use reverbAmount and echoAmount for space.`,
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
