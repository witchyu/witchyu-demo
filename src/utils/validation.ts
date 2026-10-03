import type { BookingItem, CustomerInfo, ValidationErrors } from '../types/booking'

export const validateCustomerInfo = (customerInfo: CustomerInfo): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!customerInfo.nickname.trim()) {
    errors.nickname = 'กรุณากรอกชื่อเล่น'
  }

  if (!customerInfo.fullName.trim()) {
    errors.fullName = 'กรุณากรอกชื่อจริง'
  }

  const ageNumber = Number(customerInfo.age)

  if (!customerInfo.age.trim()) {
    errors.age = 'กรุณากรอกอายุ'
  } else if (!Number.isFinite(ageNumber)) {
    errors.age = 'อายุต้องเป็นตัวเลข' 
  } else if (ageNumber < 10 || ageNumber > 99) {
    errors.age = 'อายุควรอยู่ระหว่าง 10–99 ปี'
  }

  if (!customerInfo.relationship) {
    errors.relationship = 'กรุณาเลือกสถานะความสัมพันธ์'
  }

  return errors
}

export const validatePackageSelection = (selectedPackages: BookingItem[]): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!selectedPackages.length) {
    errors.selectedPackages = 'กรุณาเลือกแพ็กเกจ'
  }

  return errors
}

export const validateBookingDateTime = (selectedDate: string, selectedTime: string): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!selectedDate) {
    errors.selectedDate = 'กรุณาเลือกวัน'
  }

  if (!selectedTime) {
    errors.selectedTime = 'กรุณาเลือกเวลา'
  }

  return errors
}

export const validateNote = (note: string, maxLength = 250): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (note.length > maxLength) {
    errors.note = `หมายเหตุต้องไม่เกิน ${maxLength} ตัวอักษร`
  }

  return errors
}
