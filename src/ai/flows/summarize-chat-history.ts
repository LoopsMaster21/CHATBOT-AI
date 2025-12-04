'use server';
/**
 * @fileOverview Summarizes a chat conversation.
 *
 * - summarizeChatHistory - A function that summarizes a chat history.
 * - SummarizeChatHistoryInput - The input type for the summarizeChatHistory function.
 * - SummarizeChatHistoryOutput - The return type for the summarizeChatHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChatHistoryInputSchema = z.object({
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).describe('The history of the conversation to summarize.'),
});
export type SummarizeChatHistoryInput = z.infer<typeof SummarizeChatHistoryInputSchema>;

const SummarizeChatHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});
export type SummarizeChatHistoryOutput = z.infer<typeof SummarizeChatHistoryOutputSchema>;

export async function summarizeChatHistory(input: SummarizeChatHistoryInput): Promise<SummarizeChatHistoryOutput> {
  return summarizeChatHistoryFlow(input);
}

const summarizePrompt = `Concisely summarize the following conversation between a user and an AI assistant in the third person. Capture the key topics, questions, and outcomes. This summary will be used as long-term memory for the AI.

Conversation History:
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}

Summary:`;

const summarizeChatHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeChatHistoryFlow',
    inputSchema: SummarizeChatHistoryInputSchema,
    outputSchema: SummarizeChatHistoryOutputSchema,
  },
  async ({chatHistory}) => {

    if (!chatHistory || chatHistory.length === 0) {
        return { summary: '' };
    }

    const { text } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: summarizePrompt,
        context: {
            chatHistory
        }
    });

    return {
      summary: text,
    };
  }
);
