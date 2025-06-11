"use client";

import { useEffect, useState } from "react";
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

  const fetchReviews = async () => {
    try {
      const data = await getReviewsByPostId(postId, 0, 10);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
    <div className="border-t mt-6 pt-6">
      <h2 className="text-2xl font-semibold mb-4">📝 리뷰 작성</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="리뷰를 작성하세요"
      />
      <div className="flex items-center gap-2 mb-4">
        <label>평점:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded p-1"
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "작성 중..." : "리뷰 등록"}
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">리뷰 목록</h3>
        {reviews.length === 0 && <p>아직 리뷰가 없습니다.</p>}
        <ul className="space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="border p-3 rounded">
              <div className="text-sm text-gray-600">⭐️ 평점: {r.rating}</div>
              {editingId === r.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-1 border rounded mt-1"
                  />
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="border rounded p-1 mt-1"
                  >
                    {[5, 4, 3, 2, 1].map((val) => (
                      <option key={val} value={val}>
                        {val}점
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleEditSubmit}
                      className="text-white bg-green-600 px-2 py-1 rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-white bg-gray-500 px-2 py-1 rounded"
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>{r.content}</div>
                  {r.creatorAccountId === creatorAccountId && (
                    <div className="mt-2 flex gap-2 text-sm">
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
      </div>
    </div>
  );
}
