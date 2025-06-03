"use client";

import { useEffect, useState } from "react";
import { createReview, getReviewsByPostId } from "@/lib/api";

interface Review {
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
          {reviews.map((r, i) => (
            <li key={i} className="border p-3 rounded">
              <div className="text-sm text-gray-600">⭐️ 평점: {r.rating}</div>
              <div>{r.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
