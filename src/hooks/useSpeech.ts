"use client";

import { useState, useCallback, useEffect } from "react";
import { speak, stopSpeaking, isSpeechSupported } from "@/utils/speech";

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());

    // Load voices (some browsers need this)
    if (isSpeechSupported()) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speakText = useCallback((text: string) => {
    setError(false);
    setSpeaking(true);
    speak(text, "fr-FR", () => {
      setError(true);
      setSpeaking(false);
    });

    // Monitor speech end
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setSpeaking(false);
        clearInterval(check);
      }
    }, 100);
  }, []);

  const stop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);

  return { supported, speaking, error, speakText, stop };
}
