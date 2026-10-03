export type RelationshipStatus =
  | 'single'
  | 'dating'
  | 'in_relationship'
  | 'married'
  | 'separated'
  | 'other'
  | 'not_specified'

export type SelectionMode = 'single' | 'multiple'
export type TimeSlotStatus = 'available' | 'full' | 'closed'
export type PaymentStatus = 'pending' | 'demo-success'

export interface CustomerInfo {
  nickname: string
  fullName: string
  age: string
  relationship: RelationshipStatus | ''
  rememberInfo: boolean
}

export interface PackageQuestion {
  id: string
  text: string
}

export interface Package {
  id: string
  name: string
  price: number
  description: string
  category: string
  selectionMode: SelectionMode
  note?: string
  questions?: PackageQuestion[]
}

export interface PackageGroup {
  id: string
  title: string
  selectionMode: SelectionMode
  items: Package[]
}

export interface BookingItem {
  id: string
  name: string
  price: number
  description: string
  category: string
  selectionMode: SelectionMode
  note?: string
  quantity?: number
  questionCount?: number
}

export interface TimeSlot {
  id: string
  label: string
  status: TimeSlotStatus
}

export interface BookingState {
  customerInfo: CustomerInfo
  selectedPackages: BookingItem[]
  selectedDate: string
  selectedTime: string
  note: string
  totalPrice: number
  bookingId: string
  paymentStatus: PaymentStatus
}

export interface ValidationErrors {
  [key: string]: string
}
