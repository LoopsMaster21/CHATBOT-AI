'use client';

import type {ChatMessage} from '@/lib/types';
import {useState} from 'react';
import ChatLayout from '@/components/chat/chat-layout';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import {getBotResponse} from '@/app/actions';
import {v4 as uuidv4} from 'uuid';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const chatHistory = newMessages.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const botResponse = await getBotResponse({
        question: messageContent,
        chatHistory: chatHistory,
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
