import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { BookingProvider } from './context/BookingContext'
import { BookingPage } from './pages/BookingPage'
import { BookingSuccessPage } from './pages/BookingSuccessPage'
import { HomePage } from './pages/HomePage'
import { PaymentPage } from './pages/PaymentPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/booking/success" element={<BookingSuccessPage />} />
            <Route
              path="/chat"
              element={<PlaceholderPage title="แชท" description="ระบบแชทจะพร้อมใช้งานใน Phase 2" />}
            />
            <Route
              path="/profile"
              element={<PlaceholderPage title="โปรไฟล์" description="จัดการข้อมูลผู้ใช้และประวัติการจองจะเพิ่มใน Phase 2" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  )
}

export default App
