'use client';

import {useState, useCallback, useRef, useEffect} from 'react';
import {getAudioForText} from '@/app/actions';

export const useTextToSpeech = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
        const audio = new Audio();
        audio.onplay = () => setIsSpeaking(true);
        audio.onpause = () => setIsSpeaking(false);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = (e) => {
            console.error('Audio playback error', e);
            setIsFetching(false);
            setIsSpeaking(false);
        };
        audioRef.current = audio;
    }
    
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    if (isSpeaking) {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsSpeaking(false);
        return;
    }

    if (isFetching) {
        return;
    }

    setIsFetching(true);
    setIsSpeaking(false);

    try {
      const result = await getAudioForText({text});

      if (result.error || !result.audioDataUri) {
        throw new Error(result.error || 'No audio data received');
      }
      
      if (audioRef.current) {
        audioRef.current.src = result.audioDataUri;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Failed to get or play audio:', error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, isSpeaking]);

  return {speak, isFetching, isSpeaking};
};
