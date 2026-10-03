import { ArrowLeft, CheckCircle2, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { formatCurrency } from '../utils/booking'

export const PaymentPage = () => {
  const navigate = useNavigate()
  const { state, setBookingId, setPaymentStatus } = useBooking()

  const handleDemoPayment = () => {
    const bookingId = `WITCHYU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    setBookingId(bookingId)
    setPaymentStatus('demo-success')
    navigate('/booking/success')
  }

  return (
    <div className="px-4 pb-8 pt-5">
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/booking')}
          className="inline-flex items-center gap-2 text-sm text-[#d9cbff]"
          aria-label="กลับไปหน้าจอง"
        >
          <ArrowLeft size={18} />
          กลับ
        </button>
        <h1 className="text-xl font-semibold text-white">ชำระเงิน</h1>
        <div className="w-12" />
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#181621] p-5">
        <p className="text-sm text-[#c7c2d5]">ยอดที่ต้องชำระ</p>
        <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(state.totalPrice)}</p>

        <div className="mt-5 rounded-2xl border border-dashed border-[#a779ff] bg-[#1d1730] p-6">
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-[#f7f4ff] text-[#1d1730] shadow-inner">
            <QrCode size={96} />
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-[#d7d1ea]">
            ระบบชำระเงินจริงจะเชื่อมต่อใน Phase 2
          </p>
        </div>

        <button
          type="button"
          onClick={handleDemoPayment}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9c6dff] via-[#8d5ff0] to-[#6f57de] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(126,97,220,0.35)]"
        >
          <CheckCircle2 size={18} />
          จำลองการชำระเงินสำเร็จ
        </button>
      </div>
    </div>
  )
}
