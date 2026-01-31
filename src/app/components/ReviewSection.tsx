"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createReview,
  deleteReview,
  getReviewsByPostId,
  updateReview,
} from "@/lib/api";
import MaterialIcon from "./MaterialIcon";

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
    const ok = confirm("Are you sure you want to delete this review?");
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

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Reader Reviews</h3>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <MaterialIcon name="rate_review" size="3xl" className="mb-2" />
            <p className="text-sm">No reviews yet</p>
            <p className="text-xs">Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const isOwner = review.creatorAccountId === creatorAccountId;
            const isEditing = editingId === review.id;

            return (
              <div
                key={review.id}
                className={`flex gap-3 ${isOwner ? "bg-white dark:bg-card-dark-alt p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" : "p-4"}`}
              >
                <div className="size-10 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <MaterialIcon name="person" />
                </div>
                <div
                  className={`flex-1 ${!isOwner ? "border-b border-gray-100 dark:border-gray-800 pb-4" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">
                          {isOwner ? "Me" : "Anonymous"}
                        </p>
                        <div className="flex items-center gap-0.5 text-yellow-500">
                          <MaterialIcon name="star" size="sm" filled />
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {review.createdAt && (
                        <p className="text-[10px] text-gray-500">
                          {getTimeAgo(review.createdAt)}
                        </p>
                      )}
                    </div>
                    {isOwner && !isEditing && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(review)}
                          className="text-xs font-bold text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-xs font-bold text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-2 space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                      />
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditRating(star)}
                              className="focus:outline-none"
                            >
                              <MaterialIcon
                                name="star"
                                filled={star <= editRating}
                                className={
                                  star <= editRating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                        <div className="ml-auto flex gap-2">
                          <button
                            onClick={handleEditSubmit}
                            className="text-white bg-primary px-3 py-1.5 rounded-lg text-sm font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {review.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fixed Review Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-50">
        <div className="max-w-md mx-auto flex gap-3 items-center">
          <div className="flex-1 relative flex items-center">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full pl-5 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Write a review..."
              type="text"
            />
            <div className="absolute right-4 flex items-center">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-transparent border-none text-yellow-500 font-bold text-sm focus:outline-none cursor-pointer"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <MaterialIcon name="grade" className="text-yellow-500 text-xl" />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !content}
            className="bg-primary text-white size-11 flex items-center justify-center rounded-full shadow-lg shadow-primary/30 shrink-0 disabled:opacity-50"
          >
            <MaterialIcon name="send" />
          </button>
        </div>
      </div>
    </div>
  );
}
