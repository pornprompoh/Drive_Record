import { create } from 'zustand';
import { supabase } from '@/lib/supabase'; // นำเข้าตัวเชื่อมต่อฐานข้อมูล

export type RecordItem = {
  id: string;
  platform: string;
  income: number;
  hasFuel: boolean;
  fuelAmount?: number;
  note?: string;
  createdAt: string;
};

interface RecordState {
  records: RecordItem[];
  addRecord: (record: Omit<RecordItem, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => Promise<void>; // เปลี่ยนเป็น Promise เพราะต้องรอฐานข้อมูล
  fetchRecords: () => Promise<void>; // เพิ่มฟังก์ชันโหลดข้อมูล
}

export const useRecordStore = create<RecordState>((set) => ({
  records: [],
  
  // 📥 ฟังก์ชันโหลดข้อมูลจาก Supabase
  fetchRecords: async () => {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('created_at', { ascending: false }); // เรียงจากรายการล่าสุดขึ้นก่อน

    if (error) {
      console.error('โหลดข้อมูลพลาด:', error.message);
      return;
    }

    if (data) {
      // แปลงชื่อคอลัมน์จากฐานข้อมูล (snake_case) ให้ตรงกับโค้ดเรา (camelCase)
      const formattedData: RecordItem[] = data.map((item) => ({
        id: item.id,
        platform: item.platform,
        income: item.income,
        hasFuel: item.has_fuel,
        fuelAmount: item.fuel_amount,
        note: item.note,
        createdAt: item.created_at,
      }));
      
      set({ records: formattedData });
    }
  },

  // ➕ ฟังก์ชันเพิ่มข้อมูล (ใช้หน้าจอหลอกไปก่อน ส่วนการบันทึกจริงเราทำไว้ที่ไฟล์ฟอร์มแล้ว)
  addRecord: (record) => set((state) => ({
    records: [
      {
        ...record,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...state.records,
    ]
  })),

  // 🗑️ ฟังก์ชันลบข้อมูล
  deleteRecord: async (id) => {
    // 1. ลบออกจากหน้าจอผู้ใช้ทันที (Optimistic UI) ให้แอปรู้สึกเร็ว
    set((state) => ({
      records: state.records.filter((record) => record.id !== id)
    }));
    
    // 2. ส่งคำสั่งไปลบที่ฐานข้อมูลจริงๆ
    const { error } = await supabase.from('records').delete().eq('id', id);
    
    if (error) {
      console.error('ลบข้อมูลพลาด:', error.message);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล โปรดรีเฟรชหน้าจอ');
    }
  },
}));