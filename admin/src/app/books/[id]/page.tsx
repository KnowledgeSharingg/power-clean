"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../../../components/AdminLayout";
import Header from "../../../components/Header";
import { apiFetch } from "../../../lib/api";

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
  bestRank?: number;
  source: string;
  createdAt: string;
  post?: {
    id: string;
    title: string;
  } | null;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!params.id || typeof params.id !== "string") return;
      
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch(`/api/v1/book-data/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        } else if (res.status === 404) {
          setError("도서를 찾을 수 없습니다.");
        } else {
          setError("도서 정보를 불러오는데 실패했습니다.");
        }
      } catch {
        setError("서버 연결에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <AdminLayout>
        <Header title="도서 상세 정보" />
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !book) {
    return (
      <AdminLayout>
        <Header title="도서 상세 정보" />
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">⚠️ {error || "도서 정보를 찾을 수 없습니다."}</div>
            <Link 
              href="/books"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Header title={book.title} />
      <div className="p-8 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link 
            href="/books"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
          >
            ← 목록으로 돌아가기
          </Link>
          <div className="text-sm text-gray-500">
            등록일: {new Date(book.createdAt).toLocaleDateString('ko-KR')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cover Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full max-w-64 mx-auto rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full max-w-64 mx-auto h-80 bg-gray-200 rounded-lg flex items-center justify-center text-6xl text-gray-400">
                    📖
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Book Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">기본 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">제목</label>
                  <p className="text-gray-800 font-medium">{book.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">저자</label>
                  <p className="text-gray-800">{book.author}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">출판사</label>
                  <p className="text-gray-800">{book.publisher}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">출판일</label>
                  <p className="text-gray-800">{book.pubDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">카테고리</label>
                  <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {book.categoryName || "—"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">수집 출처</label>
                  <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {book.source || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ISBN & Pricing */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">ISBN 및 가격 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">ISBN13</label>
                  <p className="text-gray-800 font-mono text-sm">{book.isbn13 || "—"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">ISBN10</label>
                  <p className="text-gray-800 font-mono text-sm">{book.isbn10 || "—"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">판매가</label>
                  <p className="text-gray-800 font-semibold text-lg">
                    {book.priceSales ? `₩${book.priceSales.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">정가</label>
                  <p className="text-gray-600">
                    {book.priceStandard ? `₩${book.priceStandard.toLocaleString()}` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews & Rankings */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">평점 및 랭킹</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">리뷰 점수</label>
                  <div className="flex items-center">
                    <p className="text-gray-800 font-semibold text-lg mr-2">
                      {book.customerReviewRank ?? "—"}
                    </p>
                    {book.customerReviewRank && (
                      <span className="text-yellow-500">★</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">베스트 랭킹</label>
                  <p className="text-gray-800 font-semibold">
                    {book.bestRank ? `${book.bestRank}위` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Connection Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Post 연결 상태</h2>
              <div>
                {book.post ? (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-600 mr-2">✅</div>
                    <div>
                      <p className="text-green-800 font-medium">Post 연결됨</p>
                      <p className="text-green-600 text-sm">Post ID: {book.post.id}</p>
                      {book.post.title && (
                        <p className="text-green-600 text-sm">제목: {book.post.title}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-gray-500 mr-2">⚪</div>
                    <div>
                      <p className="text-gray-700 font-medium">Post 미연결</p>
                      <p className="text-gray-500 text-sm">이 도서는 아직 Post로 등록되지 않았습니다.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">설명</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {book.description ? (
              <p className="whitespace-pre-wrap">{book.description}</p>
            ) : (
              <p className="text-gray-500 italic">설명이 없습니다.</p>
            )}
          </div>
        </div>

        {/* External Link */}
        {book.link && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">알라딘 링크</h2>
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              🔗 알라딘에서 보기
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link 
            href="/books"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}