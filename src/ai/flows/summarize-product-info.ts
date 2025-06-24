'use server';
/**
 * @fileOverview Summarizes the key information on a Spinneys product page.
 *
 * - summarizeProductInfo - A function that summarizes product information from a URL.
 * - SummarizeProductInfoInput - The input type for the summarizeProductInfo function.
 * - SummarizeProductInfoOutput - The return type for the summarizeProductInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProductInfoInputSchema = z.object({
  url: z.string().describe('The URL of the Spinneys product page to summarize.'),
});
export type SummarizeProductInfoInput = z.infer<typeof SummarizeProductInfoInputSchema>;

const SummarizeProductInfoOutputSchema = z.object({
  summary: z.string().describe('A summary of the key information on the page.'),
});
export type SummarizeProductInfoOutput = z.infer<typeof SummarizeProductInfoOutputSchema>;

export async function summarizeProductInfo(input: SummarizeProductInfoInput): Promise<SummarizeProductInfoOutput> {
  return summarizeProductInfoFlow(input);
}

const summarizeProductInfoPrompt = ai.definePrompt({
  name: 'summarizeProductInfoPrompt',
  input: {schema: SummarizeProductInfoInputSchema},
  output: {schema: SummarizeProductInfoOutputSchema},
  prompt: `Summarize the key information on the following page from Spinneys website. Be concise and informative.\n\nURL: {{{url}}}`,
});

const summarizeProductInfoFlow = ai.defineFlow(
  {
    name: 'summarizeProductInfoFlow',
    inputSchema: SummarizeProductInfoInputSchema,
    outputSchema: SummarizeProductInfoOutputSchema,
  },
  async input => {
    const {output} = await summarizeProductInfoPrompt(input);
    return output!;
  }
);
