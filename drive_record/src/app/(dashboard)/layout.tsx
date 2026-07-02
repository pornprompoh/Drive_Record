'use client'; // เพิ่มบรรทัดนี้บนสุด

import { useEffect } from 'react';
import BottomNavbar from '@/components/shared/BottomNavbar';
import { useRecordStore } from '@/store/useRecordStore'; // นำเข้า Store

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ดึงฟังก์ชันโหลดข้อมูลมาใช้
  const fetchRecords = useRecordStore((state) => state.fetchRecords);

  // สั่งให้โหลดข้อมูล 1 ครั้ง ทันทีที่เปิดแอป
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <main className="w-full max-w-lg mx-auto pb-24 min-h-screen bg-white dark:bg-zinc-950 shadow-sm relative">
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
}