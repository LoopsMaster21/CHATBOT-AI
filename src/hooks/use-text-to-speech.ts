'use client';

import {useState, useEffect, useCallback} from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
      const handleVoicesChanged = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      // Voices may load asynchronously.
      handleVoicesChanged();
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Detect if the text contains Arabic characters to select the correct voice.
    const isArabic = /[\u0600-\u06FF]/.test(text);

    const targetVoiceName = isArabic ? 'ar-XA-Standard-B' : 'en-GB-Standard-O';
    const targetLangPrefix = isArabic ? 'ar' : 'en';
    
    // Set language on utterance for better system default fallback.
    utterance.lang = isArabic ? 'ar-XA' : 'en-GB';

    // 1. Try to find the user's specifically requested voice by name.
    let selectedVoice = voices.find(voice => voice.name === targetVoiceName);

    // 2. If not found, fall back to a standard Google voice for the language.
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
            voice.name.includes('Google') && voice.lang.startsWith(targetLangPrefix)
        );
    }
    
    // 3. If still not found, fall back to the first available voice for that language.
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith(targetLangPrefix));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      // This might happen if voices haven't loaded yet.
      // The browser will use its default voice for the utterance's lang property.
      console.warn(`Could not find a suitable TTS voice. Using system default.`);
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
        setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsSpeaking(false);
    }

    window.speechSynthesis.cancel(); // Clear any queued utterances.
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, supported, voices]);

  return {speak, isSpeaking, supported};
};
