import { createBrowserClient } from '@supabase/ssr';

// ดึงค่า URL และ Key จากไฟล์ .env.local ที่เราตั้งไว้
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// สร้างตัวเชื่อมต่อ (Client)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);