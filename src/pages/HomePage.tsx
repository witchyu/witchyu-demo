import { ArrowRight, CalendarDays, MessageCircleMore, MoonStar, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const featureCards = [
  {
    icon: CalendarDays,
    title: 'จองคิวออนไลน์',
    text: 'เลือกแพ็กเกจและเวลาที่ต้องการได้ง่าย ๆ',
  },
  {
    icon: MessageCircleMore,
    title: 'พูดคุยกับ Witchyu',
    text: 'ระบบแชทสำหรับผู้ที่มีสิทธิ์ใช้งาน',
  },
  {
    icon: Sparkles,
    title: 'เลือกคำถามที่เหมาะกับคุณ',
    text: 'มีแพ็กเกจหลายรูปแบบตามสถานการณ์',
  },
]

export const HomePage = () => (
  <div className="bg-[radial-gradient(circle_at_top,_#1d1830,_#100f17_50%)] px-4 pb-6 pt-6">
    <header className="mb-8 flex items-center justify-between pt-safe-top">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[#d8c4f2]">
          <MoonStar size={18} className="text-[#d8c4f2]" />
          WITCHYU
        </div>
        <p className="mt-1 text-[11px] text-[#b0abbe]">ดูดวง • จองคิวออนไลน์</p>
      </div>
      <div className="rounded-full border border-[#a470ff]/40 bg-[#171527] px-3 py-1 text-[10px] text-[#f3dcff]">
        Mystic
      </div>
    </header>

    <section className="rounded-[28px] border border-white/10 bg-[#171421]/80 p-5 shadow-[0_20px_60px_rgba(111,73,177,0.2)]">
      <div className="mb-4 flex items-center gap-2 text-[#f3dcff]">
        <MoonStar size={18} />
        <span className="text-xs uppercase tracking-[0.22em]">Moonlight Reading</span>
      </div>

      <h1 className="text-3xl font-semibold leading-tight text-white">ดูดวงกับ Witchyu</h1>
      <p className="mt-3 text-sm leading-6 text-[#c9c5d3]">
        เลือกคำถาม จองเวลา และชำระเงินได้ง่าย ๆ ในไม่กี่ขั้นตอน
      </p>

      <Link
        to="/booking"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#bb8bff] via-[#9d6df7] to-[#7a5af7] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(140,98,255,0.45)] transition-transform hover:scale-[1.01]"
      >
        จองคิวดูดวง
        <ArrowRight size={18} />
      </Link>
    </section>

    <section className="mt-6 space-y-3">
      {featureCards.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-2xl border border-white/8 bg-[#181621] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#2b2140] p-2 text-[#d8bdff]">
              <Icon size={20} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              <p className="mt-1 text-xs leading-5 text-[#aea9bc]">{text}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  </div>
)
