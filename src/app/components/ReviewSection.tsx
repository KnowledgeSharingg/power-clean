"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createReview,
  deleteReview,
  getReviewsByPostId,
  updateReview,
} from "@/lib/api";

interface Review {
  id: string;
  content: string;
  rating: number;
  creatorAccountId: string;
  createdAt?: string;
}

interface ReviewSectionProps {
  postId: string;
  creatorAccountId: string;
}

// TODO: 리뷰 삭제, 수정 API 붙이기.
export default function ReviewSection({
  postId,
  creatorAccountId,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  const handleDelete = async (reviewId: string) => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    const success = await deleteReview(reviewId);
    if (success) fetchReviews();
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    const success = await updateReview({
      content: editContent,
      rating: editRating,
      reviewId: editingId,
    });
    if (success) {
      setEditingId(null);
      fetchReviews();
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      const data = await getReviewsByPostId(postId, 0, 10);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
    }
  }, [postId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async () => {
    if (!content) return;

    setLoading(true);
    const success = await createReview({
      content,
      rating,
      postId,
      creatorAccountId,
    });
    if (success) {
      setContent("");
      fetchReviews();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto font-sans space-y-8">
      <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4">📝 리뷰 작성</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
          placeholder="리뷰를 작성하세요"
        />
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">평점</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}점
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "작성 중..." : "리뷰 등록"}
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-2">리뷰 목록</h3>
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm">아직 리뷰가 없습니다</p>
          </div>
        ) : (
          <ul className="list-none space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-base font-semibold">{r.rating}</span>
                  </div>
                  {r.createdAt && (
                    <span className="text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                  )}
                </div>

                {editingId === r.id ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                    />
                    <div className="mt-2 flex items-center gap-3">
                      <select
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[5, 4, 3, 2, 1].map((val) => (
                          <option key={val} value={val}>
                            {val}점
                          </option>
                        ))}
                      </select>
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={handleEditSubmit}
                          className="text-white bg-green-600 px-3 py-2 rounded-lg hover:bg-green-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-white bg-gray-500 px-3 py-2 rounded-lg hover:bg-gray-600"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-black/80">{r.content}</p>
                    {r.creatorAccountId === creatorAccountId && (
                      <div className="mt-3 flex gap-3 text-sm">
                        <button
                          onClick={() => startEdit(r)}
                          className="text-blue-600 hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-red-600 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
