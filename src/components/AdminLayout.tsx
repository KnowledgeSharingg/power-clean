"use client";

import Sidebar from "./Sidebar";
import AuthGuard from "./AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </AuthGuard>
  );
}
