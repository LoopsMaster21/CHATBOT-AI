'use client';

import {type ChatMessage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Volume2, User, Loader2, Square} from 'lucide-react';
import {useTextToSpeech} from '@/hooks/use-text-to-speech';

const renderContentWithLinks = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/90"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export default function ChatMessageComponent({message}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const {speak, isFetching, isSpeaking} = useTextToSpeech();

  const handlePlayAudio = () => {
    speak(message.content);
  };
  
  const renderIcon = () => {
    if (isFetching) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (isSpeaking) {
      return <Square className="h-4 w-4" />;
    }
    return <Volume2 className="h-4 w-4" />;
  };
  
  const getAriaLabel = () => {
    if (isFetching) {
      return 'Loading audio...';
    }
    if (isSpeaking) {
      return 'Stop audio';
    }
    return 'Play message audio';
  }

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
        <p className="whitespace-pre-wrap">{renderContentWithLinks(message.content)}</p>
        {!isUser && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handlePlayAudio}
            className="mt-2 h-6 w-6 text-muted-foreground"
            aria-label={getAriaLabel()}
            disabled={isFetching}
          >
            {renderIcon()}
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
