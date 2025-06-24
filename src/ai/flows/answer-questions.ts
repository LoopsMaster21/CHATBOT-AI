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
      answer: 'For a forgotten password, on the sign-in page, click "Reset your password?" and follow the instructions. For a forgotten email, please contact our Online Customer Care team via the Contact Us page.',
      keywords: ['forgot password', 'reset password', 'forgot email'],
    },
    {
      question: 'Update address or personal details',
      answer: 'Visit the \'My Account\' page to manage "Addresses" or "Personal Details".',
      keywords: ['update address', 'change details', 'update information'],
    },
    {
      question: 'Manage my Payment card details',
      answer: 'Visit \'Payment Cards\' under \'My Account\'.',
      keywords: ['payment card', 'update card', 'credit card'],
    },
      // Grocery Orders
    {
      question: 'Can I choose a time and day for my groceries delivery?',
      answer: 'Yes, you can choose an available delivery slot up to 30 days in advance.',
      keywords: ['delivery time', 'schedule delivery', 'delivery slot'],
    },
    {
      question: 'Is there a minimum order spend?',
      answer: 'Yes, the minimum order value is $30.',
      keywords: ['minimum order', 'minimum spend'],
    },
    {
      question: 'How do I cancel my order?',
      answer: 'You can cancel an order from the \'My Orders\' page only if its status is \'Order Received\'. You cannot cancel if it is \'Under Preparation\', \'Processed\', or \'Delivered\'.',
      keywords: ['cancel order', 'stop order'],
    },
      // Products & Pricing
    {
      question: 'Are the prices on the website the same as in-store prices?',
      answer: 'Yes, prices online are the same as our Hazmieh and Elissar branches. In-store promotions may not always apply online.',
      keywords: ['price match', 'online price', 'in-store price'],
    },
    {
      question: 'Is VAT (Value-Added Tax) Included in the Price?',
      answer: 'Yes, the standard 11% VAT is included in the price.',
      keywords: ['vat', 'tax', 'value added tax'],
    },
      // Mobile App
    {
      question: 'What features does the mobile app have?',
      answer: 'The Spinneys app lets you shop 10,000+ products, create orders, manage lists, link your loyalty card, and get offers.',
      keywords: ['mobile app', 'app features', 'download app'],
    },
      // Offers & Promotions
    {
      question: 'What is a coupon and how does it work?',
      answer: 'A coupon is a code entered at checkout for a discount.',
      keywords: ['coupon', 'voucher', 'promo code'],
    },
    {
      question: 'Cash Back terms & conditions',
      answer: 'You collect cashback by purchasing items with cashback signs. Your cashback balance appears in your wallet at checkout, and you can choose how much to use. Cashback amounts are valid for 1 to 2 years.',
      keywords: ['cashback', 'cash back', 'wallet'],
    },
      // Grocery Delivery
    {
      question: 'Do you charge for delivery?',
      answer: 'Yes.',
      keywords: ['delivery charge', 'delivery fee', 'shipping cost'],
    },
    {
      question: 'What if I miss my delivery?',
      answer: 'If you miss your delivery, the driver will proceed with other deliveries. If they receive confirmation you can receive the order, they will return. Otherwise, the products will be returned, you will be charged for delivery, and the order will need to be rescheduled.',
      keywords: ['missed delivery', 'not home', 'reschedule delivery'],
    },
      // Returns & Refunds
    {
      question: 'What is your refund policy?',
      answer: 'We have a 30-day money-back guarantee. You can return products to any Spinneys store in Lebanon with proof of purchase. Perishable goods can be returned within 48 hours.',
      keywords: ['refund policy', 'return policy', 'money back'],
    },
      // Payments & Billing
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept Visa, Mastercard, American Express, Cash on Delivery, and Credit/Debit Card on Delivery.',
      keywords: ['payment methods', 'pay', 'credit card', 'cash'],
    },
      // Loyalty Program
    {
      question: 'How do I earn loyalty points?',
      answer: 'Earn 10 points for every 15,000L.L spent. Look for extra points items and double points days.',
      keywords: ['loyalty points', 'rewards', 'earn points'],
    },
      // eGift Cards
    {
      question: 'How do I use my electronic gift cards?',
      answer: 'You can enter the gift card code during checkout or redeem it as credit in your account under the gift card section in \'My Account\'.',
      keywords: ['gift card', 'egift', 'redeem card'],
    },
  ];

  const lowerCaseQuestion = input.question.toLowerCase();

  const relevantKnowledge = KNOWLEDGE_DATA.filter(item =>
    item.keywords.some(kw => lowerCaseQuestion.includes(kw))
  );

  const relevantFaq = FAQ_DATA.filter(item =>
    item.keywords.some(kw => lowerCaseQuestion.includes(kw))
  );

  return {
    knowledge: relevantKnowledge,
    faq: relevantFaq,
  };
});

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const answerQuestionPrompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AnswerQuestionInputSchema},
  output: {schema: AnswerQuestionOutputSchema},
  tools: [getRelevantInfo],
  prompt: `You are a helpful customer service assistant for Spinneys, a supermarket chain in Lebanon. Your goal is to answer user questions accurately and concisely based on the information provided by the getRelevantInfo tool. You must be bilingual, responding in English to English questions and in Arabic to Arabic questions. If the user's question is unclear, ask for clarification. If the information is not available, state that you do not have that information. If the getRelevantInfo tool returns a URL for a relevant topic, you should include this URL in your answer. Keep track of the conversation history to understand context. Always be friendly and professional.

Answer the following question based on the provided chat history.

Chat History:
{{#each chatHistory}}
{{this.role}}: {{this.content}}
{{/each}}

Question: {{{question}}}
`,
});


const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async (input) => {
    const {output} = await answerQuestionPrompt(input);
    return output!;
  }
);
