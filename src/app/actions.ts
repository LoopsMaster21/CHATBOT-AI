'use server';

import {answerQuestion, type AnswerQuestionInput} from '@/ai/flows/answer-questions';

export async function getBotResponse(input: AnswerQuestionInput) {
  try {
    const result = await answerQuestion(input);
    return result;
  } catch (error) {
    console.error('Error in getBotResponse:', error);
    return {answer: 'I am having trouble connecting to my brain right now. Please try again later.'};
  }
}
