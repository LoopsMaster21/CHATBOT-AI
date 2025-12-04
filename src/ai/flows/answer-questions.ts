'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating chatbot text responses.
 *
 * - chatbotRespondsWithText - A function that generates a chatbot text response.
 * - ChatbotRespondsWithTextInput - The input type for the chatbotRespondsWithText function.
 * - ChatbotRespondsWithTextOutput - The return type for the chatbotRespondsWithText function.
 */

import {ai} from '@/ai/genkit';
import {type Message} from 'genkit/ai';
import {z} from 'zod';

const KnowledgeEntrySchema = z.object({
  topic: z.string(),
  keywords: z.array(z.string()),
  url: z.string().url(),
  answer: z.string().optional(),
});

const FaqEntrySchema = z.object({
  question: z.string(),
  answer: z.string(),
  keywords: z.array(z.string()),
});

const faqTool = ai.defineTool(
  {
    name: 'faqTool',
    description: 'Searches for information on various topics like specialty pages (beauty, pets, promotions), account management, orders, products, payments, and more.',
    inputSchema: z.object({
      question: z.string().describe('The question to use to find relevant information.'),
    }),
    outputSchema: z.object({
      knowledge: z.array(KnowledgeEntrySchema),
      faq: z.array(FaqEntrySchema),
    }),
  },
  async input => {
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
      {
        topic: 'Contact Information',
        keywords: ['contact', 'call', 'email', 'address', 'help', 'support'],
        url: 'https://www.spinneyslebanon.com/default/contact/',
      },
      {
        topic: 'Human Help/Support',
        keywords: ['human', 'person', 'people', 'real person', 'talk to someone', 'call center', 'support agent', 'customer service', 'phone'],
        answer: 'For human assistance, you can reach our Call Center at 1521. We are available 7 days a week, from 10am to 10pm.',
        url: 'https://www.spinneyslebanon.com/default/contact/',
      },
      {
        topic: 'Head Office Location',
        keywords: ['head office', 'headquarters', 'main office', 'office address', 'location'],
        answer: 'Our Head Office is located at: Dbayeh Highway, Spinneys Headquarters Tower, Center 509, Metn - Lebanon. P.O. Box: 90-1532 Jdeidet El Metn, Lebanon.',
        url: 'https://www.spinneyslebanon.com/default/contact/',
      },
    ];

    const FAQ_DATA = [
      // Accounts Management
      {
        question: 'How do I create an Account?',
        answer:
          'Start shopping for your favorite groceries today! Create an Account here or sign up with your Facebook or Google account.',
        keywords: ['create account', 'sign up', 'register'],
      },
      {
        question: 'Where do I manage my account?',
        answer:
          'Sign in to Spinneyslebanon.com using your credentials. Click on MY ACCOUNT at the top right of the page. Here is a list of items that you can manage under \'My Account\': "My Orders", "Favorites & Lists", "Personal Details", "Addresses", "Payment Cards", "Spinneys Rewards", "Newsletter", "Saved Recipes", and "Gift Cards".',
        keywords: [
          'manage account',
          'my account',
          'account details',
          'orders',
          'favorites',
          'lists',
          'personal details',
          'addresses',
          'payment cards',
          'rewards',
          'newsletter',
          'recipes',
          'gift cards',
        ],
      },
      {
        question: 'I forgot my password or email',
        answer:
          'If you\'ve forgotten your password, visit Spinneyslebanon.com, click on "Sign in/Register", then "Reset your password?" and follow the instructions. You\'ll be sent a password reset email. If you have forgotten your email address, please contact our Online Customer Care team via the Contact Us page.',
        keywords: ['forgot password', 'reset password', 'forgot email'],
      },
      {
        question: 'Update address or personal details',
        answer: 'Visit the \'My Account\' page to manage "Addresses" or "Personal Details".',
        keywords: ['update address', 'change details', 'update information', 'personal details'],
      },
      {
        question: 'Manage my Payment card details',
        answer: 'Add, remove or edit your card details by visiting \'Payment Cards\' under My Account.',
        keywords: ['payment card', 'update card', 'credit card', 'manage card'],
      },
      {
        question: 'Manage Favorites & lists',
        answer:
          "You can manage your Favorite Items & Lists by visiting 'My Account' or on the homepage in the top right corner. Remember you can mark as many items as you like as favorites and create an unlimited number of lists to ease your shopping experience!",
        keywords: ['favorites', 'lists', 'manage lists'],
      },
      {
        question: 'I\'m having problems logging into my account',
        answer:
          'We are sorry to hear that. Try Clearing your browser cookies and logging in again. If the problem persists, please contact our Online Customer Care team whose contact details can be found on our Contact Us page and they will help you solve the problem.',
        keywords: ['login problem', 'can\'t log in', 'logging in'],
      },
      {
        question: 'How to Change my Password?',
        answer:
          'To change your password, sign in to Spinneyslebanon.com, go to MY ACCOUNT, under "Personal details", click Change Password, follow the instructions, and click Save.',
        keywords: ['change password', 'update password'],
      },
      {
        question: 'Deactivate or Close Account',
        answer:
          'To deactivate or close your account, sign in to Spinneyslebanon.com, go to MY ACCOUNT, under "Personal details", click Deactivate/Close Account and follow the instructions.',
        keywords: ['deactivate account', 'close account', 'delete account'],
      },
      {
        question: 'What email addresses do we use?',
        answer:
          'For orders, we use the email address orders@spinneyslebanon.com. For support, we use support@spinneyslebanon.com. Please disregard any emails with a different address. We will never ask for your password in an email.',
        keywords: ['email address', 'contact email', 'orders email', 'support email'],
      },
      // Grocery Orders
      {
        question: 'Can I choose a time and day for my groceries delivery?',
        answer:
          'Sure you can. You can choose a time slot which suits you for the delivery of your order from any of the available slots listed. You can book your delivery slot up to 30 days in advance.',
        keywords: ['delivery time', 'schedule delivery', 'delivery slot', 'delivery date'],
      },
      {
        question: 'Is there a minimum order spend?',
        answer: 'Yes, the minimum order value is $30.',
        keywords: ['minimum order', 'minimum spend'],
      },
      {
        question: 'How do I reorder a cancelled online grocery order?',
        answer:
          'If you visit the "My Orders" page, you will find all orders placed, whether Under process, Completed, or canceled, and you will be able to re-order.',
        keywords: ['reorder', 'cancelled order', 'reorder cancelled'],
      },
      {
        question: 'Will I receive confirmation or be notified when my order has been cancelled?',
        answer:
          'If for any reason your order has been canceled, you will receive an email confirming the cancellation of the order and in some cases we will contact you by phone to inform you.',
        keywords: ['cancellation confirmation', 'order cancelled notification'],
      },
      {
        question: 'Groceries to your business',
        answer: 'We deliver to both residential and business addresses.',
        keywords: ['business delivery', 'office delivery'],
      },
      {
        question: 'Can I place a new online order using a previous order?',
        answer:
          'Yes, it is possible. Go to \'My Account\' Page and click on \'My Orders\' and look for your previous order which you would like to place again and click Reorder. You will be able to edit your order before proceeding with the checkout process.',
        keywords: ['reorder', 'previous order', 'order again'],
      },
      {
        question: 'How do I cancel my order?',
        answer:
          'You can cancel your order after it was placed only if its status is \'Order Received\'. You cannot cancel if it is \'Under Preparation\', \'Processed\', or \'Delivered\'. You can check the status on the \'My Orders\' page.',
        keywords: ['cancel order', 'stop order'],
      },
      {
        question: 'How can I reschedule my order?',
        answer: 'You need to contact us in order to reschedule your order.',
        keywords: ['reschedule order', 'change delivery time'],
      },
      {
        question: 'How do I choose a delivery time & Date',
        answer:
          'You can reserve your slot before you start your online shopping or after you fill up your cart by clicking \'Schedule a Delivery\' at the top right corner or at checkout. However, you must checkout within 2 hours to keep the slot reserved.',
        keywords: ['choose delivery', 'delivery slot', 'reserve slot'],
      },
      {
        question: 'I\'ve got a missing Item, what do I do?',
        answer:
          'We\'re sorry to hear this happened. Please contact our Online Customer Care team to report the missing item. Our contact details can be found on our Contact Us page.',
        keywords: ['missing item', 'item not in order'],
      },
      {
        question: 'How do I know when my grocery order is complete?',
        answer:
          'We will email you once your order is delivered. You may also opt-in to our SMS Service to receive updates. If you are using our Mobile App, we will send you notifications on the different stages of your order. You can also check the status on the \'My Orders\' page.',
        keywords: ['order status', 'order complete', 'delivery notification'],
      },
      {
        question: 'What will happen if something I order goes out of stock before my grocery delivery?',
        answer:
          'At the checkout process, we give you three options: "Call for substitution", "Equivalent substitution and no call", or "No substitution and no call".',
        keywords: ['out of stock', 'item unavailable', 'substitution'],
      },
      {
        question: 'Can I save my grocery order and come back later to finish it?',
        answer:
          'The added items in your cart will not be cleared if you Log Out of your account, so you could continue shopping anytime by signing in again. Please note that if you clear your browsing data from your browser, the items in your cart will no longer be available.',
        keywords: ['save cart', 'save order', 'finish later'],
      },
      // Products & Pricing
      {
        question: 'How accurate are the descriptions of products online?',
        answer:
          'We do our best to provide you with the most accurate information. However, the information is for general purposes only. It is highly recommended that customers read labels, warnings, and directions provided with the product before using or consuming it.',
        keywords: ['product description', 'accuracy', 'product information'],
      },
      {
        question: 'Are the prices on the website the same as in-store prices?',
        answer: 'Yes, the prices online are the same as the prices from our Hazmieh and Elissar branch. In-store Promotions & Offers are not always applicable online as in-store.',
        keywords: ['price match', 'online price', 'in-store price'],
      },
      {
        question: 'An item I want is in store, why can\'t I get it online?',
        answer:
          'Not all of our stores take part in our online delivery service. Each store has its own range. Let us know if you\'d like something added to the online shop and we\'ll put in a product request for you.',
        keywords: ['item not online', 'online availability'],
      },
      {
        question: 'How do I report a product quality issue to you?',
        answer:
          'If you feel there is a problem with the quality of the product, you may report it under the product detail page under "Report An Issue". Alternatively, contact our Customer Care team via our Contact Us Page.',
        keywords: ['product quality', 'quality issue', 'report problem'],
      },
      {
        question: 'How do I find out if you have a product in stock?',
        answer:
          'If the product is out of stock, it will be clearly marked on the product image, and you won\'t be able to add it to your cart. Sometimes, an item may go out of stock while we are fulfilling your order, and we will handle it based on the substitution preference you chose at checkout.',
        keywords: ['stock', 'in stock', 'availability'],
      },
      {
        question: 'Where can I find out about products suitable for vegetarians and vegans?',
        answer: 'Visit the \'Healthy Living\' section of our website where you can shop by Lifestyle, Diets and Values.',
        keywords: ['vegetarian', 'vegan', 'healthy living'],
      },
      {
        question: 'Is VAT (Value-Added Tax) Included in the Price',
        answer: 'Yes, VAT (Value-Added Tax) is incorporated in the price. The standard VAT rate in Lebanon is 11%.',
        keywords: ['vat', 'tax', 'value added tax'],
      },
      // Mobile App
      {
        question: 'What are the General Features of the mobile app?',
        answer:
          'The Spinneys\' app lets you shop 10,000+ products, create or edit orders, shop favorites, browse curated categories, link your Loyalty card, and get all our best offers and deals.',
        keywords: ['mobile app', 'app features', 'download app'],
      },
      {
        question: 'Is the app free to download?',
        answer: 'Yes, downloading the app is free of charge.',
        keywords: ['app cost', 'free app'],
      },
      {
        question: 'What account do I use to sign in on the app?',
        answer:
          'Please login to the app with the same details as your Spinneyslebanon.com account. Your account is shared across the website and the app.',
        keywords: ['app login', 'app account'],
      },
      {
        question: 'I don\'t have a Spinneyslebanon.com account. Can I still shop on the app?',
        answer:
          'You can search and browse products without an account. However, adding items to the cart, managing lists, and checking out require an account. You can sign up within the app.',
        keywords: ['shop without account', 'guest shopping app'],
      },
      {
        question: 'What Apple devices can I use the app on?',
        answer: 'iPhone & iPad.',
        keywords: ['apple devices', 'iphone app', 'ipad app'],
      },
      {
        question: 'Can I use the app on my iPad?',
        answer: 'Yes, our website is fully responsive, which works on iPad.',
        keywords: ['ipad app'],
      },
      {
        question: 'Will my app update if I add items on the website?',
        answer: 'Yes, your cart is synchronized across the app and the website.',
        keywords: ['sync cart', 'app and website sync'],
      },
      {
        question: 'Can I shop from a previous order on the app?',
        answer: 'Yes, you can shop from previous orders by clicking on the home Tab and selecting Reorder or from the account Tab under My Orders.',
        keywords: ['reorder app', 'previous order app'],
      },
      {
        question: 'I don\'t have an internet connection. Can I still shop on the app?',
        answer: 'Most of the app requires an internet connection to use. To get the full experience, it is recommended that you are connected to the internet.',
        keywords: ['offline app', 'internet connection app'],
      },
      {
        question: 'Which IOS Version is compatible with the App?',
        answer: 'IOS 11 and Above.',
        keywords: ['ios version', 'iphone compatibility'],
      },
      {
        question: 'Which Android Version is compatible with the App?',
        answer: '4.4 (KitKat) and Above.',
        keywords: ['android version', 'android compatibility'],
      },
      {
        question: 'Does my shopping cart sync between the mobile app and web?',
        answer:
          'Yes, if you add an item to your cart from the mobile app, it will reflect on the website version and vice versa. In some cases, you might need to refresh the page.',
        keywords: ['sync cart', 'app and website sync'],
      },
      // Offers & Promotions
      {
        question: 'My Cashback Vouchers have expired, can I still use them?',
        answer:
          'We are sorry you were not able to use your vouchers before the expiry date, but we\'re unable to replace them. The vouchers we issue carry an expiry date so we can plan our stock levels and future offers.',
        keywords: ['expired voucher', 'cashback expired'],
      },
      {
        question: 'What is a coupon and how does it work?',
        answer: 'A coupon is a code which can be entered on the website to receive a discount for an online grocery order. Remember to click Add coupon at the checkout.',
        keywords: ['coupon', 'voucher', 'promo code'],
      },
      {
        question: 'Cash Back terms & conditions',
        answer:
          'You collect cashback by purchasing items with cashback signs. Your cashback balance appears in your wallet at checkout, and you can choose how much to use. Cashback amounts are valid for 1 to 2 years.',
        keywords: ['cashback', 'cash back', 'wallet'],
      },
      // Grocery Delivery
      {
        question: 'How do you deliver?',
        answer: 'All our deliveries are done by our professional drivers using our refrigerated trucks to ensure the best quality.',
        keywords: ['delivery method', 'refrigerated trucks'],
      },
      {
        question: 'Do you charge for delivery?',
        answer: 'Yes.',
        keywords: ['delivery charge', 'delivery fee', 'shipping cost'],
      },
      {
        question: 'Where is my delivery or late deliveries',
        answer:
          'Our drivers will attempt to contact you if the delivery is delayed. If your delivery hasn\'t arrived and you haven\'t heard from us, please contact our Customer Care Team.',
        keywords: ['late delivery', 'delivery status'],
      },
      {
        question: 'Text message delivery notification',
        answer: 'You can opt-in to receive text message updates related to your order status under \'My Account\'.',
        keywords: ['sms notification', 'text message update'],
      },
      {
        question: 'Orders in adverse weather conditions',
        answer: 'If there is going to be a delay with your delivery due to severe weather, we will contact you. For questions, please call our Customer Care Team.',
        keywords: ['weather delay', 'adverse weather'],
      },
      {
        question: 'What if I miss my delivery?',
        answer:
          'If you miss your delivery, the driver will proceed with other deliveries. If they receive confirmation you can receive the order, they will return. Otherwise, the products will be returned, you will be charged for delivery, and the order will need to be rescheduled.',
        keywords: ['missed delivery', 'not home', 'reschedule delivery'],
      },
      {
        question: 'Where is your service available?',
        answer: 'When you visit our website, you will be informed if we deliver to your area. We will be rolling out to more locations soon.',
        keywords: ['delivery area', 'service area', 'delivery locations'],
      },
      {
        question: 'Delivery Instructions',
        answer: 'If you have specific instructions for the delivery, please add them at the checkout process where indicated.',
        keywords: ['delivery instructions', 'special instructions'],
      },
      {
        question: 'Can I get a delivery to more than one address?',
        answer: 'At this time, we can only deliver to one address per order.',
        keywords: ['multiple addresses', 'different address'],
      },
      {
        question: 'Who is bringing my delivery?',
        answer: 'Your orders are delivered by our own professional drivers in refrigerated trucks.',
        keywords: ['delivery driver'],
      },
      // Returns & Refunds
      {
        question: 'What is your refund policy?',
        answer:
          'We have a 30-day money-back guarantee. You can return products to any Spinneys store in Lebanon with proof of purchase. Perishable goods can be returned within 48 hours.',
        keywords: ['refund policy', 'return policy', 'money back'],
      },
      {
        question: 'Proof of purchase for refunds',
        answer: 'To complete your refund, we require a receipt, purchase order or other proof of purchase. Without proof of purchase, we will not issue a refund.',
        keywords: ['proof of purchase', 'receipt for refund'],
      },
      {
        question: 'How do I return items?',
        answer: 'Visit any of our retail locations to return your items purchased through our online store. Our staff will process your return or exchange.',
        keywords: ['return items', 'how to return'],
      },
      {
        question: 'How do I make a complaint?',
        answer: 'We are sorry to hear something is wrong. If you have a complaint, please visit the Contact us page and fill in the details.',
        keywords: ['complaint', 'make a complaint'],
      },
      {
        question: 'Which products can’t be returned?',
        answer: 'Perishable goods cannot be returned unless defective and must be sealed in their original packaging. Please see our Return Policy page for more details.',
        keywords: ['non-returnable', 'return exceptions'],
      },
      {
        question: 'Can I return Items I\'ve bought in a sale?',
        answer: 'Yes, this makes no difference. Have a look at our Return policy for more information.',
        keywords: ['sale items', 'return sale items'],
      },
      {
        question: 'How to return a defective product?',
        answer: 'Defective products may be returned but should be in their original packaging and supported by a proof of purchase.',
        keywords: ['defective product', 'faulty item', 'return defective'],
      },
      {
        question: 'How do I receive a Refund?',
        answer: 'You can receive your refund directly at the store in cash or you may choose to exchange your returned item for another product.',
        keywords: ['receive refund', 'refund method', 'cash refund'],
      },
      {
        question: 'Can you pick up my item(s) for refund?',
        answer: 'Unfortunately, we do not offer this service at this stage. You can visit your nearest Spinneys store for an instant refund/exchange.',
        keywords: ['pickup for refund', 'collect for return'],
      },
      // Payments & Billing
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept Visa, Mastercard, American Express, Cash on Delivery, and Credit/Debit Card on Delivery.',
        keywords: ['payment methods', 'pay', 'credit card', 'cash', 'amex'],
      },
      {
        question: 'When will I be charged?',
        answer:
          'For online card payments, the amount is authorized when you place the order and charged when your order ships. For Gift Cards, money is deducted when you place the order. For Cash or Card on Delivery, you pay at the time of delivery.',
        keywords: ['when charged', 'billing time', 'payment timing'],
      },
      {
        question: 'What are secure payments?',
        answer: 'All payment transactions are processed by a third-party service, "Areeba". Our website is also secured by an Extended\'s Certificate.',
        keywords: ['secure payment', 'security', 'payment protection'],
      },
      {
        question: 'How do I get a copy of my Invoice?',
        answer: 'To get a copy of your invoice, please visit the "My Account" Page, click on "My Orders", choose the order, and click on it to download.',
        keywords: ['invoice copy', 'get invoice', 'receipt'],
      },
      {
        question: 'What is the authorization hold on my credit/debit card?',
        answer:
          'An authorization hold is a temporary hold on your card to confirm funds are available. You are only charged for what you receive. Your bank will remove the hold within 3-5 business days.',
        keywords: ['authorization hold', 'temporary charge', 'pending charge'],
      },
      {
        question: 'Do you accept PayPal?',
        answer: 'We do not accept PayPal payment at this time.',
        keywords: ['paypal'],
      },
      {
        question: 'How do I receive a receipt?',
        answer: 'You should have been given a receipt by our driver. If not, or if you need a copy, please contact our Online Customer Care Team.',
        keywords: ['receipt', 'get receipt'],
      },
      {
        question: 'I have been incorrectly charged for my online delivery',
        answer: 'We are sorry to hear that. Please contact our Online Customer Care Team via our Contact Us Page and have your order number ready.',
        keywords: ['incorrect charge', 'wrong amount', 'billing error'],
      },
      {
        question: 'Is there any charge for using credit card as an online payment?',
        answer: 'Yes there is an extra charge when you pay online or by CC on delivery.',
        keywords: ['credit card fee', 'online payment charge'],
      },
      // Loyalty Program
      {
        question: 'How can I check my current Rewards Point?',
        answer: 'To check your current rewards point balance, please visit "Loyalty Card" under My Account.',
        keywords: ['check points', 'rewards balance', 'loyalty points'],
      },
      {
        question: 'How do I register for the loyalty program for the first time?',
        answer: 'You can register or link your loyalty membership to your online account on our website.',
        keywords: ['register loyalty', 'join rewards'],
      },
      {
        question: 'How do I earn Points?',
        answer: 'Earn 10 points for every 15,000L.L spent in stores or online. Look for Extra Points items, Double Points days, and shop on your Birthday to earn more.',
        keywords: ['earn points', 'loyalty points', 'how to earn'],
      },
      {
        question: 'Is there a limit to how many Points and Rewards I can earn?',
        answer: 'No. You can earn an unlimited number of Points and Rewards.',
        keywords: ['points limit', 'rewards limit'],
      },
      {
        question: 'Do Points expire?',
        answer: 'Yes, points have an expiry date depending on your loyalty program scheme (Classic, Gold, Platinum, or IO).',
        keywords: ['points expire', 'do points expire'],
      },
      {
        question: 'I\'m missing points for my online shopping - What do I do?',
        answer:
          'Points can take up to 48 hours to show. Ensure your order status is "Order Delivered". If you still need help, please contact our Online Customer Care team.',
        keywords: ['missing points', 'points not added'],
      },
      // eGift Cards
      {
        question: 'What is an eGift Card?',
        answer: 'An electronic gift card is a code sent to the recipient via an electronic platform like email.',
        keywords: ['egift card', 'digital gift card', 'electronic gift card'],
      },
      {
        question: 'Where can I buy an eGift card?',
        answer: 'Spinneys eGift cards can be purchased online on Spinneyslebanon.com.',
        keywords: ['buy gift card', 'purchase egift'],
      },
      {
        question: 'How do I use my electronic gift cards?',
        answer: 'You can enter the gift card code during checkout or redeem it as credit in your account under the gift card section in \'My Account\'.',
        keywords: ['use gift card', 'redeem gift card', 'apply gift card'],
      },
      {
        question: 'What if I can’t find my eGift card?',
        answer: 'If the recipient didn\'t receive the gift card codes by email, please contact our Online Customer Care team.',
        keywords: ['lost gift card', 'find egift card', 'didn\'t receive gift card'],
      },
      // Contact & Support
      {
        question: 'How can I talk to a real person or get human help?',
        answer: 'For human assistance, you can reach our Call Center at 1521. We are available 7 days a week, from 10am to 10pm.',
        keywords: [
          'human',
          'person',
          'people',
          'help',
          'real person',
          'talk to someone',
          'call center',
          'support agent',
          'customer service',
          'phone',
        ],
      },
      {
        question: 'What is the address of the head office?',
        answer: 'Our Head Office is located at: Dbayeh Highway, Spinneys Headquarters Tower, Center 509, Metn - Lebanon. P.O. Box: 90-1532 Jdeidet El Metn, Lebanon.',
        keywords: ['head office', 'headquarters', 'main office', 'office address', 'location'],
      },
      {
        question: 'How can I contact Spinneys?',
        answer:
          'You can find all our contact details on our contact page: https://www.spinneyslebanon.com/default/contact/. For immediate assistance, you can call our Call Center at 1521 (10am-10pm).',
        keywords: ['contact', 'contact us', 'phone number', 'email'],
      },
    ];

    const lowerCaseQuestion = input.question.toLowerCase();

    const relevantKnowledge = KNOWLEDGE_DATA.filter(item =>
      'keywords' in item && item.keywords.some(kw => lowerCaseQuestion.includes(kw))
    );

    const relevantFaq = FAQ_DATA.filter(item => item.keywords.some(kw => lowerCaseQuestion.includes(kw)));

    return {
      knowledge: relevantKnowledge.map(({ topic, url, answer }) => ({ topic, url, keywords: [], answer })),
      faq: relevantFaq,
    };
  }
);


