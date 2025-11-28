'use server';

import {chatbotRespondsWithText, type ChatbotRespondsWithTextInput} from '@/ai/flows/answer-questions';
import {convertTextToSpeech, type ConvertTextToSpeechInput} from '@/ai/flows/text-to-speech';
import {summarizeChatHistory, type SummarizeChatHistoryInput} from '@/ai/flows/summarize-chat-history';

export async function getBotResponse(input: ChatbotRespondsWithTextInput) {
  try {
    const result = await chatbotRespondsWithText(input);
    return { answer: result.textResponse };
  } catch (error) {
    console.error('Error in getBotResponse:', error);
    return {answer: 'I am having trouble connecting to my brain right now. Please try again later.'};
  }
}

export async function getAudioForText(input: ConvertTextToSpeechInput) {
    try {
        const result = await convertTextToSpeech(input);
        return { audioDataUri: result.audioDataUri };
    } catch (error) {
        console.error('Error in getAudioForText:', error);
        return { error: 'Failed to generate audio.' };
    }
}

export async function getSummary(input: SummarizeChatHistoryInput) {
  try {
    const result = await summarizeChatHistory(input);
    return { summary: result.summary };
  } catch (error) {
    console.error('Error in getSummary:', error);
    return { error: 'Failed to generate summary.' };
  }
}
