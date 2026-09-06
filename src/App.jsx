import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Chat from './components/Chat'
import Memory from './components/Memory'

export default function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="flex-1 min-h-0 h-[calc(100vh-64px)] sm:h-screen overflow-y-auto">
        {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
        {page === 'tasks' && <Tasks />}
        {page === 'chat' && <Chat />}
        {page === 'memory' && <Memory />}
      </main>
    </div>
  )
}
