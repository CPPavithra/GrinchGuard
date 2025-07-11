import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  // Using gemini-1.5-flash-latest for fast and reliable text generation.
  model: 'googleai/gemini-1.5-flash-latest',
});
