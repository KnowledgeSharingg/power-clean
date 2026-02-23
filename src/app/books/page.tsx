"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";
import Header from "../../components/Header";
import { apiFetch } from "../../lib/api";

interface BookData {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn13: string;
  isbn10: string;
  publisher: string;
  pubDate: string;
  priceSales: number;
  priceStandard: number;
  coverImageUrl: string;
  link: string;
  categoryId: number;
  categoryName: string;
  customerReviewRank: number;
  bestRank: number;
  source: string;
  createdAt: string;
}

interface BookStats {
  totalBooks: number;
  categories: Record<string, number>;
}

interface CollectResult {
  message: string;
  newBooksSaved: number;
  totalBooks: number;
  sqlFiles: string[];
}

export default function BooksPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [stats, setStats] = useState<BookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [collectLoading, setCollectLoading] = useState(false);
  const [searchCollectLoading, setSearchCollectLoading] = useState(false);
  const [collectResult, setCollectResult] = useState<CollectResult | null>(null);
  const [searchCollectQuery, setSearchCollectQuery] = useState("");
  const [searchCollectResult, setSearchCollectResult] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      let path = "/api/v1/book-data";
      if (selectedCategory) {
        path = `/api/v1/book-data/category?categoryId=${selectedCategory}`;
      } else if (searchKeyword) {
        path = `/api/v1/book-data/search?keyword=${encodeURIComponent(searchKeyword)}`;
      }
      const res = await apiFetch(path);
      if (res.ok) {
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchKeyword]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiFetch("/api/v1/book-data/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBooks();
  }, [fetchStats, fetchBooks]);

  const handleCollect = async () => {
    setCollectLoading(true);
    setCollectResult(null);
    try {
      const res = await apiFetch("/api/v1/book-data/collect", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setCollectResult(data);
        fetchStats();
        fetchBooks();
      } else {
        alert("수집 실패: " + res.statusText);
      }
    } catch {
      alert("수집 요청 중 오류가 발생했습니다.");
    } finally {
      setCollectLoading(false);
    }
  };

  const handleSearchCollect = async () => {
    if (!searchCollectQuery.trim()) return;
    setSearchCollectLoading(true);
    setSearchCollectResult(null);
    try {
      const res = await apiFetch(
        `/api/v1/book-data/search?query=${encodeURIComponent(searchCollectQuery)}&maxResults=20`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchCollectResult(
          typeof data === "string"
            ? data
            : `검색 수집 완료: ${JSON.stringify(data)}`
        );
        fetchStats();
        fetchBooks();
      } else {
        alert("검색 수집 실패: " + res.statusText);
      }
    } catch {
      alert("검색 수집 중 오류가 발생했습니다.");
    } finally {
      setSearchCollectLoading(false);
    }
  };

  const handleSearch = () => {
    setSelectedCategory("");
    fetchBooks();
  };

  const categories = stats?.categories
    ? Object.entries(stats.categories).map(([name, count]) => ({
        name,
        count,
      }))
    : [];

  return (
    <AdminLayout>
      <Header title="도서데이터 관리" />
      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-500">총 도서 수</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats?.totalBooks?.toLocaleString() ?? "—"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-500">카테고리 수</p>
            <p className="text-2xl font-bold text-gray-800">
              {categories.length || "—"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-500">현재 목록</p>
            <p className="text-2xl font-bold text-gray-800">
              {books.length}건
            </p>
          </div>
        </div>

        {/* Collection Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            📥 데이터 수집
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <button
                onClick={handleCollect}
                disabled={collectLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {collectLoading
                  ? "수집 중..."
                  : "🔄 베스트셀러/신간 수집"}
              </button>
              {collectResult && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                  <p>{collectResult.message}</p>
                  <p>
                    새로 저장: {collectResult.newBooksSaved}권 / 전체:{" "}
                    {collectResult.totalBooks}권
                  </p>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchCollectQuery}
                  onChange={(e) => setSearchCollectQuery(e.target.value)}
                  placeholder="알라딘 검색어 입력"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchCollect()}
                />
                <button
                  onClick={handleSearchCollect}
                  disabled={searchCollectLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
                >
                  {searchCollectLoading
                    ? "수집 중..."
                    : "🔍 알라딘 검색 수집"}
                </button>
              </div>
              {searchCollectResult && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                  {searchCollectResult}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            🔍 검색 및 필터
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="제목으로 검색"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                검색
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600">카테고리:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSearchKeyword("");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">전체</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Book List Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    표지
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    제목
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    저자
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    출판사
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    ISBN13
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    카테고리
                  </th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">
                    판매가
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    출처
                  </th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">
                    리뷰 점수
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      로딩 중...
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      도서 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr
                      key={book.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {book.coverImageUrl ? (
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                            📖
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link 
                          href={`/books/${book.id}`}
                          className="max-w-[200px] truncate font-medium text-blue-600 hover:text-blue-800 hover:underline block"
                          title={book.title}
                        >
                          {book.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="max-w-[120px] truncate" title={book.author}>
                          {book.author}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {book.publisher}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                        {book.isbn13}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {book.categoryName || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
                        {book.priceSales
                          ? `₩${book.priceSales.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {book.source || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {book.customerReviewRank ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
