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
      setRating(5);
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
      {/* Write Review (inline) */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="person" size="sm" className="text-primary" />
          </div>
          <p className="text-sm font-medium">Write a review</p>
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[80px] p-3 text-sm resize-y"
          placeholder="Share your thoughts about this book..."
        />

        <div className="flex items-center justify-between">
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <MaterialIcon
                  name="star"
                  filled={star <= rating}
                  className={star <= rating ? "text-yellow-500" : "text-gray-300"}
                  size="lg"
                />
              </button>
            ))}
            <span className="text-sm text-text-secondary ml-2">{rating}.0</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !content}
            className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Review"}
          </button>
        </div>
      </div>

      {/* Review List */}
      <div className="divide-y divide-border">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-text-secondary">
            <MaterialIcon name="rate_review" size="3xl" className="mb-2 opacity-40" />
            <p className="text-sm">No reviews yet</p>
            <p className="text-xs mt-1">Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const isOwner = review.creatorAccountId === creatorAccountId;
            const isEditing = editingId === review.id;

            return (
              <div key={review.id} className="py-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-border flex items-center justify-center">
                    <MaterialIcon name="person" size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {isOwner ? "Me" : "Anonymous"}
                          </p>
                          <div className="flex items-center gap-0.5 text-yellow-500">
                            <MaterialIcon name="star" size="xs" filled />
                            <span className="text-xs font-medium text-black">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {review.createdAt && (
                          <p className="text-xs text-text-secondary">
                            {getTimeAgo(review.createdAt)}
                          </p>
                        )}
                      </div>
                      {isOwner && !isEditing && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEdit(review)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="text-xs font-medium text-red-500 hover:underline"
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
                          className="w-full p-3 min-h-[80px] text-sm resize-y"
                        />
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
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
                                    star <= editRating ? "text-yellow-500" : "text-gray-300"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                          <div className="ml-auto flex gap-2">
                            <button onClick={handleEditSubmit} className="btn-primary text-sm px-4 py-1.5">
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)} className="btn text-sm px-4 py-1.5">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-black/80 mt-2 leading-relaxed">
                        {review.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
