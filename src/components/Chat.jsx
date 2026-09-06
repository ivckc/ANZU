import { useEffect, useRef, useState } from 'react'
import { store, uid } from '../lib/storage'
import {
  createRecognizer,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speak,
  stopSpeaking,
} from '../lib/speech'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceReplyOn, setVoiceReplyOn] = useState(true)
  const [error, setError] = useState(null)
  const recognizerRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const saved = store.getChats()
    setMessages(saved.length ? saved : [{ id: uid(), role: 'assistant', text: 'هلا، أني أنزو. شلون أگدر أساعدك اليوم؟' }])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  function persist(next) {
    setMessages(next)
    store.saveChats(next)
  }

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setError(null)
    const userMsg = { id: uid(), role: 'user', text: trimmed }
    const next = [...messages, userMsg]
    persist(next)
    setInput('')
    setLoading(true)

    try {
      const memory = store.getMemory().map((m) => m.text)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.text })),
          memory,
        }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      const replyText = data.reply || 'ما وصلني رد، جرب مرة ثانية.'
      const assistantMsg = { id: uid(), role: 'assistant', text: replyText }
      persist([...next, assistantMsg])
      if (voiceReplyOn) speak(replyText, { lang: 'ar-IQ' })
    } catch (err) {
      setError('تعذر الوصول لأنزو حالياً — تأكد من إعداد مفتاح Claude API على الخادم.')
    } finally {
      setLoading(false)
    }
  }

  function toggleListening() {
    if (listening) {
      recognizerRef.current?.stop()
      setListening(false)
      return
    }
    const recognizer = createRecognizer({
      lang: 'ar-IQ',
      onResult: ({ finalText, interimText }) => {
        setInput(finalText || interimText)
      },
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    })
    if (!recognizer) {
      setError('المتصفح هذا ما يدعم التعرف على الصوت. جرب Google Chrome.')
      return
    }
    recognizerRef.current = recognizer
    setListening(true)
    stopSpeaking()
    recognizer.start()
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col p-5 sm:p-8">
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-goldbright">أنزو</h1>
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={voiceReplyOn}
              onChange={(e) => setVoiceReplyOn(e.target.checked)}
              className="accent-gold"
            />
            قراءة الرد صوتياً
          </label>
        </div>
        <div className="wedge-divider mt-4" />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pe-1">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-surface2 text-bone rounded-bs-sm'
                  : 'bg-lapisdeep/70 border border-lapis/40 text-bone rounded-be-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-lapisdeep/70 border border-lapis/40 rounded-2xl px-4 py-2.5 text-sm text-muted">
              أنزو يفكر...
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-clay mt-2">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(input)
        }}
        className="mt-4 flex items-center gap-2 bg-surface border border-line rounded-xl p-2"
      >
        {isSpeechRecognitionSupported() && (
          <button
            type="button"
            onClick={toggleListening}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              listening ? 'bg-clay text-bone animate-pulse' : 'bg-night text-gold hover:bg-surface2'
            }`}
            aria-label="تسجيل صوتي"
            title="تحدث بدل الكتابة"
          >
            🎙
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? 'أستمع...' : 'اكتب رسالتك لأنزو...'}
          className="flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 px-4 py-2 rounded-lg bg-gold text-night text-sm font-semibold hover:bg-goldbright transition-colors disabled:opacity-50"
        >
          إرسال
        </button>
      </form>
      {!isSpeechSynthesisSupported() && (
        <p className="text-[11px] text-muted mt-2">ملاحظة: هذا المتصفح ما يدعم قراءة الردود صوتياً.</p>
      )}
    </div>
  )
}
