import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  FileText,
  MoonStar,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { packageGroups } from '../data/packages'
import { useBooking } from '../context/BookingContext'
import { formatCurrency, getAvailableTimeSlots } from '../utils/booking'
import { validateBookingDateTime, validateCustomerInfo, validateNote, validatePackageSelection } from '../utils/validation'

const relationshipOptions = [
  { value: 'single', label: 'โสด' },
  { value: 'dating', label: 'คนคุย' },
  { value: 'in_relationship', label: 'มีแฟน' },
  { value: 'married', label: 'แต่งงาน' },
  { value: 'separated', label: 'แยกทาง / หย่าร้าง' },
  { value: 'other', label: 'อื่น ๆ' },
  { value: 'not_specified', label: 'ไม่ระบุ' },
] as const

const steps = ['ข้อมูลผู้จอง', 'เลือกแพ็กเกจ', 'วันและเวลา', 'ตรวจสอบ']

export const BookingPage = () => {
  const navigate = useNavigate()
  const {
    state,
    updateCustomerInfo,
    togglePackageSelection,
    setSelectedDate,
    setSelectedTime,
    setNote,
    setBookingId,
  } = useBooking()

  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [detailPackageId, setDetailPackageId] = useState<string | null>(null)
  const [activeMultiGroup, setActiveMultiGroup] = useState<string | null>(null)

  const upcomingDates = useMemo(() => {
    const days: { value: string; label: string; compactLabel: string }[] = []

    for (let offset = 1; offset <= 7; offset += 1) {
      const date = new Date()
      date.setDate(date.getDate() + offset)

      days.push({
        value: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString('th-TH', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        compactLabel: date.toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'short',
        }),
      })
    }

    return days
  }, [])

  const selectedPackageIds = state.selectedPackages.map((pkg) => pkg.id)
  const availableTimeSlots = getAvailableTimeSlots(selectedPackageIds)
  const selectedMultiplePackages = state.selectedPackages.filter((pkg) => pkg.selectionMode === 'multiple')
  const detailPackage = packageGroups
    .flatMap((group) => group.items)
    .find((item) => item.id === detailPackageId)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validateCurrentStep = () => {
    const nextErrors: Record<string, string> = {}

    if (currentStep === 1) {
      Object.assign(nextErrors, validateCustomerInfo(state.customerInfo))
    }

    if (currentStep === 2) {
      Object.assign(nextErrors, validatePackageSelection(state.selectedPackages))
    }

    if (currentStep === 3) {
      Object.assign(nextErrors, validateBookingDateTime(state.selectedDate, state.selectedTime))
    }

    if (currentStep === 4) {
      Object.assign(nextErrors, validateNote(state.note))
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => {
    if (!validateCurrentStep()) {
      return
    }

    setCurrentStep((previous) => Math.min(previous + 1, 4))
    scrollToTop()
  }

  const goBack = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 1))
    scrollToTop()
  }

  const handleConfirmBooking = () => {
    if (!validateCurrentStep()) {
      return
    }

    setBookingId(`WITCHYU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    navigate('/payment')
  }

  const handleSingleGroupSelection = (groupId: string, pkgId: string) => {
    const matchingPackage = packageGroups
      .find((group) => group.id === groupId)
      ?.items.find((item) => item.id === pkgId)

    if (!matchingPackage) {
      return
    }

    togglePackageSelection(matchingPackage)
  }

  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-between gap-2 overflow-hidden rounded-2xl border border-white/10 bg-[#171521] p-2">
      {steps.map((stepTitle, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === stepNumber
        const isComplete = currentStep > stepNumber || (currentStep === 4 && stepNumber <= 4)

        return (
          <div key={stepTitle} className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                isActive ? 'bg-[#c394ff] text-[#140d1c]' : isComplete ? 'bg-[#2a8c68] text-white' : 'bg-[#2b233e] text-[#d9d1ea]'
              }`}
            >
              {stepNumber}
            </div>
            <span className={`hidden text-[10px] sm:block ${isActive ? 'text-white' : 'text-[#b4b0c7]'}`}>
              {stepTitle}
            </span>
          </div>
        )
      })}
    </div>
  )

  const renderPackageCard = (pkg: (typeof packageGroups)[number]['items'][number], group: (typeof packageGroups)[number]) => {
    const isSelected = state.selectedPackages.some((item) => item.id === pkg.id)
    const isMultipleGroup = group.selectionMode === 'multiple'
    const isActiveForMultiSelection = group.id === activeMultiGroup

    return (
      <button
        key={pkg.id}
        type="button"
        onClick={() => {
          if (isMultipleGroup && !isActiveForMultiSelection) {
            setActiveMultiGroup(group.id)
            return
          }

          if (isMultipleGroup && isActiveForMultiSelection) {
            togglePackageSelection(pkg)
            return
          }

          if (!isMultipleGroup) {
            handleSingleGroupSelection(group.id, pkg.id)
          }
        }}
        className={`relative flex min-h-[118px] flex-col justify-between rounded-2xl border p-3 text-left transition-all ${
          isSelected
            ? 'border-[#a77dff] bg-[#1d1830] shadow-[0_12px_28px_rgba(141,111,255,0.2)]'
            : 'border-white/10 bg-[#171521] hover:border-[#8f73ff]/60'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">{pkg.name}</h3>
            <p className="mt-1 text-[11px] leading-5 text-[#b7b3c6]">{pkg.description}</p>
          </div>
          {isMultipleGroup && isActiveForMultiSelection ? (
            <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#d7c9ff] bg-[#1e1a30]">
              {isSelected ? <Check size={12} className="text-[#d7c9ff]" /> : <Circle size={12} className="text-[#d7c9ff]" />}
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-[#fff2b5]">{formatCurrency(pkg.price)}</span>
          {pkg.questions && pkg.questions.length > 0 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setDetailPackageId(pkg.id)
              }}
              className="rounded-full border border-[#c9b8ff] bg-[#241d39] px-2 py-1 text-[10px] font-medium text-[#eddcff]"
            >
              ดูรายละเอียด
            </button>
          ) : null}
        </div>
        {pkg.note ? <p className="mt-2 text-[10px] text-[#f7d8a1]">{pkg.note}</p> : null}
      </button>
    )
  }

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium text-[#e7e2f5]">
              ชื่อเล่น
            </label>
            <input
              id="nickname"
              value={state.customerInfo.nickname}
              onChange={(event) => updateCustomerInfo('nickname', event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#171521] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ad85ff]"
              placeholder="เช่น ไอซ์"
              aria-label="ชื่อเล่น"
            />
            {errors.nickname ? <p className="text-xs text-[#ffb1b1]">{errors.nickname}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-[#e7e2f5]">
              ชื่อจริง
            </label>
            <input
              id="fullName"
              value={state.customerInfo.fullName}
              onChange={(event) => updateCustomerInfo('fullName', event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#171521] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ad85ff]"
              placeholder="ชื่อ-นามสกุล"
              aria-label="ชื่อจริง"
            />
            {errors.fullName ? <p className="text-xs text-[#ffb1b1]">{errors.fullName}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium text-[#e7e2f5]">
              อายุ
            </label>
            <input
              id="age"
              value={state.customerInfo.age}
              onChange={(event) => updateCustomerInfo('age', event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#171521] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ad85ff]"
              placeholder="เช่น 26"
              aria-label="อายุ"
              inputMode="numeric"
            />
            {errors.age ? <p className="text-xs text-[#ffb1b1]">{errors.age}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e7e2f5]">สถานะความสัมพันธ์</label>
            <div className="grid grid-cols-2 gap-2">
              {relationshipOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateCustomerInfo('relationship', option.value)}
                  className={`rounded-2xl border px-3 py-2 text-sm transition ${
                    state.customerInfo.relationship === option.value
                      ? 'border-[#a77dff] bg-[#241d39] text-white'
                      : 'border-white/10 bg-[#171521] text-[#d8d3e7]'
                  }`}
                  aria-label={`สถานะความสัมพันธ์ ${option.label}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.relationship ? <p className="text-xs text-[#ffb1b1]">{errors.relationship}</p> : null}
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#181621] p-3 text-sm text-[#d9d2ef]">
            <input
              type="checkbox"
              checked={state.customerInfo.rememberInfo}
              onChange={(event) => updateCustomerInfo('rememberInfo', event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#b47dff]"
              aria-label="บันทึกข้อมูลไว้สำหรับการจองครั้งต่อไป"
            />
            <span>บันทึกข้อมูลไว้สำหรับการจองครั้งต่อไป</span>
          </label>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-6 pb-24">
          {packageGroups.map((group) => (
            <div key={group.id}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">{group.title}</h2>
                  <p className="text-[11px] text-[#b6b2c7]">
                    {group.selectionMode === 'single' ? 'เลือกได้เพียง 1 รายการ' : 'เลือกได้หลายรายการ'}
                  </p>
                </div>
                {group.selectionMode === 'multiple' ? (
                  <button
                    type="button"
                    onClick={() => setActiveMultiGroup((previous) => (previous === group.id ? null : group.id))}
                    className="rounded-full border border-[#b58dff] bg-[#201a30] px-3 py-1.5 text-[11px] font-medium text-[#efdcff]"
                  >
                    {group.id === activeMultiGroup ? 'X' : 'เลือก'}
                  </button>
                ) : null}
              </div>

              {group.selectionMode === 'multiple' && group.id === activeMultiGroup ? (
                <div className="mb-3 flex items-center justify-between rounded-2xl border border-[#a77dff]/40 bg-[#201a30] px-3 py-2 text-sm text-[#f2eaff]">
                  <span>เลือก</span>
                  <button type="button" aria-label="ปิดโหมดเลือกหลายรายการ" onClick={() => setActiveMultiGroup(null)}>
                    <X size={16} />
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {group.items.map((pkg) => renderPackageCard(pkg, group))}
              </div>
            </div>
          ))}

          {errors.selectedPackages ? <p className="text-xs text-[#ffb1b1]">{errors.selectedPackages}</p> : null}
        </div>
      )
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-semibold text-white">เลือกวันที่</h2>
            <div className="grid grid-cols-2 gap-2">
              {upcomingDates.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setSelectedDate(day.value)}
                  className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                    state.selectedDate === day.value
                      ? 'border-[#b689ff] bg-[#251d3a] text-white'
                      : 'border-white/10 bg-[#171521] text-[#dfe5ff]'
                  }`}
                >
                  <div className="text-xs text-[#b5b0c7]">{day.label}</div>
                  <div className="mt-1 font-medium">{day.compactLabel}</div>
                </button>
              ))}
            </div>
            {errors.selectedDate ? <p className="mt-2 text-xs text-[#ffb1b1]">{errors.selectedDate}</p> : null}
          </div>

          <div>
            <h2 className="mb-3 text-base font-semibold text-white">เลือกเวลา</h2>
            {selectedPackageIds.includes('phone-unlimited') ? (
              <div className="mb-3 rounded-2xl border border-[#f7d8a1]/40 bg-[#201d1a] px-3 py-2 text-xs text-[#f8d9a8]">
                แพ็กเกจนี้จองได้เฉพาะรอบเวลา 22:30 น.
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              {availableTimeSlots.map((slot) => {
                const isSelected = state.selectedTime === slot.label
                const isDisabled = slot.status === 'full' || slot.status === 'closed'

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedTime(slot.label)}
                    className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                      isDisabled
                        ? 'cursor-not-allowed border-white/5 bg-[#14131b] text-[#646277]'
                        : isSelected
                          ? 'border-[#a77dff] bg-[#261d35] text-white'
                          : 'border-white/10 bg-[#171521] text-[#e7e2f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{slot.label}</span>
                      <span className="text-[10px]">
                        {slot.status === 'available' ? '✓ ว่าง' : slot.status === 'full' ? '× เต็ม' : '🔒 ปิด'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            {errors.selectedTime ? <p className="mt-2 text-xs text-[#ffb1b1]">{errors.selectedTime}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium text-[#e7e2f5]">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              id="note"
              value={state.note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="มีอะไรที่อยากบอก Witchyu เพิ่มเติมไหม?"
              maxLength={250}
              className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-[#171521] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ad85ff]"
              aria-label="หมายเหตุเพิ่มเติม"
            />
            <div className="flex items-center justify-between text-[11px] text-[#b6b2c7]">
              <span>จำกัด 250 ตัวอักษร</span>
              <span>{state.note.length}/250</span>
            </div>
            {errors.note ? <p className="text-xs text-[#ffb1b1]">{errors.note}</p> : null}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#171521] p-4">
          <h2 className="mb-4 text-base font-semibold text-white">ข้อมูลผู้จอง</h2>
          <div className="space-y-2 text-sm text-[#e8e1f9]">
            <div className="flex justify-between gap-3"><span>ชื่อ:</span><span className="text-right text-white">{state.customerInfo.fullName}</span></div>
            <div className="flex justify-between gap-3"><span>ชื่อเล่น:</span><span className="text-right text-white">{state.customerInfo.nickname}</span></div>
            <div className="flex justify-between gap-3"><span>อายุ:</span><span className="text-right text-white">{state.customerInfo.age}</span></div>
            <div className="flex justify-between gap-3"><span>สถานะความสัมพันธ์:</span><span className="text-right text-white">{relationshipOptions.find((item) => item.value === state.customerInfo.relationship)?.label}</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171521] p-4">
          <h2 className="mb-4 text-base font-semibold text-white">แพ็กเกจ</h2>
          <div className="space-y-3">
            {state.selectedPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#201d2d] p-3">
                <div>
                  <p className="text-sm font-medium text-white">{pkg.name}</p>
                  <p className="text-[11px] text-[#b8b3c5]">{pkg.category}</p>
                </div>
                <span className="text-sm font-semibold text-[#fff2b5]">{formatCurrency(pkg.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171521] p-4">
          <h2 className="mb-4 text-base font-semibold text-white">วันและเวลา</h2>
          <div className="space-y-2 text-sm text-[#e8e1f9]">
            <div className="flex justify-between gap-3"><span>วัน:</span><span className="text-right text-white">{state.selectedDate}</span></div>
            <div className="flex justify-between gap-3"><span>เวลา:</span><span className="text-right text-white">{state.selectedTime}</span></div>
            <div className="flex justify-between gap-3"><span>หมายเหตุ:</span><span className="max-w-[180px] text-right text-white">{state.note || '—'}</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#a77dff]/30 bg-[#1d1730] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-semibold text-white">รวมทั้งหมด</span>
            <span className="text-xl font-semibold text-[#f7d69d]">{formatCurrency(state.totalPrice)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-6 pt-5">
      <div className="mb-5 flex items-center justify-between">
        {currentStep > 1 ? (
          <button type="button" onClick={goBack} className="inline-flex items-center gap-2 text-sm text-[#d9cbff]" aria-label="ย้อนกลับ">
            <ChevronLeft size={18} />
            ย้อนกลับ
          </button>
        ) : (
          <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm text-[#d9cbff]" aria-label="กลับหน้าหลัก">
            <ArrowLeft size={18} />
            กลับ
          </button>
        )}

        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <MoonStar size={16} className="text-[#e9d7ff]" />
          <span>จองคิว</span>
        </div>

        <div className="w-12" />
      </div>

      {renderStepIndicator()}

      {currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4 ? renderContent() : null}

      <div className="mt-6 flex items-center gap-3">
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#bb8bff] via-[#9d6df7] to-[#7a5af7] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(140,98,255,0.45)]"
          >
            ดำเนินการต่อ
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9c6dff] via-[#8d5ff0] to-[#6f57de] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(126,97,220,0.35)]"
          >
            ยืนยันการจองคิว
          </button>
        )}
      </div>

      {selectedMultiplePackages.length > 0 ? (
        <div className="safe-area-bottom fixed bottom-[68px] left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-[#8e6fe6]/50 bg-[#1b1826]/95 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#d1bcff]">เลือกแล้ว</div>
            <div className="mt-1 text-sm font-medium text-white">
              {selectedMultiplePackages.length} รายการ
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#d1bcff]">รวม</div>
            <div className="mt-1 text-sm font-semibold text-[#fff2b5]">{formatCurrency(state.totalPrice)}</div>
          </div>
          <button
            type="button"
            onClick={() => setActiveMultiGroup(null)}
            className="rounded-xl bg-[#f6d9ff] px-3 py-2 text-xs font-semibold text-[#120d1a]"
          >
            ดำเนินการต่อ
          </button>
        </div>
      ) : null}

      {detailPackage ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 p-3 md:items-center md:justify-center" onClick={() => setDetailPackageId(null)}>
          <div className="w-full max-w-[440px] rounded-t-[28px] bg-[#171521] p-5 md:rounded-[28px]" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#d7c0ff]" />
                <h3 className="text-lg font-semibold text-white">{detailPackage.name}</h3>
              </div>
              <button type="button" aria-label="ปิดรายละเอียดแพ็กเกจ" onClick={() => setDetailPackageId(null)}>
                <X size={20} className="text-[#f0ebff]" />
              </button>
            </div>
            <ul className="space-y-2 text-sm text-[#ddd7ee]">
              {detailPackage.questions?.map((question) => (
                <li key={question.id} className="flex gap-2 rounded-xl bg-[#201d2e] p-2">
                  <span className="mt-1 text-[#c296ff]">•</span>
                  <span>{question.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {Object.keys(errors).length > 0 ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#ffb1b1]/30 bg-[#2b1a1a] p-3 text-xs text-[#ffd4d4]">
          <AlertCircle size={16} className="mt-0.5" />
          <span>กรุณาตรวจสอบข้อมูลก่อนดำเนินการต่อ</span>
        </div>
      ) : null}
    </div>
  )
}
