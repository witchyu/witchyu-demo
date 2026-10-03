import { CheckCircle2, House, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { formatCurrency } from '../utils/booking'

export const BookingSuccessPage = () => {
  const { state } = useBooking()

  return (
    <div className="px-4 pb-8 pt-8">
      <div className="rounded-[30px] border border-[#b8efcb]/30 bg-[#171c20] p-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2ca76d]/20 text-[#80ecad]">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-white">จองคิวสำเร็จ</h1>

        <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-[#111620] p-4 text-left text-sm text-[#d6d7de]">
          <div className="flex justify-between gap-3">
            <span>หมายเลขการจอง</span>
            <span className="font-medium text-white">{state.bookingId || 'WITCHYU-XXXXXX'}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>วันที่</span>
            <span className="font-medium text-white">{state.selectedDate || '-'}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>เวลา</span>
            <span className="font-medium text-white">{state.selectedTime || '-'}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>แพ็กเกจ</span>
            <span className="max-w-[180px] text-right font-medium text-white">
              {state.selectedPackages.map((item) => item.name).join(', ') || '—'}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>ยอดรวม</span>
            <span className="font-medium text-white">{formatCurrency(state.totalPrice)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>สถานะ</span>
            <span className="font-medium text-[#90f0bc]">Demo / Waiting for Payment Integration</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#201f2d] px-4 py-3 text-sm font-medium text-white"
          >
            <House size={18} />
            กลับหน้าหลัก
          </Link>
          <Link
            to="/profile"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#a771ff] to-[#7e5fe4] px-4 py-3 text-sm font-semibold text-white"
          >
            <UserRound size={18} />
            ดูการจองของฉัน
          </Link>
        </div>
      </div>
    </div>
  )
}
