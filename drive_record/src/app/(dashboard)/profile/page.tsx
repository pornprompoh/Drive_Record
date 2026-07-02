'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Car } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>('กำลังโหลด...');

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? 'ไม่พบอีเมล');
      } else {
        // ถ้าไม่มีใครล็อกอินอยู่ ให้เด้งกลับไปหน้า Login
        router.push('/login');
      }
    };
    getUser();
  }, [router]);

  // ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="p-4 space-y-6 pt-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">โปรไฟล์</h1>
        <p className="text-sm text-gray-500">จัดการบัญชีและการตั้งค่า</p>
      </div>

      {/* บัญชีผู้ใช้ */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
          <User className="w-8 h-8" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-gray-500 mb-1">บัญชีผู้ใช้ปัจจุบัน</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {userEmail}
          </p>
        </div>
      </div>

      {/* เมนูตั้งค่า (เผื่อฟีเจอร์ในอนาคต) */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3 text-gray-700 dark:text-gray-300 opacity-50 cursor-not-allowed">
          <Car className="w-5 h-5" />
          <span>ข้อมูลรถของฉัน (เร็วๆ นี้)</span>
        </div>
        <div className="p-4 flex items-center gap-3 text-gray-700 dark:text-gray-300 opacity-50 cursor-not-allowed">
          <Settings className="w-5 h-5" />
          <span>ตั้งค่าแอปพลิเคชัน (เร็วๆ นี้)</span>
        </div>
      </div>

      {/* ปุ่ม Logout */}
      <Button 
        onClick={handleLogout}
        variant="destructive" 
        className="w-full h-14 rounded-2xl text-lg font-bold flex gap-2"
      >
        <LogOut className="w-5 h-5" />
        ออกจากระบบ
      </Button>
    </div>
  );
}