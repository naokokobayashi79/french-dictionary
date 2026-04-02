export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(
  text: string,
  lang: string = "fr-FR",
  onError?: () => void
): void {
  if (!isSpeechSupported()) {
    onError?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;

  const voices = window.speechSynthesis.getVoices();
  const frenchVoice = voices.find(
    (v) => v.lang === "fr-FR" || v.lang.startsWith("fr")
  );
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  utterance.onerror = () => onError?.();

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
