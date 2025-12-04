'use client';

import type {ChatMessage} from '@/lib/types';
import {useState} from 'react';
import ChatLayout from '@/components/chat/chat-layout';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import {getBotResponse, getSummary} from '@/app/actions';
import {v4 as uuidv4} from 'uuid';

const RECENT_HISTORY_LENGTH = 6; // Keep the last 6 messages
const SUMMARY_TRIGGER_LENGTH = 12; // Summarize when history exceeds 12 messages

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: messageContent,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let currentSummary = summary;
      // The history for the API call excludes the latest user message
      let historyForApi = newMessages.slice(0, -1);

      // Check if we need to generate a new summary.
      // We do this when the history hits the trigger length and periodically after that.
      if (
        historyForApi.length >= SUMMARY_TRIGGER_LENGTH &&
        (summary === null || historyForApi.length % RECENT_HISTORY_LENGTH === 0)
      ) {
        const summaryResult = await getSummary({chatHistory: historyForApi});
        if (summaryResult.summary) {
          currentSummary = summaryResult.summary;
          setSummary(currentSummary);
        }
      }
      
      // Determine what to send to the bot. We always send the most recent messages.
      if (historyForApi.length > RECENT_HISTORY_LENGTH) {
        historyForApi = historyForApi.slice(-RECENT_HISTORY_LENGTH);
      }

      const botResponse = await getBotResponse({
        query: messageContent,
        chatHistory: historyForApi,
        summary: currentSummary,
      });

      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        content: botResponse.answer,
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-[100dvh] flex-col items-center">
      <ChatLayout>
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} messages={messages} />
      </ChatLayout>
    </main>
  );
}
