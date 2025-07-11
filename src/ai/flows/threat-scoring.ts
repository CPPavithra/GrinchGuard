// threat-scoring.ts
'use server';

/**
 * @fileOverview AI-powered threat scoring system for user sessions.
 *
 * This module defines a Genkit flow to dynamically score the risk level of user sessions
 * based on real-time behavioral analysis, aiding in the identification of potential Grinch Bot attacks.
 *
 * @module threatScoring
 * @exports {
 *   scoreSessionThreat - A function that scores the threat level of a user session.
 *   ThreatScoreInput - The input type for the scoreSessionThreat function.
 *   ThreatScoreOutput - The return type for the scoreSessionThreat function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the threat scoring flow
const ThreatScoreInputSchema = z.object({
  sessionId: z.string().describe('The unique identifier for the user session.'),
  headers: z.record(z.string()).describe('The HTTP headers associated with the session.'),
  behaviorVector: z
    .array(z.number())
    .describe('A vector representing the user behavior during the session.'),
  ipEntropy: z.number().describe('The entropy of the IP address associated with the session.'),
  timeBetweenRequests: z
    .array(z.number())
    .describe('An array of time differences between requests in milliseconds.'),
  resourceAccessed: z.string().describe('Resources being accessed by the user.'),
});
export type ThreatScoreInput = z.infer<typeof ThreatScoreInputSchema>;

// Define the output schema for the threat scoring flow
const ThreatScoreOutputSchema = z.object({
  threatScore: z
    .number()
    .describe(
      'A numerical score representing the threat level of the session (0-100, higher is riskier).'
    ),
  explanation: z
    .string()
    .describe('A detailed explanation of why the session received the given threat score.'),
});
export type ThreatScoreOutput = z.infer<typeof ThreatScoreOutputSchema>;


export async function scoreSessionThreat(input: ThreatScoreInput): Promise<ThreatScoreOutput> {
  return threatScoringFlow(input);
}

// Define the schema for the prompt itself, with complex types as strings
const ThreatScorePromptInputSchema = z.object({
    sessionId: z.string(),
    headers: z.string(),
    behaviorVector: z.string(),
    ipEntropy: z.number(),
    timeBetweenRequests: z.string(),
    resourceAccessed: z.string(),
});


// Define the prompt for the threat scoring
const threatScoringPrompt = ai.definePrompt({
  name: 'threatScoringPrompt',
  input: {schema: ThreatScorePromptInputSchema},
  output: {schema: ThreatScoreOutputSchema},
  prompt: `You are an AI-powered security analyst specializing in detecting malicious bot activity on an e-commerce website.
  Your task is to analyze user session data and assign a threat score based on various behavioral and network characteristics.

  Here's the information about the user session:
  - Session ID: {{{sessionId}}}
  - HTTP Headers: {{{headers}}}
  - Behavior Vector: {{{behaviorVector}}}
  - IP Entropy: {{{ipEntropy}}}
  - Time Between Requests (ms): {{{timeBetweenRequests}}}
  - Resources Accessed: {{{resourceAccessed}}}

  Based on this information, determine a threat score between 0 and 100 (inclusive), where higher scores indicate a greater likelihood of malicious activity.
  Provide a detailed explanation of your reasoning for the assigned score, including specific factors that contributed to your assessment.

  Consider the following factors when determining the threat score:
  - Unusual or suspicious header combinations
  - Anomalies in the behavior vector
  - High IP entropy, indicating potential IP address spoofing
  - Irregular time patterns between requests
  - Access to resources disallowed in robots.txt, honeypots or fake offers

  Output:
  - threatScore: The calculated threat score (0-100).
  - explanation: A detailed explanation of the factors contributing to the score.
`,
});

// Define the Genkit flow for threat scoring
const threatScoringFlow = ai.defineFlow(
  {
    name: 'threatScoringFlow',
    inputSchema: ThreatScoreInputSchema,
    outputSchema: ThreatScoreOutputSchema,
  },
  async input => {
    const promptInput = {
        ...input,
        headers: JSON.stringify(input.headers, null, 2),
        behaviorVector: JSON.stringify(input.behaviorVector),
        timeBetweenRequests: JSON.stringify(input.timeBetweenRequests),
    }
    const {output} = await threatScoringPrompt(promptInput);
    return output!;
  }
);
