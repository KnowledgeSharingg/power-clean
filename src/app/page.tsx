"use client";

import AdminLayout from "@/components/AdminLayout";
import Header from "@/components/Header";

export default function DashboardPage() {
  return (
    <AdminLayout>
      <Header title="대시보드" />
      <div className="p-8">
        <p className="text-gray-500">대시보드 페이지 준비 중...</p>
      </div>
    </AdminLayout>
  );
}