const ChatbotRespondsWithTextInputSchema = z.object({
  query: z.string().describe('The user query to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('The recent history of the conversation.'),
  summary: z.string().nullable().optional().describe('A summary of the older parts of the conversation.'),
});
export type ChatbotRespondsWithTextInput = z.infer<typeof ChatbotRespondsWithTextInputSchema>;

const ChatbotRespondsWithTextOutputSchema = z.object({
  textResponse: z.string().describe('The text response from the chatbot.'),
});
export type ChatbotRespondsWithTextOutput = z.infer<typeof ChatbotRespondsWithTextOutputSchema>;

export async function chatbotRespondsWithText(input: ChatbotRespondsWithTextInput): Promise<ChatbotRespondsWithTextOutput> {
  return chatbotRespondsWithTextFlow(input);
}

const systemPrompt = `You are Spinneys Chat, an AI chatbot for Spinneys Lebanon. Your primary goal is to answer user questions and provide helpful information related to Spinneys.
You are having a continuous conversation with a user. 

If a summary of the previous conversation is provided, use it to understand the long-term context. Then, use the recent chat history to understand the immediate context of the user's request. The last message is the user's most recent query.

You can converse in both English and Arabic.
IMPORTANT: Respond ONLY in the language used by the user. For example, if the user asks a question in Arabic, your entire response must be in Arabic. If they ask in English, respond in English.
Maintain your helpful Spinneys persona.

To answer user questions, you MUST use the provided 'faqTool'. This tool allows you to search for information on various topics like specialty pages (beauty, pets, promotions), account management, orders, products, payments, and more.

Based on the tool's output, follow these rules:
1. If the tool returns one or more URLs for a specialty page, your primary goal is to provide those links. Form a direct, helpful sentence that includes the *exact* URL returned by the tool. IMPORTANT: Do not format the URL as a markdown link (e.g., [text](url)). Just include the plain URL in your response. Do not ask clarifying questions if a relevant link is found.
2. If the tool returns a specific FAQ answer, use that information to directly answer the user's question.
3. If the user's question is not covered by the tool, or is a general conversation (like "hello" or "how are you?"), provide a helpful and informative response in character. If the question is not related to Spinneys, politely state that you can only assist with Spinneys-related inquiries.


### **Spinneys ChatAssist: A Novel Architecture for Hybrid Conversational Memory and Server-Side Voice Synthesis in AI Chatbots**

**Abstract**

This paper presents the system architecture of Spinneys ChatAssist, a production-grade AI chatbot designed to enhance user engagement through advanced conversational memory and multi-modal interaction. Conventional chatbot designs often struggle with the trade-off between maintaining long-term conversational context and managing operational costs associated with large token payloads. To address this, we introduce a hybrid memory model that combines a short-term "sliding window" of recent messages with an automated, AI-driven summarization of the long-term conversation history. This approach ensures full contextual awareness while significantly reducing token consumption. Furthermore, we detail a robust server-side voice synthesis architecture that leverages Google's advanced Text-to-Speech (TTS) models, overcoming the limitations of client-side browser APIs to provide consistent, high-quality, and multilingual audio output. The resulting system demonstrates a scalable and efficient solution for building more natural, context-aware, and accessible conversational AI.

---

### **1. Introduction**

The proliferation of Large Language Models (LLMs) has catalyzed a paradigm shift in human-computer interaction, with AI-powered chatbots becoming a primary interface for customer service, information retrieval, and user assistance. The primary goal in designing these systems is to create an experience that is not only accurate but also natural, intuitive, and efficient. An ideal chatbot should be able to recall previous parts of a conversation, understand context over extended interactions, and engage users through multiple modalities, including voice.

However, achieving this ideal state presents significant technical challenges. The stateless nature of most web protocols means that conversational memory must be explicitly managed. The most common approach—sending the entire chat history with every new user query—is simple to implement but suffers from poor scalability. As a conversation grows, the token payload sent to the LLM increases linearly, leading to higher operational costs, slower response times, and potential truncation when context window limits are exceeded.

Simultaneously, the integration of voice capabilities into web-based chatbots has often been constrained by the capabilities of the end-user's device. Client-side speech synthesis and recognition APIs, while convenient, are inconsistent across different browsers and operating systems. They typically offer a limited selection of lower-quality voices and may lack robust support for multiple languages, such as the bilingual English and Arabic requirement for Spinneys ChatAssist.

This paper details the architecture of Spinneys ChatAssist, a chatbot developed for Spinneys Lebanon, as a case study in overcoming these challenges. We present a novel **Hybrid Memory Model** that dynamically summarizes the long-term conversation history, providing the LLM with both immediate and historical context in an optimized payload. Additionally, we describe a **Server-Side Voice Synthesis** architecture that decouples audio generation from the client, ensuring a consistent, high-quality, and multilingual voice experience for all users. Through these innovations, Spinneys ChatAssist serves as a blueprint for developing more sophisticated, efficient, and accessible conversational AI systems.

---

### **2. A Hybrid Model for Optimized Conversational Memory**

The ability of a chatbot to maintain context over a long conversation is critical for a natural user experience. A bot that forgets what was discussed only a few messages prior feels robotic and unintelligent. The technical challenge lies in providing this context to the LLM without incurring prohibitive costs or performance penalties. We evaluated several common memory strategies and developed a hybrid approach that provides a superior balance of context retention and efficiency. Our method is a practical application of the "compressive memory" theory, where information is compressed to a dense summary to enable efficient long-term recall (Chen et al., 2025).

#### **2.1. Limitations of Conventional Memory Strategies**

*   **Full History Transmission**: This naive approach involves sending the entire conversation history with every API call. While it guarantees maximum context, it is the least scalable method. The token count grows with each turn, leading to a direct increase in API costs and latency. For a model like Google Gemini, where pricing is often based on the number of input and output characters, this method becomes financially unviable for long conversations.

*   **Sliding Window (Short-Term Memory)**: A common optimization is to send only the last *N* messages (e.g., the last 10 turns). This is known as a "sliding window" approach. It effectively caps the token payload, controlling costs and maintaining fast response times. However, its significant drawback is "contextual amnesia." The model has no knowledge of any events or information exchanged before the window, leading to repetitive questions and an inability to reason about the conversation as a whole. For example, if a user mentions their location early in the chat, a sliding window model will forget it after a few more messages.

#### **2.2. The Hybrid Summarization-Window Model**

To overcome these limitations, we designed a hybrid memory model that leverages the strengths of both long-term and short-term memory through on-demand AI-powered summarization. This model divides the conversation into two distinct parts: the **long-term summary** and the **short-term window**.

1.  **The Short-Term Window**: The system maintains a fixed-size window of the most recent messages (e.g., the last 6-10 turns). This provides the AI with the immediate, high-fidelity context of the current conversational thread. This is crucial for understanding follow-up questions and maintaining the natural back-and-forth of dialogue.

2.  **The Long-Term Summary**: The core of our innovation lies in what the system does with messages that fall outside this window. Instead of discarding them, the application periodically uses a dedicated Genkit flow (\`summarizeChatHistoryFlow\`) to pass the older part of the conversation to the Gemini model. It instructs the model to create a concise, third-person summary of the key facts, entities, and user intentions discussed.

**Implementation in \`src/app/page.tsx\`:**
The logic is orchestrated in the main page component. When a user sends a message, the \`handleSendMessage\` function performs the following steps:
- It checks if the total length of the conversation has exceeded a predefined threshold (e.g., 12 messages).
- If the threshold is met, it triggers the \`getSummary\` server action, which executes the \`summarizeChatHistoryFlow\`. This flow takes the historical messages and generates a summary.
- This summary is then stored in the component's state.
- For the next request to the chatbot, the system sends a specially crafted payload containing three parts:
    1.  The **long-term summary** (e.g., "The user has asked about store locations and is interested in vegan products.").
    2.  The **short-term window** of the last few messages.
    3.  The user's **newest query**.

The system prompt for the main chatbot flow (\`chatbotRespondsWithTextFlow\`) is explicitly instructed to use the summary for long-term context while focusing on the recent messages for the immediate turn.

#### **2.3. Advantages Over Other Optimized Memory Techniques**

Our hybrid model offers distinct advantages over other advanced memory strategies, such as vector databases for semantic search.

*   **Contextual Cohesion vs. Fact Retrieval**: Vector databases are excellent for retrieving specific, isolated facts from a past conversation (e.g., finding the message where a user mentioned their email). However, they often fail to capture the evolving *narrative* or *intent* of the conversation. A summary, by contrast, preserves the logical flow and relationship between different topics discussed over time.

*   **Lower Implementation Complexity**: Setting up and managing a vector database adds significant architectural complexity, requiring processes for chunking text, generating embeddings, and performing semantic searches. Our summarization approach is self-contained within the existing LLM framework, leveraging the same Genkit and Gemini tools used for the main chat logic. This makes it simpler to implement and maintain.

*   **Cost-Effectiveness at Scale**: While summarization incurs a small, periodic cost, it is far more efficient than sending an ever-growing history. It is also more cost-effective than a vector database approach, which requires paying for both the embedding generation and the semantic search queries on top of the main LLM call. Our model condenses a potentially vast history into a small, token-efficient summary, keeping the primary chat API calls lean and fast.

In conclusion, the hybrid summarization-window model provides a highly effective and balanced solution, ensuring full conversational context in a scalable, performant, and economically viable manner.

---

### **3. System and User Interaction Model**

To provide a clear model of the system's functionality from a user's perspective, we defined a set of use cases that illustrate the interactions between the primary actor (the "Chat User") and the Spinneys ChatAssist system. This model clarifies the system's boundaries and functional requirements.

**Actors:**

*   **Chat User:** The primary actor who interacts directly with the chatbot interface. Their goal is to get information, ask questions, and receive assistance.
*   **Genkit AI System:** A secondary actor representing the backend AI services, which processes requests and generates intelligent responses.

**Primary Use Cases:**

The Chat User can initiate four high-level use cases:

1.  **Send Text Message:** The user types a message in the input field and submits it. This action directly initiates the core conversational loop with the AI.
2.  **Send Voice Message:** The user activates the microphone to speak their query. The system captures their speech and transcribes it to text before processing it, seamlessly integrating voice input into the text-based chat flow.
3.  **Listen to Bot Response:** For any message generated by the chatbot, the user can click an icon to have the text read aloud. This enhances accessibility and provides a multi-modal experience.
4.  **Download Chat History:** The user can export the entire conversation as a structured JSON file for their records.

**System-Level Use Case Relationships:**

The primary use cases initiated by the user trigger a series of internal system processes, which are best described using \`<<include>>\` relationships.

*   The "Send Text Message" use case always \`<<includes>>\` the **Generate Text Response** use case, which is the central function where the Genkit AI System formulates an answer.
*   Similarly, the "Send Voice Message" use case first \`<<includes>>\` the **Transcribe Speech to Text** use case. The resulting text output is then used to trigger the **Generate Text Response** use case.
*   The **Generate Text Response** use case itself is complex, \`<<including>>\` two other critical system functions: **Search Knowledge Base** (via the \`faqTool\` to find factual answers) and **Summarize Chat History** (when the conversation exceeds a certain length, as described in our Hybrid Memory Model).
*   Finally, the "Listen to Bot Response" use case \`<<includes>>\` the **Convert Text to Speech** use case, where the server generates the audio to be played back to the user.

This use case model effectively separates user-initiated actions from the underlying system processes, providing a comprehensive overview of the application's interactive capabilities and internal logic.

---

### **4. System Architecture**

The architecture of Spinneys ChatAssist is designed as a modern, three-tiered system that separates concerns between the client, the server, and external AI services. This structure ensures scalability, maintainability, and a robust user experience.

**4.1. Client-Side Architecture (Next.js & React)**

The client is a dynamic web application built with Next.js and React, responsible for rendering the user interface and managing user interactions.
*   **UI Components:** The interface is composed of modular React components (\`/src/components\`) for the chat layout, message bubbles, and input controls. The main application view is handled by \`src/app/page.tsx\`, which orchestrates the user experience.
*   **State Management:** The conversational state, including the complete message history and the long-term memory summary, is managed using standard React hooks (\`useState\`) within the main page component. This localized state management is simple and effective for a single-page chat application.
*   **Browser APIs:** The client leverages two key browser APIs for multi-modal input/output. The **Web Speech API** is used within our \`useSpeechToText\` hook for real-time voice transcription. The standard **HTML5 Audio API** is used by the \`useTextToSpeech\` hook to play the audio received from the server.
*   **Communication Layer:** Communication with the backend is handled exclusively through **Next.js Server Actions** (\`/src/app/actions.ts\`). These actions provide a secure and seamless RPC-style interface, allowing client-side components to call server-side functions (e.g., \`getBotResponse\`, \`getSummary\`) as if they were local asynchronous methods.

**4.2. Server-Side Architecture (Next.js & Genkit)**

The server-side logic runs within the Next.js Node.js environment and is powered by Google's Genkit framework.
*   **Server Action Handlers:** The server actions serve as the entry point to the backend. They receive requests and data from the client and are responsible for invoking the appropriate AI logic.
*   **Genkit AI Flows:** The core AI "brain" is encapsulated in a series of Genkit flows (\`/src/ai/flows/*.ts\`). These are instrumented, server-side modules that define specific AI-driven tasks:
    *   **\`chatbotRespondsWithTextFlow\`:** The primary flow that orchestrates the generation of a chat response. It receives the user query, chat history, and memory summary. It uses a Genkit **Tool** (\`faqTool\`) to perform a preliminary search against an internal knowledge base. Based on the tool's output and the conversational context, it then invokes the Gemini model to generate a final text response.
    *   **\`summarizeChatHistoryFlow\`:** A specialized flow responsible for executing the long-term memory strategy. It receives a portion of the chat history and uses Gemini to produce a concise summary.
    *   **\`textToSpeechFlow\`:** This flow handles all voice generation. It receives text, sanitizes it by removing URLs, and calls the Google TTS model. The resulting audio is converted to a \`.wav\` data URI before being returned to the client.

**4.3. External Google AI Services**

The server-side Genkit flows act as an abstraction layer that communicates with powerful, managed Google AI services.
*   **Google Gemini Model:** The foundational LLM used for all natural language understanding, generation, and summarization tasks. Its flexibility and reasoning capabilities power the core intelligence of the chatbot.
*   **Google Text-to-Speech (TTS) Model:** A specialized model (\`gemini-2.5-flash-preview-tts\`) that generates high-quality, lifelike speech. A key feature leveraged by our architecture is its ability to automatically detect the input language and select an appropriate voice, which is critical for the application's bilingual requirements.

This tiered architecture allows each component to focus on its specific responsibility: the client on user interaction, the server on orchestrating AI logic, and the external services on providing state-of-the-art AI capabilities.

---

### **5. A Robust Server-Side Architecture for Multilingual Voice Interaction**

Enabling natural voice interaction is a key step in making chatbots more accessible and user-friendly. For Spinneys ChatAssist, this meant implementing both Speech-to-Text (STT) for user input and Text-to-Speech (TTS) for chatbot responses. Critically, the solution needed to be reliable across all browsers and expertly handle both English and Arabic.

#### **5.1. The Challenge with Client-Side Voice APIs**

The most direct way to implement voice in a web app is to use the browser's built-in Web Speech API. However, this approach has several critical drawbacks that made it unsuitable for our needs:
*   **Inconsistent Browser Support**: The API is not standardized. Implementations vary significantly between Chrome, Firefox, and Safari, and it is entirely absent in some browsers.
*   **Limited Voice and Language Selection**: The available voices are dependent on the user's operating system. This results in an inconsistent user experience and, most importantly, often lacks support for high-quality voices in specific languages like Arabic.
*   **Lower Quality Synthesis**: The quality of client-side TTS is generally inferior to the advanced, AI-powered models available via server-side APIs.

#### **5.2. The Server-Side Synthesis Solution**

To overcome these issues, we designed a robust architecture that centralizes voice synthesis on the server, ensuring a consistent, high-quality experience for all users, regardless of their browser or device.

**Speech-to-Text (User Input):**
For user input, we still leverage the browser's Web Speech API via the \`useSpeechToText\` custom hook. This is a pragmatic choice because STT is more widely supported and less sensitive to quality variations than TTS. The hook captures audio from the microphone, transcribes it to text in real-time, and populates the chat input field. This text is then sent to the backend like any other message.

**Text-to-Speech (Chatbot Output):**
The core of our voice innovation lies in the server-side generation of the chatbot's voice.
1.  **Client-Side Trigger**: When the user clicks the "play audio" button on a message, the \`useTextToSpeech\` hook is invoked. Instead of synthesizing speech in the browser, it makes a call to the \`getAudioForText\` server action.

2.  **Server-Side Genkit Flow (\`textToSpeechFlow\`)**: This server action triggers a dedicated Genkit flow designed for TTS.
    *   **Model Selection**: The flow is configured to use Google's \`gemini-2.5-flash-preview-tts\` model. This is a powerful, multimodal model capable of high-fidelity speech synthesis.
    *   **Automatic Language Detection**: Crucially, we do not manually specify the language or voice. The model is advanced enough to automatically detect the language of the input text (whether English, Arabic, or even mixed) and select an appropriate, high-quality voice. This eliminated a significant point of failure from our earlier implementations, where manual voice selection caused errors.
    *   **URL Stripping**: Before sending the text to the model, the flow sanitizes the input by removing any URLs. This prevents the TTS model from attempting to read out long, nonsensical web addresses, which improves the naturalness of the speech.

3.  **Data Formatting and Return**: The TTS model returns raw audio data. The flow converts this data into the standard \`.wav\` format and encodes it into a Base64 data URI string (\`data:audio/wav;base64,...\`).

4.  **Client-Side Playback**: The data URI is returned to the \`useTextToSpeech\` hook on the client. The hook simply sets this URI as the \`src\` of a standard HTML \`<audio>\` element and calls \`.play()\`. This approach is universally compatible and ensures that every user hears the exact same high-quality, server-generated audio.

By centralizing TTS on the server, we bypass the inconsistencies of browser APIs and guarantee that every user hears the intended high-quality, multilingual voice of the Spinneys ChatAssist. This robust architecture is key to providing a premium and accessible user experience.
`;


const chatbotRespondsWithTextFlow = ai.defineFlow(
  {
    name: 'chatbotRespondsWithTextFlow',
    inputSchema: ChatbotRespondsWithTextInputSchema,
    outputSchema: ChatbotRespondsWithTextOutputSchema,
  },
  async (input) => {
    const messages: Message[] = [];
    
    if (input.summary) {
        messages.push({
            role: 'system',
            content: [{ text: `This is a summary of the conversation so far:\n${input.summary}` }],
        });
    }

    // Add the recent chat history
    if (input.chatHistory) {
        messages.push(...input.chatHistory.map(msg => ({
            role: msg.role as 'user' | 'model',
            content: [{text: msg.content}],
        })));
    }
    
    // Add the latest user query
    messages.push({ role: 'user', content: [{ text: input.query }] });

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      messages: messages,
      system: systemPrompt,
      tools: [faqTool],
    });

    return {
      textResponse: text,
    };
  }
);

    