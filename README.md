# ระบบลงทะเบียนหัวหน้ากลุ่มงาน

## วิธีใช้งาน (ทำตามลำดับ)

---

### ขั้นตอนที่ 1 — ตั้งค่า Google Sheet + Apps Script

1. ไปที่ [sheets.google.com](https://sheets.google.com) → สร้าง Spreadsheet ใหม่
2. เมนู **ส่วนขยาย (Extensions)** → **Apps Script**
3. ลบโค้ดเดิมออกทั้งหมด → วางโค้ดจากไฟล์ **`Code.gs`** → บันทึก
4. กด **Deploy** → **New deployment**
   - Type: `Web app`
   - Execute as: `Me`
   - Who has access: **Anyone** ← สำคัญมาก
5. กด **Deploy** → อนุญาต Permission → **คัดลอก URL ที่ได้**

---

### ขั้นตอนที่ 2 — ใส่ URL ในโค้ด

เปิดไฟล์ `src/App.jsx` → หาบรรทัดนี้:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";
```

แทนที่ `YOUR_SCRIPT_ID_HERE` ด้วย URL จาก Step 1 → บันทึก

---

### ขั้นตอนที่ 3 — อัปโหลดขึ้น GitHub

1. ไปที่ [github.com](https://github.com) → สร้าง Repository ใหม่ (ชื่ออะไรก็ได้)
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น GitHub
   - กด **Add file** → **Upload files** → ลาก folder ทั้งหมดขึ้น

---

### ขั้นตอนที่ 4 — Deploy บน Vercel

1. ไปที่ [vercel.com](https://vercel.com) → Sign in ด้วย GitHub
2. กด **Add New Project** → เลือก Repository ที่เพิ่งสร้าง
3. ตั้งค่า:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. กด **Deploy** → รอสักครู่ → ได้ URL ใช้งานได้ทันที!

---

### แก้ไขรายชื่อหน่วยงาน

เปิด `src/App.jsx` → หาส่วน `DEPARTMENTS` → แก้ชื่อและไอคอนได้เลย:

```js
const DEPARTMENTS = [
  { id: "1", name: "ชื่อหน่วยงาน", icon: "🏛️" },
  // เพิ่ม/แก้ไขได้เลย
];
```

---

### โครงสร้างไฟล์

```
dept-app/
├── src/
│   ├── App.jsx       ← โค้ดแอปหลัก (แก้ URL ตรงนี้)
│   └── main.jsx      ← entry point (ไม่ต้องแก้)
├── index.html        ← ไม่ต้องแก้
├── package.json      ← ไม่ต้องแก้
├── vite.config.js    ← ไม่ต้องแก้
├── Code.gs           ← วางใน Google Apps Script
└── README.md         ← คู่มือนี้
```
