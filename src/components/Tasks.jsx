import { useEffect, useState } from 'react'
import { store, uid } from '../lib/storage'

const CATEGORIES = [
  { id: 'youtube', label: 'شوي معرفة', color: 'bg-lapis' },
  { id: 'business', label: 'الأعمال', color: 'bg-clay' },
  { id: 'personal', label: 'شخصي', color: 'bg-gold' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('personal')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setTasks(store.getTasks())
  }, [])

  function persist(next) {
    setTasks(next)
    store.saveTasks(next)
  }

  function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    const task = { id: uid(), title: title.trim(), category, due: due || null, done: false, createdAt: Date.now() }
    persist([task, ...tasks])
    setTitle('')
    setDue('')
  }

  function toggleDone(id) {
    persist(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function removeTask(id) {
    persist(tasks.filter((t) => t.id !== id))
  }

  const visible = tasks.filter((t) => {
    if (filter === 'all') return true
    if (filter === 'done') return t.done
    if (filter === 'open') return !t.done
    return t.category === filter
  })

  return (
    <div className="max-w-3xl mx-auto p-5 sm:p-8 space-y-6">
      <header>
        <h1 className="font-display text-2xl text-goldbright">المهام</h1>
        <div className="wedge-divider mt-4" />
      </header>

      <form onSubmit={addTask} className="bg-surface border border-line rounded-xl p-4 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="أضف مهمة جديدة..."
          className="w-full bg-night border border-line rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-night border border-line rounded-lg px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="bg-night border border-line rounded-lg px-3 py-2 text-sm"
          />
          <button className="ms-auto px-4 py-2 rounded-lg bg-gold text-night text-sm font-semibold hover:bg-goldbright transition-colors">
            إضافة
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 text-sm">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'open', label: 'مفتوحة' },
          { id: 'done', label: 'منجزة' },
          ...CATEGORIES,
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full border ${
              filter === f.id ? 'border-gold text-goldbright' : 'border-line text-muted hover:text-bone'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {visible.length === 0 && <li className="text-sm text-muted text-center py-8">ما فيه مهام هنا.</li>}
        {visible.map((t) => {
          const cat = CATEGORIES.find((c) => c.id === t.category)
          return (
            <li
              key={t.id}
              className="flex items-center gap-3 bg-surface border border-line rounded-lg px-4 py-3"
            >
              <button
                onClick={() => toggleDone(t.id)}
                className={`w-5 h-5 rounded-full border shrink-0 ${
                  t.done ? 'bg-gold border-gold' : 'border-muted'
                }`}
                aria-label="toggle done"
              />
              <span className={`flex-1 text-sm ${t.done ? 'line-through text-muted' : 'text-bone'}`}>
                {t.title}
              </span>
              {cat && <span className={`text-[11px] px-2 py-0.5 rounded-full ${cat.color} text-night font-medium`}>{cat.label}</span>}
              {t.due && <span className="text-xs text-muted">{t.due}</span>}
              <button onClick={() => removeTask(t.id)} className="text-muted hover:text-clay text-xs">
                حذف
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
