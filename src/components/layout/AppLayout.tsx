import { Outlet, useLocation } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'

export const AppLayout = () => {
  const location = useLocation()
  const hideNavigation = location.pathname === '/payment' || location.pathname === '/booking/success'

  return (
    <div className="min-h-screen bg-[#0a0a12] px-0 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col bg-[#100f17] shadow-[0_0_40px_rgba(0,0,0,0.35)]">
        <div className="flex-1 pb-20 pt-safe-top">
          <Outlet />
        </div>
        {!hideNavigation && <BottomNavigation />}
      </div>
    </div>
  )
}
