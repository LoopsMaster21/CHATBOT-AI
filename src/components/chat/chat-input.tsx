'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Send, Mic, Download, Square} from 'lucide-react';
import {useSpeechToText} from '@/hooks/use-speech-to-text';
import {useToast} from '@/hooks/use-toast';
import {type ChatMessage} from '@/lib/types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  messages: ChatMessage[];
}

export default function ChatInput({onSendMessage, isLoading, messages}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const {toast} = useToast();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleDownloadChat = () => {
    if (messages.length === 0) {
      toast({
        title: 'Chat is empty',
        description: 'There are no messages to download.',
      });
      return;
    }
    const chatText = messages
      .map(m => `${m.role === 'user' ? 'You' : 'Spinneys'}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([chatText], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spinneys-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Chat downloaded',
      description: 'Your chat has been saved as spinneys-chat.txt.',
    });
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="border-t bg-background/80 p-4 backdrop-blur-sm">
      <div className="relative">
        <Textarea
          placeholder="Type your message here..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="min-h-[48px] resize-none pr-24"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {hasRecognitionSupport && (
            <Button
                size="icon"
                variant={isListening ? 'destructive' : 'ghost'}
                onClick={handleMicClick}
                disabled={isLoading}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
          )}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleDownloadChat}
            disabled={isLoading}
            aria-label="Download chat"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
