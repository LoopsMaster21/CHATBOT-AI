'use client';

import {useState, useEffect} from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  const speak = (text: string) => {
    if (!supported || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Prefer a Google voice if available
    const googleVoice = voices.find(voice => voice.name.includes('Google'));
    if (googleVoice) {
      utterance.voice = googleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsSpeaking(false);
    }

    window.speechSynthesis.speak(utterance);
  };

  return {speak, isSpeaking, supported};
};
