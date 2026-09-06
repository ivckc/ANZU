// Simple localStorage-backed persistence for Anzu.
// Everything lives on-device for the MVP — no backend database yet.

const KEYS = {
  tasks: 'anzu:tasks',
  notes: 'anzu:notes',
  memory: 'anzu:memory',
  chats: 'anzu:chats',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const store = {
  getTasks: () => read(KEYS.tasks, []),
  saveTasks: (tasks) => write(KEYS.tasks, tasks),

  getNotes: () => read(KEYS.notes, []),
  saveNotes: (notes) => write(KEYS.notes, notes),

  getMemory: () => read(KEYS.memory, []),
  saveMemory: (memory) => write(KEYS.memory, memory),

  getChats: () => read(KEYS.chats, []),
  saveChats: (chats) => write(KEYS.chats, chats),
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
