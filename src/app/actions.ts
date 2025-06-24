'use server';

import {chatbotRespondsWithText, type ChatbotRespondsWithTextInput} from '@/ai/flows/answer-questions';

export async function getBotResponse(input: ChatbotRespondsWithTextInput) {
  try {
    const result = await chatbotRespondsWithText(input);
    return { answer: result.textResponse };
  } catch (error) {
    console.error('Error in getBotResponse:', error);
    return {answer: 'I am having trouble connecting to my brain right now. Please try again later.'};
  }
}
