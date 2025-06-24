'use server';

/**
 * @fileOverview An AI agent that answers questions about Spinneys products, services, and policies.
 *
 * - answerQuestion - A function that handles the question answering process.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KnowledgeEntrySchema = z.object({
  topic: z.string(),
  keywords: z.array(z.string()),
  url: z.string().url(),
});

const FaqEntrySchema = z.object({
  question: z.string(),
  answer: z.string(),
  keywords: z.array(z.string()),
});

const AnswerQuestionInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  chatHistory: z.array(z.object({role: z.string(), content: z.string()})).optional(),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

const getRelevantInfo = ai.defineTool({
  name: 'getRelevantInfo',
  description: 'Retrieves relevant information about Spinneys products, services, and policies from a knowledge base and FAQ.',
  inputSchema: z.object({
    question: z.string().describe('The question to use to find relevant information.'),
  }),
  outputSchema: z.object({
    knowledge: z.array(KnowledgeEntrySchema),
    faq: z.array(FaqEntrySchema),
  }),
}, async (input) => {
  // Mock implementation - replace with actual data retrieval logic
  const KNOWLEDGE_DATA = [
    {
      topic: 'Beauty, Makeup, Skin Care, Nail Care',
      keywords: ['beauty', 'makeup', 'cosmetics', 'skin care', 'skincare', 'nail', 'manicure', 'pedicure'],
      url: 'https://www.spinneyslebanon.com/default/beauty-landing/',
    },
    {
      topic: 'Pet Food and Supplies',
      keywords: ['pet', 'pets', 'dog', 'cat', 'animal food', 'petfection'],
      url: 'https://www.spinneyslebanon.com/default/petfection-landing',
    },
    {
      topic: 'Promotions, Sales, and Discounts',
      keywords: ['promotion', 'promo', 'offer', 'sale', 'discount', 'deals'],
      url: 'https://www.spinneyslebanon.com/default/promotions.html',
    },
    {
      topic: 'Healthy Living Foods',
      keywords: ['healthy', 'vegan', 'keto', 'protein', 'low sugar', 'gluten free', 'high fiber', 'kids food', 'diet'],
      url: 'https://www.spinneyslebanon.com/default/healthyliving-landing',
    },
    {
      topic: 'Nuts and Frozen Meats',
      keywords: ['nut', 'nuts', 'frozen meat', 'cellar'],
      url: 'https://www.spinneyslebanon.com/default/cellar?product_list_limit=80',
    },
    {
      topic: 'Brands',
      keywords: ['brand', 'brands', 'what brands'],
      url: 'https://www.spinneyslebanon.com/default/brands',
    },
  ];


  const FAQ_DATA = [
    // Accounts Management
    {
      question: 'How do I create an Account?',
      answer: 'Start shopping for your favorite groceries today! Create an Account at Spinneyslebanon.com or sign up with your Facebook or Google account.',
      keywords: ['create account', 'sign up', 'register'],
    },
    {
      question: 'Where do I manage my account?',
      answer: 'Sign in to Spinneyslebanon.com, click on MY ACCOUNT. You can manage: My Orders, Favorites & Lists, Personal Details, Addresses, Payment Cards, Spinneys Rewards, Newsletter, Saved Recipes, and Gift Cards.',
      keywords: ['manage account', 'my account', 'account details'],
    },
    {
      question: 'I forgot my password or email',
      answer: 'For a forgotten password, on the sign-in page, click \