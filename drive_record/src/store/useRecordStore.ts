import { create } from 'zustand';

// 1. กำหนดรูปร่างของข้อมูล 1 รายการ
export type RecordItem = {
  id: string;
  platform: string;
  income: number;
  hasFuel: boolean;
  fuelAmount?: number;
  note?: string;
  createdAt: string;
};

// 2. กำหนดว่าใน Store นี้มีข้อมูลและฟังก์ชันอะไรบ้าง
interface RecordState {
  records: RecordItem[];
  addRecord: (record: Omit<RecordItem, 'id' | 'createdAt'>) => void;
}

// 3. สร้าง Store
export const useRecordStore = create<RecordState>((set) => ({
  records: [], // เริ่มต้นด้วยอาร์เรย์ว่างๆ
  
  // ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่
  addRecord: (record) => set((state) => ({
    records: [
      {
        ...record,
        id: crypto.randomUUID(), // สร้าง ID มั่วๆ ไม่ซ้ำกัน
        createdAt: new Date().toISOString(), // ประทับเวลาปัจจุบัน
      },
      ...state.records, // เอาข้อมูลใหม่ต่อหน้าข้อมูลเก่า (ล่าสุดอยู่บน)
    ]
  })),
  
  deleteRecord: (id) => set((state) => ({
    records: state.records.filter((record) => record.id !== id)
  })),
}));