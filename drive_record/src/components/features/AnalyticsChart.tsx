'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useRecordStore } from '@/store/useRecordStore';
import dayjs from 'dayjs';

export default function AnalyticsChart() {
  const records = useRecordStore((state) => state.records);

  // 1. นำข้อมูลมาจัดกลุ่มตามวันที่ และรวมรายรับ
  const data = records.reduce((acc: any[], record) => {
    const date = dayjs(record.createdAt).format('DD/MM');
    const existing = acc.find((item) => item.date === date);
    
    if (existing) {
      existing.income += record.income;
    } else {
      acc.push({ date, income: record.income });
    }
    return acc;
  }, []).slice(-7); // เอาแค่ 7 วันล่าสุด

  return (
    <div className="h-[250px] w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <h3 className="text-sm font-bold text-gray-500 mb-4">รายได้ 7 วันล่าสุด</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value}`} />
          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px' }} />
          <Bar dataKey="income" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#2563eb' : '#93c5fd'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}