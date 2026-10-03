# Witchyu Booking App

โปรเจกต์นี้คือแอปจองคิวดูดวงแบบ Mobile-First สำหรับ Phase 1 โดยใช้ React + TypeScript + Vite + Tailwind CSS

## 1. โปรเจกต์นี้คืออะไร

Witchyu เป็น Frontend Demo สำหรับระบบจองคิวดูดวงที่ออกแบบให้ใช้งานบนมือถือ เช่น iPhone / iPad / Desktop แบบ Mobile App Container

ฟีเจอร์ที่ทำใน Phase 1:

- หน้า Home
- Navigation แบบ Bottom Tab
- ระบบจองคิวแบบ Step-by-Step
- Validation ของข้อมูลผู้จอง
- Package Selection แบบ Single / Multiple
- Modal รายละเอียดแพ็กเกจ
- Date / Time Picker พร้อม Mock Availability
- Note / Summary / Demo Payment
- Success Page
- LocalStorage สำหรับบันทึกข้อมูลผู้จอง

## 2. วิธีเปิด GitHub Codespaces

1. เปิด Repository บน GitHub
2. คลิกปุ่ม Code
3. เลือก Codespaces
4. สร้างหรือเปิด Workspace ใหม่
5. รอให้ Dev Container เริ่มต้นและติดตั้ง dependencies

## 3. วิธีติดตั้ง

```bash
npm install
```

## 4. วิธี Run

```bash
npm run dev
```

## 5. วิธีเปิด Preview ใน Codespaces

บน Codespaces สามารถเปิด Preview ผ่าน Ports tab หรือใช้ port forwarding ของ Vite

- URL ปกติ: http://localhost:5173
- หากใช้ Codespaces ให้เปิด forwarded port จาก VS Code

## 6. วิธีทดสอบบน iPad

1. เปิด Codespaces จากเบราว์เซอร์
2. เปิด Port Forwarding สำหรับ 5173
3. เปิด URL ที่ได้จาก Codespaces ใน Safari / Google Chrome
4. ปรับเป็น Mobile View หรือใช้ iPad Simulator / real device
5. ตรวจสอบว่าไม่มี Horizontal Scroll และ navigation ทำงาน

## 7. โครงสร้างไฟล์

```bash
src/
  components/
  context/
  data/
  pages/
  types/
  utils/
  App.tsx
  main.tsx
  index.css
```

## 8. สิ่งที่ทำเสร็จใน Phase 1

- UI หลักแบบ Mobile App
- หน้า Home / Booking / Payment / Success
- Step-by-step flow ของการจอง
- Validation และ localStorage
- Package Selection แบบ single + multiple
- Mock availability สำหรับวันที่และเวลา
- Theme Mystic / Moon / Star
- Responsive layout สำหรับ mobile และ tablet

## 9. สิ่งที่จะทำใน Phase 2

- Payment Gateway จริง
- PromptPay / QR Payment
- Admin Dashboard
- Database / Backend
- Real-time Chat
- Video / Voice / WebRTC
- Authentication / Account system
- Production data model และ API integration

## 10. คำสั่งที่ใช้

```bash
npm install
npm run dev
npm run build
```
