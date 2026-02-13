export const TH = {
  // Auth
  LOGIN: {
    TITLE: 'เข้าสู่ระบบ',
    EMAIL: 'อีเมล',
    PASSWORD: 'รหัสผ่าน',
    SUBMIT: 'เข้าสู่ระบบ',
    SUCCESS: 'เข้าสู่ระบบสำเร็จ!',
    ERROR_INVALID: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    ERROR_GENERIC: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
  },
  
  // Dashboard
  DASHBOARD: {
    TITLE: 'ภาพรวม',
    OVERVIEW: 'ภาพรวมระบบ',
    TOTAL_ITEMS: 'สินค้าทั้งหมด',
    TOTAL_QUANTITY: 'จำนวนรวม',
    LOW_STOCK: 'สินค้าใกล้หมด',
    RECENT_TRANSACTIONS: 'รายการล่าสุด',
  },

  // Inventory
  INVENTORY: {
    TITLE: 'คลังสินค้า',
    SEARCH: 'ค้นหาสินค้า...',
    ADD_ITEM: 'เพิ่มสินค้า',
    EDIT_ITEM: 'แก้ไข',
    DELETE_ITEM: 'ลบ',
    CONFIRM_DELETE: 'คุณแน่ใจหรือไม่ว่าจะลบสินค้านี้?',
    NAME: 'ชื่อสินค้า',
    CATEGORY: 'หมวดหมู่',
    QUANTITY: 'จำนวน',
    MIN_QUANTITY: 'ขั้นต่ำ',
    UNIT: 'ชิ้น',
  },

  // Transactions
  TRANSACTION: {
    TITLE: 'เบิก-รับสินค้า',
    RECEIVE: 'รับเข้า',
    WITHDRAW: 'เบิกออก',
    RECEIVE_TITLE: 'รับสินค้าเข้าคลัง',
    WITHDRAW_TITLE: 'เบิกสินค้าออก',
    SELECT_ITEM: 'เลือกสินค้า',
    AMOUNT: 'จำนวน',
    NOTE: 'หมายเหตุ',
    NOTE_OPTIONAL: 'หมายเหตุ (ไม่บังคับ)',
    SUBMIT_RECEIVE: 'รับเข้าคลัง',
    SUBMIT_WITHDRAW: 'เบิกออก',
    HISTORY: 'ประวัติ',
    DATE: 'วันที่',
    TYPE: 'ประเภทรายการ',
    ACTION: 'รายการ',
    USER: 'ผู้ทำรายการ',
  },

  // Settings
  SETTINGS: {
    TITLE: 'ตั้งค่า',
    PROFILE: 'โปรไฟล์',
    LOGOUT: 'ออกจากระบบ',
    ABOUT: 'เกี่ยวกับแอป',
  },
  
  // Common
  COMMON: {
    LOADING: 'กำลังโหลด...',
    SUCCESS: 'ทำรายการสำเร็จ',
    ERROR: 'เกิดข้อผิดพลาด',
    CANCEL: 'ยกเลิก',
    CONFIRM: 'ยืนยัน',
  }
} as const;
