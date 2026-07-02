'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ฟังก์ชันสมัครสมาชิก
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setErrorMsg(error.message);
    else alert('สมัครสมาชิกสำเร็จ! กรุณาล็อกอินเพื่อใช้งาน');
    
    setIsLoading(false);
  };

  // ฟังก์ชันเข้าสู่ระบบ
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } else {
      router.push('/'); // ล็อกอินสำเร็จให้เด้งไปหน้าแดชบอร์ด
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Drive Record</h1>
          <p className="text-gray-500 text-sm">บันทึกรายได้ง่ายๆ สไตล์คนขับรถ</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">อีเมล</label>
            <Input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-12 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">รหัสผ่าน</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12 rounded-xl"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>}

          <div className="pt-4 space-y-3">
            <Button 
              onClick={handleSignIn} 
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-lg font-bold"
            >
              เข้าสู่ระบบ
            </Button>
            <Button 
              onClick={handleSignUp} 
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              สมัครสมาชิกใหม่
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}