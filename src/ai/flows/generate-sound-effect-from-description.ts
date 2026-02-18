'use server';
/**
 * @fileOverview A Genkit flow for generating sound effect parameters from a text description.
 *
 * - generateSoundEffectFromDescription - A function that generates sound parameters based on a text description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSoundEffectFromDescriptionInputSchema = z
  .string()
  .describe('A text description of the desired sound effect, e.g., "metallic tube ring" or "crunchy laser burst".');
export type GenerateSoundEffectFromDescriptionInput = z.infer<typeof GenerateSoundEffectFromDescriptionInputSchema>;

const GenerateSoundEffectFromDescriptionOutputSchema = z.object({
  attack: z.number().min(0).max(1),
  decay: z.number().min(0).max(2),
  envelopeShape: z.enum(['linear', 'exponential', 'reverse']),
  baseFrequency: z.number().min(20).max(20000),
  harmony: z.number().min(0).max(1),
  quantize: z.number().min(0).max(48),
  timbre: z.string(),
  waveformPairs: z.array(z.enum(['sine', 'square', 'sawtooth', 'triangle'])).min(1).max(2),
  noiseAmount: z.number().min(0).max(1),
  noiseType: z.enum(['white', 'pink', 'brown', 'velvet']),
  noiseModulation: z.number().min(0).max(1),
  filterCutoff: z.number().min(0).max(10000),
  filterResonance: z.number().min(0).max(20),
  combAmount: z.number().min(0).max(0.95).describe('Amount of metallic resonance feedback.'),
  combDelay: z.number().min(0.0001).max(0.05).describe('Delay time for the comb filter resonance.'),
  vibratoDepth: z.number().min(0).max(1),
  vibratoRate: z.number().min(0).max(20),
  reverbAmount: z.number().min(0).max(1),
  echoAmount: z.number().min(0).max(1),
  echoDelay: z.number().min(0).max(0.5),
});
export type GenerateSoundEffectFromDescriptionOutput = z.infer<typeof GenerateSoundEffectFromDescriptionOutputSchema>;

const generateSoundEffectPrompt = ai.definePrompt({
  name: 'generateSoundEffectPrompt',
  input: {schema: GenerateSoundEffectFromDescriptionInputSchema},
  output: {schema: GenerateSoundEffectFromDescriptionOutputSchema},
  prompt: `You are an expert sound designer. Interpret the description and generate synthesis parameters.

Description: {{{this}}}

Guidelines:
- Use "combAmount" and "combDelay" for metallic, industrial, robotic, or ringing textures. Higher combAmount (0.7-0.9) creates strong resonance.
- Use "quantize" for retro, chiptune, or stepped pitch effects.
- Use "envelopeShape" = "reverse" for swelling, rising, or sudden percussive hits.
- Use "envelopeShape" = "linear" for consistent, standard fades.
- Use "noiseModulation" for grit and debris.
- Use "filterCutoff" to dampen sounds. 0 means bypass.`,
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
