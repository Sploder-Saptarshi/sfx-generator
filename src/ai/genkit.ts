/**
 * Genkit initialization is guarded to ensure it only runs in a Node.js environment.
 * We use dynamic require to avoid bundling Node-specific libraries in the browser.
 */
export const ai = typeof window === 'undefined'
  ? (() => {
      try {
        const {genkit} = require('genkit');
        const {googleAI} = require('@genkit-ai/google-genai');
        return genkit({
          plugins: [googleAI()],
          model: 'googleai/gemini-2.5-flash',
        });
      } catch (e) {
        console.error('Failed to initialize Genkit:', e);
        return null;
      }
    })()
  : (null as any);
