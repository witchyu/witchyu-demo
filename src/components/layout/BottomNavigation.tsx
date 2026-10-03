import { CalendarDays, House, MessageCircleMore, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'หน้าหลัก', Icon: House },
  { to: '/booking', label: 'จองคิว', Icon: CalendarDays },
  { to: '/chat', label: 'แชท', Icon: MessageCircleMore },
  { to: '/profile', label: 'โปรไฟล์', Icon: UserRound },
]

export const BottomNavigation = () => (
  <nav className="safe-area-bottom fixed bottom-0 left-1/2 z-40 flex w-full max-w-[520px] -translate-x-1/2 items-center justify-around border-t border-white/10 bg-[#151420]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
    {navItems.map(({ to, label, Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
          `flex min-w-[72px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-all ${
            isActive ? 'text-[#f4d7ff] bg-white/5' : 'text-[#b3afc9]'
          }`
        }
        aria-label={label}
      >
        <Icon size={20} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
)
