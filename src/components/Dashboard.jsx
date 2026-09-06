import { useEffect, useState } from 'react'
import { store, uid } from '../lib/storage'

function formatDate(d) {
  return new Intl.DateTimeFormat('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
}

export default function Dashboard({ onNavigate }) {
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    setTasks(store.getTasks())
    setNotes(store.getNotes())
  }, [])

  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)
  const todaysTasks = tasks.filter((t) => t.due === todayKey && !t.done)
  const overdue = tasks.filter((t) => t.due && t.due < todayKey && !t.done)
  const upcoming = tasks
    .filter((t) => t.due && t.due > todayKey && !t.done)
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 3)

  function addNote(e) {
    e.preventDefault()
    if (!noteText.trim()) return
    const next = [{ id: uid(), text: noteText.trim(), createdAt: Date.now() }, ...notes]
    setNotes(next)
    store.saveNotes(next)
    setNoteText('')
  }

  function removeNote(id) {
    const next = notes.filter((n) => n.id !== id)
    setNotes(next)
    store.saveNotes(next)
  }

  return (
    <div className="max-w-3xl mx-auto p-5 sm:p-8 space-y-8">
      <header>
        <p className="text-muted text-sm">{formatDate(today)}</p>
        <h1 className="font-display text-3xl text-goldbright mt-1">أهلاً، عبود</h1>
        <div className="wedge-divider mt-4" />
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="bg-surface border border-line rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-bone">مهام اليوم</h2>
            <button onClick={() => onNavigate('tasks')} className="text-xs text-gold hover:text-goldbright">
              عرض الكل
            </button>
          </div>
          {overdue.length > 0 && (
            <p className="text-xs text-clay mt-2">{overdue.length} مهمة متأخرة تحتاج انتباهك</p>
          )}
          <ul className="mt-3 space-y-2">
            {todaysTasks.length === 0 && overdue.length === 0 && (
              <li className="text-sm text-muted">ما عندك مهام اليوم — يوم صافي.</li>
            )}
            {[...overdue, ...todaysTasks].slice(0, 5).map((t) => (
              <li key={t.id} className="text-sm text-bone/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {t.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface border border-line rounded-xl p-5">
          <h2 className="font-display text-lg text-bone">قريباً</h2>
          <ul className="mt-3 space-y-2">
            {upcoming.length === 0 && <li className="text-sm text-muted">لا توجد مهام مجدولة قريباً.</li>}
            {upcoming.map((t) => (
              <li key={t.id} className="text-sm text-bone/90 flex items-center justify-between">
                <span>{t.title}</span>
                <span className="text-xs text-muted">{t.due}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface border border-line rounded-xl p-5">
        <h2 className="font-display text-lg text-bone mb-3">ملاحظة سريعة</h2>
        <form onSubmit={addNote} className="flex gap-2">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="اكتب أي شي يخطر ببالك..."
            className="flex-1 bg-night border border-line rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button className="px-4 py-2 rounded-lg bg-gold text-night text-sm font-semibold hover:bg-goldbright transition-colors">
            حفظ
          </button>
        </form>
        <ul className="mt-4 space-y-2">
          {notes.slice(0, 5).map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-3 text-sm text-bone/90 bg-night/40 rounded-lg px-3 py-2">
              <span>{n.text}</span>
              <button onClick={() => removeNote(n.id)} className="text-muted hover:text-clay text-xs shrink-0">
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
