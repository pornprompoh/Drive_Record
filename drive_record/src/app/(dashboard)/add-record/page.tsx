import RecordForm from '@/components/features/RecordForm';

export default function AddRecordPage() {
  return (
    <div className="pt-6 pb-4">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">เพิ่มรายการใหม่</h1>
        <p className="text-sm text-gray-500">จดบันทึกรายรับ-รายจ่ายของวันนี้</p>
      </div>

      {/* เรียกใช้งาน Component ฟอร์มที่เราเพิ่งสร้าง */}
      <RecordForm />
    </div>
  );
}