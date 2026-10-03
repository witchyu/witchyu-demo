import type { BookingItem, TimeSlot, TimeSlotStatus } from '../types/booking'

export const formatCurrency = (value: number): string => `${value.toLocaleString('th-TH')} บาท`

export const calculateTotalPrice = (items: BookingItem[]): number =>
  items.reduce((total, item) => total + item.price, 0)

export const buildBookingId = (): string => {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `WITCHYU-${suffix}`
}

const baseTimeSlots = [
  '19:00–19:30',
  '19:30–20:00',
  '20:00–20:30',
  '20:30–21:00',
  '21:30–22:00',
  '22:00–22:30',
  '22:30–23:00',
]

export const getAvailableTimeSlots = (
  selectedPackageIds: string[] = [],
  _date?: string,
): TimeSlot[] => {
  const requiresLateNightOnly = selectedPackageIds.includes('phone-unlimited')

  return baseTimeSlots.map((label, index) => {
    let status: TimeSlotStatus = 'available'

    if (requiresLateNightOnly) {
      status = label === '22:30–23:00' ? 'available' : 'closed'
    } else {
      if (index % 5 === 0) {
        status = 'full'
      }
      if (index % 3 === 0 && index !== 0) {
        status = 'closed'
      }
    }

    return {
      id: `${label}-${index}`,
      label,
      status,
    }
  })
}
