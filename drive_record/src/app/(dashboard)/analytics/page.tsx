'use client';

import AnalyticsChart from '@/components/features/AnalyticsChart';
import { useRecordStore } from '@/store/useRecordStore';

export default function AnalyticsPage() {
  const records = useRecordStore((state) => state.records);
  
  // คำนวณยอดรวมทั้งหมดตลอดกาล
  const grandTotal = records.reduce((sum, r) => sum + r.income, 0);

  return (
    <div className="p-4 space-y-6 pt-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ภาพรวมสถิติ</h1>
        <p className="text-sm text-gray-500">วิเคราะห์ผลงานการวิ่งงานของคุณ</p>
      </div>

      {/* กราฟ */}
      <AnalyticsChart />

      {/* สรุปตัวเลขรวม */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-indigo-100 text-sm">รายได้รวมทั้งหมดที่เคยจด</p>
        <h2 className="text-3xl font-bold">฿{grandTotal.toLocaleString()}</h2>
      </div>

      <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
        <h3 className="font-bold mb-2">คำแนะนำ</h3>
        <p className="text-sm text-gray-500">
          วันไหนที่มีรายได้สูงสุด คุณลองสังเกตดูว่าวิ่งช่วงเวลาไหน หรือแถวไหนเป็นพิเศษ 
          จะช่วยให้คุณวางแผนการวิ่งรอบหน้าให้ได้เงินมากขึ้นครับ!
        </p>
      </div>
    </div>
  );
}