'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle2 } from 'lucide-react';
import { useRecordStore } from '@/store/useRecordStore';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 1. กำหนดกฎของข้อมูล (Validation Schema) ด้วย Zod
const formSchema = z.object({
  platform: z.string().min(1, { message: 'กรุณาเลือกแพลตฟอร์ม' }),
  income: z.coerce.number().min(1, { message: 'กรุณากรอกรายรับ' }),
  hasFuel: z.boolean().default(false),
  fuelAmount: z.coerce.number().optional(),
  note: z.string().optional(),
});

const PLATFORMS = [
  { id: 'grab', name: 'Grab', color: 'bg-green-100 text-green-700 border-green-500' },
  { id: 'bolt', name: 'Bolt', color: 'bg-yellow-100 text-yellow-700 border-yellow-500' },
  { id: 'lineman', name: 'LINE MAN', color: 'bg-emerald-100 text-emerald-700 border-emerald-500' },
];

export default function RecordForm() {
  // 2. ตั้งค่า React Hook Form
  const addRecord = useRecordStore((state) => state.addRecord);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: 'grab', // ค่าเริ่มต้น
      income: undefined,
      hasFuel: false,
      fuelAmount: undefined,
      note: '',
    },
  });

  // ใช้ watch เพื่อดูว่ามีการเปิดปุ่มเติมน้ำมันหรือไม่
  const hasFuel = form.watch('hasFuel');

  // 3. ฟังก์ชันเมื่อกดปุ่มบันทึก
async function onSubmit(values: z.infer<typeof formSchema>) {
    
    // 1. ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่ปัจจุบันจาก Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('เซสชันหมดอายุ กรุณาล็อกอินใหม่');
      router.push('/login');
      return;
    }

    // 2. ส่งข้อมูลเข้า Zustand เพื่ออัปเดตหน้าจอทันที (Optimistic UI)
    addRecord(values);

    // 3. ส่งข้อมูลไปเซฟที่ Supabase โดยพ่วง user_id ของคนที่ล็อกอินไปด้วย
    const { error } = await supabase
      .from('records')
      .insert([
        {
          platform: values.platform,
          income: values.income,
          has_fuel: values.hasFuel,
          fuel_amount: values.fuelAmount || 0,
          note: values.note,
          user_id: user.id // 🌟 เพิ่มบรรทัดนี้เพื่อผูกข้อมูลเข้ากับไอดีผู้ใช้
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error.message);
      alert('เกิดข้อผิดพลาดในการเซฟข้อมูล');
      return;
    }

    form.reset(); 
    router.push('/'); 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
        
        {/* ส่วนที่ 1: เลือกแพลตฟอร์ม */}
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-600">แอปที่วิ่งงาน</FormLabel>
              <div className="flex gap-2 mt-2">
                {PLATFORMS.map((p) => {
                  const isActive = field.value === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => field.onChange(p.id)}
                      className={`flex-1 flex items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer font-medium
                        ${isActive ? p.color + ' border-2' : 'border-gray-200 bg-white text-gray-500'}
                      `}
                    >
                      {p.name}
                      {isActive && <CheckCircle2 className="w-4 h-4 ml-1" />}
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ส่วนที่ 2: กรอกรายรับ */}
        <FormField
          control={form.control}
          name="income"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-600">รายรับ (บาท)</FormLabel>
              <FormControl>
                {/* ใช้ type="number" และ inputMode="numeric" เพื่อให้คีย์บอร์ดมือถือเด้งเป็นตัวเลข */}
                <Input 
                  type="number" 
                  inputMode="numeric" 
                  placeholder="0" 
                  className="text-4xl h-20 text-center font-bold text-blue-600 shadow-inner bg-gray-50"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ส่วนที่ 3: สวิตช์เติมน้ำมัน */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-4">
          <FormField
            control={form.control}
            name="hasFuel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <FormLabel className="text-base text-gray-700 cursor-pointer">⛽ วันนี้เติมน้ำมันไหม?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="scale-110"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* ช่องกรอกค่าน้ำมัน (จะโชว์ก็ต่อเมื่อเปิดสวิตช์) */}
          {hasFuel && (
            <FormField
              control={form.control}
              name="fuelAmount"
              render={({ field }) => (
                <FormItem className="animate-in fade-in slide-in-from-top-2">
                  <FormControl>
                    <Input 
                      type="number" 
                      inputMode="numeric" 
                      placeholder="จำนวนเงินที่เติม (บาท)" 
                      className="text-xl h-14 text-center text-red-500"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* ส่วนที่ 4: โน้ตเพิ่มเติม */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-600">บันทึกเพิ่มเติม (ไม่บังคับ)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="เช่น ทิป 20 บาท, ยางรั่ว..." 
                  className="resize-none h-20"
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* ปุ่มบันทึก */}
        <Button 
          type="submit" 
          className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-transform"
        >
          บันทึกข้อมูล
        </Button>

      </form>
    </Form>
  );
}