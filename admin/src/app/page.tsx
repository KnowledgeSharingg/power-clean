"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";

interface BookStats {
  totalBooks: number;
  categories: Record<string, number> | number;
}

export default function DashboardPage() {
  const [bookStats, setBookStats] = useState<BookStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiFetch("/api/v1/book-data/stats");
        if (res.ok) {
          const data = await res.json();
          setBookStats(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      title: "총 회원수",
      value: "—",
      desc: "API 연동 예정",
      icon: "👥",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "총 도서 수",
      value: loading ? "..." : bookStats?.totalBooks?.toLocaleString() ?? "0",
      desc: "수집된 도서 데이터",
      icon: "📚",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "총 포스트 수",
      value: "—",
      desc: "API 연동 예정",
      icon: "📝",
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "카테고리 수",
      value: loading
        ? "..."
        : bookStats?.categories
        ? typeof bookStats.categories === "object"
          ? Object.keys(bookStats.categories).length.toString()
          : bookStats.categories.toString()
        : "0",
      desc: "도서 카테고리",
      icon: "🏷️",
      color: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <AdminLayout>
      <Header title="대시보드" />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.icon}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${card.color}`}
                >
                  {card.desc}
                </span>
              </div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            빠른 작업
          </h3>
          <div className="flex flex-wrap gap-3">
            <a
              href="/books"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              📚 도서 데이터 관리
            </a>
            <a
              href="/posts"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              📝 포스트 관리
            </a>
            <a
              href="/members"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              👥 회원 관리
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
