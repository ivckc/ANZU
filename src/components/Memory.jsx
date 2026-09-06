import { useEffect, useState } from 'react'
import { store, uid } from '../lib/storage'

export default function Memory() {
  const [items, setItems] = useState([])
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    setItems(store.getMemory())
  }, [])

  function persist(next) {
    setItems(next)
    store.saveMemory(next)
  }

  function addItem(e) {
    e.preventDefault()
    if (!text.trim()) return
    persist([{ id: uid(), text: text.trim(), createdAt: Date.now() }, ...items])
    setText('')
  }

  function removeItem(id) {
    persist(items.filter((i) => i.id !== id))
  }

  const visible = items.filter((i) => i.text.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-3xl mx-auto p-5 sm:p-8 space-y-6">
      <header>
        <h1 className="font-display text-2xl text-goldbright">الذاكرة</h1>
        <p className="text-sm text-muted mt-1">
          معلومات ثابتة عنك — مشاريعك، تفضيلاتك، سياق أعمالك — تقدر أنزو يستخدمها بالمحادثة.
        </p>
        <div className="wedge-divider mt-4" />
      </header>

      <form onSubmit={addItem} className="bg-surface border border-line rounded-xl p-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="مثال: أدير قناة اسمها شوي معرفة، ومحل ملابس اسمه Nova Wear..."
          className="flex-1 bg-night border border-line rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button className="px-4 py-2 rounded-lg bg-gold text-night text-sm font-semibold hover:bg-goldbright transition-colors">
          حفظ
        </button>
      </form>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="بحث بالذاكرة..."
        className="w-full bg-surface border border-line rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
      />

      <ul className="space-y-2">
        {visible.length === 0 && <li className="text-sm text-muted text-center py-8">لا توجد معلومات محفوظة بعد.</li>}
        {visible.map((i) => (
          <li key={i.id} className="flex items-start justify-between gap-3 bg-surface border border-line rounded-lg px-4 py-3">
            <span className="text-sm text-bone/90">{i.text}</span>
            <button onClick={() => removeItem(i.id)} className="text-muted hover:text-clay text-xs shrink-0">
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
