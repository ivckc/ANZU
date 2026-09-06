// Thin wrapper around the browser's Web Speech API.
// Speech-to-text uses SpeechRecognition; text-to-speech uses SpeechSynthesis.
// Both are free and built into Chrome — no external API key needed for the MVP.

export function isSpeechRecognitionSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

export function isSpeechSynthesisSupported() {
  return 'speechSynthesis' in window
}

// lang: 'ar-IQ' for Iraqi Arabic locale (falls back to generic ar/en support
// in the browser's recognizer), or 'en-US'.
export function createRecognizer({ lang = 'ar-IQ', onResult, onEnd, onError }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return null

  const recognizer = new SpeechRecognition()
  recognizer.lang = lang
  recognizer.interimResults = true
  recognizer.continuous = false

  recognizer.onresult = (event) => {
    let finalText = ''
    let interimText = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) finalText += transcript
      else interimText += transcript
    }
    onResult?.({ finalText, interimText })
  }
  recognizer.onend = () => onEnd?.()
  recognizer.onerror = (e) => onError?.(e)

  return recognizer
}

export function speak(text, { lang = 'ar-IQ', rate = 1, onEnd } = {}) {
  if (!isSpeechSynthesisSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  utterance.onend = () => onEnd?.()

  // Try to pick a voice matching the requested language; browsers load
  // voices asynchronously, so fall back gracefully if none match yet.
  const voices = window.speechSynthesis.getVoices()
  const match = voices.find((v) => v.lang?.toLowerCase().startsWith(lang.split('-')[0]))
  if (match) utterance.voice = match

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
