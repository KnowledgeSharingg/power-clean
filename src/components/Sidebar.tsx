"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "대시보드", icon: "📊" },
  { href: "/members", label: "회원관리", icon: "👥" },
  { href: "/books", label: "도서데이터", icon: "📚" },
  { href: "/posts", label: "포스트관리", icon: "📝" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">⚡ Power Clean</h1>
        <p className="text-xs text-gray-400 mt-1">관리자 대시보드</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-gray-800 text-white border-r-2 border-blue-500"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }}
          className="w-full text-sm text-gray-400 hover:text-white transition-colors text-left"
        >
          🚪 로그아웃
        </button>
      </div>
    </aside>
  );
}
