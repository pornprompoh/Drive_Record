'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ChartColumn, Plus, History, User } from 'lucide-react';

export default function BottomNavbar() {
  const pathname = usePathname();

  // กำหนดรายการเมนู (ยกเว้นปุ่มตรงกลาง)
  const navItems = [
    { name: 'แดชบอร์ด', href: '/', icon: LayoutDashboard },
    { name: 'สถิติ', href: '/analytics', icon: ChartColumn },
    // ปุ่ม + (บันทึก) จะถูกแทรกไว้ตรงกลาง
    { name: 'ประวัติ', href: '/history', icon: History },
    { name: 'โปรไฟล์', href: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-zinc-950 dark:border-zinc-800 pb-safe">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        
        {/* เมนูที่ 1 และ 2 (ซ้าย) */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-zinc-900 group ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}

        {/* ปุ่มตรงกลาง (Action Button) - เพิ่มรายการ */}
        <div className="relative flex items-center justify-center">
          <Link
            href="/add-record"
            className="absolute flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg shadow-blue-500/30 transform -translate-y-4 transition-transform active:scale-95"
          >
            <Plus className="w-8 h-8 stroke-[2.5]" />
          </Link>
        </div>

        {/* เมนูที่ 3 และ 4 (ขวา) */}
        {navItems.slice(2, 4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-zinc-900 group ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
        
      </div>
    </div>
  );
}