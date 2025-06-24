'use client';

import {type ChatMessage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Volume2, User} from 'lucide-react';
import {useTextToSpeech} from '@/hooks/use-text-to-speech';

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessageComponent({message}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const {speak, isSpeaking} = useTextToSpeech();

  const handlePlayAudio = () => {
    speak(message.content);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">S</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-lg p-3 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handlePlayAudio}
            className="mt-2 h-6 w-6 text-muted-foreground"
            aria-label="Play message audio"
            disabled={isSpeaking}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
            <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
