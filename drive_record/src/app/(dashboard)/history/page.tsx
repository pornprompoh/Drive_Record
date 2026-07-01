'use client';

import { useRecordStore } from '@/store/useRecordStore';
import { Trash2, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/th'; // นำเข้าภาษาไทยสำหรับวันที่

export default function HistoryPage() {
  // ดึง state และ ฟังก์ชันลบ มาจาก Zustand
  const records = useRecordStore((state) => state.records);
  const deleteRecord = useRecordStore((state) => state.deleteRecord);

  // ฟังก์ชันกดปุ่มลบ
  const handleDelete = (id: string) => {
    // มี Alert ถามเพื่อป้องกันการเผลอกดโดน
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      deleteRecord(id);
    }
  };

  return (
    <div className="p-4 space-y-4 pt-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ประวัติการวิ่งงาน</h1>
        <p className="text-sm text-gray-500">จัดการรายการรายรับ-รายจ่ายของคุณ</p>
      </div>

      {records.length === 0 ? (
        // กรณีไม่มีข้อมูล
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">ยังไม่มีประวัติการจดบันทึก</p>
          <p className="text-xs text-gray-400 mt-1">กดปุ่ม + ด้านล่างเพื่อเริ่มบันทึก</p>
        </div>
      ) : (
        // กรณีมีข้อมูล (ลูปแสดงผลรายการทั้งหมด)
        <div className="space-y-3">
          {records.map((record) => (
            <div 
              key={record.id} 
              className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex justify-between items-start"
            >
              <div className="flex-1">
                {/* แพลตฟอร์ม & เวลา */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${record.platform === 'grab' ? 'bg-green-100 text-green-700' :
                      record.platform === 'bolt' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-emerald-100 text-emerald-700'}`}>
                    {record.platform}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {dayjs(record.createdAt).locale('th').format('DD MMM YYYY • HH:mm น.')}
                  </span>
                </div>

                {/* ตัวเลขรายรับ/น้ำมัน */}
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">รายรับ</p>
                    <p className="font-bold text-green-600 leading-none">+฿{record.income}</p>
                  </div>
                  {record.hasFuel && (
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">ค่าน้ำมัน</p>
                      <p className="font-bold text-red-500 leading-none">-฿{record.fuelAmount}</p>
                    </div>
                  )}
                </div>

                {/* โน้ตเพิ่มเติม */}
                {record.note && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg inline-block border border-gray-100 dark:border-zinc-700">
                    📝 {record.note}
                  </p>
                )}
              </div>

              {/* ปุ่มลบ */}
              <button
                onClick={() => handleDelete(record.id)}
                className="p-2 ml-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors active:scale-95"
                aria-label="ลบรายการ"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}