'use client';

import { useRecordStore } from '@/store/useRecordStore';

export default function DashboardPage() {
  // ดึงข้อมูลรายการทั้งหมดจาก Zustand
  const records = useRecordStore((state) => state.records);

  // 🧮 ระบบคำนวณอัตโนมัติ
  const totalIncome = records.reduce((sum, record) => sum + record.income, 0);
  const totalFuel = records.reduce((sum, record) => sum + (record.fuelAmount || 0), 0);
  
  // หักค่าเสื่อม 10% จากรายรับ
  const depreciation = totalIncome * 0.10; 
  
  // กำไรสุทธิ = รายรับ - ค่าน้ำมัน - ค่าเสื่อม
  const netProfit = totalIncome - totalFuel - depreciation;

  return (
    <div className="p-4 space-y-6 pt-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ภาพรวมวันนี้</h1>
          <p className="text-sm text-gray-500">สรุปยอดรวมประจำวัน</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-gray-400 uppercase">จำนวนงาน</span>
          <p className="text-xl font-bold text-blue-600">{records.length} <span className="text-sm text-gray-500 font-normal">รอบ</span></p>
        </div>
      </div>

      {/* การ์ดสรุปยอด */}
      <div className="grid grid-cols-2 gap-4">
        {/* รายรับ */}
        <div className="col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
          <p className="text-blue-100 text-sm font-medium mb-1">กำไรสุทธิ (หักทุกอย่างแล้ว)</p>
          <h2 className="text-4xl font-bold">฿{netProfit.toLocaleString()}</h2>
        </div>

        {/* รายละเอียด */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1">ยอดเงินเข้า (รายรับ)</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">฿{totalIncome.toLocaleString()}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1">ค่าน้ำมันรวม</p>
          <h3 className="text-xl font-bold text-red-500">฿{totalFuel.toLocaleString()}</h3>
        </div>

        <div className="col-span-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-xs font-medium mb-1">หักค่าเสื่อมสภาพรถ (10%)</p>
            <p className="text-[10px] text-orange-400">หักอัตโนมัติจากรายรับเพื่อเป็นเงินออมซ่อมรถ</p>
          </div>
          <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400">- ฿{depreciation.toLocaleString()}</h3>
        </div>
      </div>

      {/* รายการล่าสุด */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">รายการล่าสุด</h3>
        {records.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
            <p className="text-gray-400">ยังไม่มีข้อมูลการวิ่งงาน</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div>
                  <p className="font-bold uppercase text-sm text-gray-700 dark:text-gray-300">{record.platform}</p>
                  {record.note && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">{record.note}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+฿{record.income}</p>
                  {record.hasFuel && <p className="text-xs text-red-500">-฿{record.fuelAmount} (น้ำมัน)</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}