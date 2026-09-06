const NAV = [
  { id: 'dashboard', label: 'الرئيسية' },
  { id: 'tasks', label: 'المهام' },
  { id: 'chat', label: 'أنزو' },
  { id: 'memory', label: 'الذاكرة' },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-s border-line bg-surface/60 backdrop-blur-sm">
      <div className="flex sm:flex-col h-full">
        <div className="hidden sm:flex flex-col items-center gap-1 py-8 border-b border-line">
          <span className="font-display text-2xl text-goldbright tracking-wide">أنزو</span>
          <span className="text-[11px] text-muted tracking-widest">ANZU</span>
        </div>
        <nav className="flex sm:flex-col flex-1 justify-around sm:justify-start sm:gap-1 sm:p-3">
          {NAV.map((item) => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex-1 sm:flex-none text-center sm:text-right px-3 py-3 sm:py-2.5 sm:rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'text-night bg-gold font-semibold sm:shadow-[0_0_0_1px_rgba(201,162,75,0.4)]'
                    : 'text-bone/80 hover:bg-surface2'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
