'use client';

import {type ChatMessage} from '@/lib/types';
import {useEffect, useRef} from 'react';
import ChatMessageComponent from '@/components/chat/chat-message';
import {Loader2} from 'lucide-react';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatMessages({messages, isLoading}: ChatMessagesProps) {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollableContainerRef} className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-4">
        {messages.map(message => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                S
            </div>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Spinneys is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}
