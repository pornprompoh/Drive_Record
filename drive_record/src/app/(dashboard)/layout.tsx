import BottomNavbar from '@/components/shared/BottomNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* ส่วนพื้นที่เนื้อหาหลัก (children) 
        - pb-24 คือการเว้นพื้นที่ด้านล่าง (Padding Bottom) ป้องกันไม่ให้เนื้อหาถูก Navbar บัง
        - max-w-lg mx-auto คือการจำกัดความกว้างของหน้าจอให้ดูเหมือนมือถือ (เผื่อเปิดในคอม)
      */}
      <main className="w-full max-w-lg mx-auto pb-24 min-h-screen bg-white dark:bg-zinc-950 shadow-sm relative">
        {children}
      </main>

      {/* เรียกใช้งานแถบเมนูด้านล่าง */}
      <BottomNavbar />
    </div>
  );
}