import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { allPackages, customQuestionPricing } from '../data/packages'
import type { BookingItem, BookingState, CustomerInfo, Package, PaymentStatus } from '../types/booking'
import { buildBookingId, calculateTotalPrice } from '../utils/booking'
import { clearCustomerInfo, loadCustomerInfo, saveCustomerInfo } from '../utils/storage'

const createBookingItem = (pkg: Package): BookingItem => ({
  id: pkg.id,
  name: pkg.name,
  price: pkg.price,
  description: pkg.description,
  category: pkg.category,
  selectionMode: pkg.selectionMode,
  note: pkg.note,
})

const defaultCustomerInfo: CustomerInfo = {
  nickname: '',
  fullName: '',
  age: '',
  relationship: '',
  rememberInfo: false,
}

const initialState: BookingState = {
  customerInfo: defaultCustomerInfo,
  selectedPackages: [],
  selectedDate: '',
  selectedTime: '',
  note: '',
  totalPrice: 0,
  bookingId: '',
  paymentStatus: 'pending',
}

interface BookingContextValue {
  state: BookingState
  updateCustomerInfo: <K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => void
  setSelectedPackages: (packages: BookingItem[]) => void
  togglePackageSelection: (pkg: Package) => void
  setSelectedDate: (date: string) => void
  setSelectedTime: (time: string) => void
  setNote: (note: string) => void
  setPaymentStatus: (status: PaymentStatus) => void
  setBookingId: (id: string) => void
  resetBooking: () => void
  getSelectedPackageIds: () => string[]
  getCustomQuestionCount: () => number
  setCustomQuestionCount: (count: number) => void
  getPackageById: (id: string) => Package | undefined
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const BookingProvider = ({ children }: Props) => {
  const [state, setState] = useState<BookingState>(initialState)

  useEffect(() => {
    const savedCustomerInfo = loadCustomerInfo()

    if (savedCustomerInfo) {
      setState((previous) => ({
        ...previous,
        customerInfo: savedCustomerInfo,
      }))
    }
  }, [])

  useEffect(() => {
    if (state.customerInfo.rememberInfo) {
      saveCustomerInfo(state.customerInfo)
    } else {
      clearCustomerInfo()
    }
  }, [state.customerInfo])

  const updateCustomerInfo = useCallback(
    <K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => {
      setState((previous) => ({
        ...previous,
        customerInfo: {
          ...previous.customerInfo,
          [field]: value,
        },
      }))
    },
    [],
  )

  const setSelectedPackages = useCallback((packages: BookingItem[]) => {
    setState((previous) => ({
      ...previous,
      selectedPackages: packages,
      totalPrice: calculateTotalPrice(packages),
    }))
  }, [])

  const getCustomQuestionCount = useCallback(() => {
    const customSelection = state.selectedPackages.find((item) => item.id === 'custom-question')
    return customSelection?.questionCount ?? 1
  }, [state.selectedPackages])

  const setCustomQuestionCount = useCallback((count: number) => {
    const normalizedCount = Math.max(1, Number.isFinite(count) ? count : 1)

    setState((previous) => {
      const nextPackages = previous.selectedPackages.filter((item) => item.id !== 'custom-question')
      const nextCustomItem: BookingItem = {
        ...createBookingItem(
          allPackages.find((pkg) => pkg.id === 'custom-question') ?? allPackages[0],
        ),
        price: normalizedCount * customQuestionPricing.pricePerQuestion,
        questionCount: normalizedCount,
      }

      const updatedPackages = [...nextPackages, nextCustomItem]

      return {
        ...previous,
        selectedPackages: updatedPackages,
        totalPrice: calculateTotalPrice(updatedPackages),
      }
    })
  }, [])

  const togglePackageSelection = useCallback((pkg: Package) => {
    setState((previous) => {
      const packageItem = createBookingItem(pkg)
      const selectedPackagesByGroup = previous.selectedPackages.filter(
        (item) => item.category === pkg.category,
      )

      let nextSelectedPackages: BookingItem[]

      if (pkg.selectionMode === 'single') {
        const alreadySelected = selectedPackagesByGroup.some((item) => item.id === pkg.id)

        nextSelectedPackages = alreadySelected
          ? previous.selectedPackages.filter((item) => item.category !== pkg.category)
          : [...previous.selectedPackages.filter((item) => item.category !== pkg.category), packageItem]
      } else {
        const alreadySelected = previous.selectedPackages.some((item) => item.id === pkg.id)

        nextSelectedPackages = alreadySelected
          ? previous.selectedPackages.filter((item) => item.id !== pkg.id)
          : [...previous.selectedPackages, packageItem]
      }

      return {
        ...previous,
        selectedPackages: nextSelectedPackages,
        totalPrice: calculateTotalPrice(nextSelectedPackages),
      }
    })
  }, [])

  const setSelectedDate = useCallback((date: string) => {
    setState((previous) => ({ ...previous, selectedDate: date }))
  }, [])

  const setSelectedTime = useCallback((time: string) => {
    setState((previous) => ({ ...previous, selectedTime: time }))
  }, [])

  const setNote = useCallback((note: string) => {
    setState((previous) => ({ ...previous, note }))
  }, [])

  const setPaymentStatus = useCallback((status: PaymentStatus) => {
    setState((previous) => ({ ...previous, paymentStatus: status }))
  }, [])

  const setBookingId = useCallback((id: string) => {
    setState((previous) => ({ ...previous, bookingId: id }))
  }, [])

  const resetBooking = useCallback(() => {
    setState({
      ...initialState,
      customerInfo: {
        ...defaultCustomerInfo,
        rememberInfo: state.customerInfo.rememberInfo,
      },
      bookingId: buildBookingId(),
    })
  }, [state.customerInfo.rememberInfo])

  const getSelectedPackageIds = useCallback(
    () => state.selectedPackages.map((item) => item.id),
    [state.selectedPackages],
  )

  const getPackageById = useCallback(
    (packageId: string) => allPackages.find((pkg) => pkg.id === packageId),
    [],
  )

  const value = useMemo<BookingContextValue>(
    () => ({
      state,
      updateCustomerInfo,
      setSelectedPackages,
      togglePackageSelection,
      setSelectedDate,
      setSelectedTime,
      setNote,
      setPaymentStatus,
      setBookingId,
      resetBooking,
      getSelectedPackageIds,
      getCustomQuestionCount,
      setCustomQuestionCount,
      getPackageById,
    }),
    [state, updateCustomerInfo, setSelectedPackages, togglePackageSelection, setSelectedDate, setSelectedTime, setNote, setPaymentStatus, setBookingId, resetBooking, getSelectedPackageIds, getCustomQuestionCount, setCustomQuestionCount, getPackageById],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = (): BookingContextValue => {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }

  return context
}
