"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";

interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  bookInfo: unknown;
  likedByMe: boolean;
  bookmarkedByMe: boolean;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [tagFilter, setTagFilter] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let path = `/post/list?page=${page}&size=${size}`;
      if (tagFilter.trim()) {
        path += `&tag=${encodeURIComponent(tagFilter.trim())}`;
      }
      const res = await apiFetch(path);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.postList || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, size, tagFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId: number) => {
    if (!confirm("정말 이 포스트를 삭제하시겠습니까?")) return;
    try {
      const res = await apiFetch(`/post/${postId}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
      } else {
        alert("삭제 실패: " + res.statusText);
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <Header title="포스트 관리" />
      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                태그 필터
              </label>
              <input
                type="text"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="태그로 필터링"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage(0);
                    fetchPosts();
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                setPage(0);
                fetchPosts();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              검색
            </button>
          </div>
        </div>

        {/* Post Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    제목
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    태그
                  </th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">
                    ❤️ 좋아요
                  </th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">
                    🔖 북마크
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    작성일
                  </th>
                  <th className="text-center px-4 py-3 text-gray-600 font-medium">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      로딩 중...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      포스트가 없습니다.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500">{post.id}</td>
                      <td className="px-4 py-3">
                        <div
                          className="max-w-[300px] truncate font-medium text-gray-800"
                          title={post.title}
                        >
                          {post.title}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {post.tags && post.tags.length > 0
                            ? post.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))
                            : "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {post.likeCount}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {post.bookmarkCount}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            페이지 {page + 1} (페이지당 {size}건)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={posts.length < size}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음 →
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
