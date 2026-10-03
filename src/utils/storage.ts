import type { CustomerInfo } from '../types/booking'

const STORAGE_KEY = 'witchyu-customer-info-v1'

export const saveCustomerInfo = (customerInfo: CustomerInfo): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customerInfo))
}

export const loadCustomerInfo = (): CustomerInfo | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedData = window.localStorage.getItem(STORAGE_KEY)

  if (!storedData) {
    return null
  }

  try {
    return JSON.parse(storedData) as CustomerInfo
  } catch {
    return null
  }
}

export const clearCustomerInfo = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}
