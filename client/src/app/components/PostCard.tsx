"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MaterialIcon from "./MaterialIcon";
import { toggleLike, getToken } from "@/lib/api";
import { getTimeAgoParams } from "@/lib/timeAgo";

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
  coverImageUrl?: string;
  tags?: string[];
  onLikeChange?: (id: number, liked: boolean, newCount: number) => void;
}

export default function PostCard({
  id,
  title,
  content,
  likeCount,
  likedByMe = false,
  createdAt,
  authorName,
  coverImageUrl,
  tags,
  onLikeChange,
}: PostCardProps) {
  const router = useRouter();
  const t = useTranslations();
  const timeParams = getTimeAgoParams(createdAt);
  const timeAgo = timeParams.key === "fallback"
    ? timeParams.fallbackDate!
    : t(`time.${timeParams.key}`, timeParams.values);
  const [liked, setLiked] = useState(likedByMe);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const handleCardClick = () => {
    router.push(`/post/${id}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!getToken()) {
      router.push(`/auth?redirect=${encodeURIComponent(`/post/${id}`)}`);
      return;
    }
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    const prevLiked = liked;
    const prevCount = currentLikeCount;

    const newLiked = !liked;
    const newCount = liked ? currentLikeCount - 1 : currentLikeCount + 1;
    setLiked(newLiked);
    setCurrentLikeCount(newCount);

    const success = await toggleLike(String(id), prevLiked);
    if (success) {
      onLikeChange?.(id, newLiked, newCount);
    } else {
      setLiked(prevLiked);
      setCurrentLikeCount(prevCount);
    }
    setIsLikeLoading(false);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex gap-5 lg:gap-8 py-6 cursor-pointer hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg"
    >
      {/* Book Cover - Left */}
      {coverImageUrl ? (
        <div className="relative w-20 sm:w-24 flex-shrink-0 aspect-[3/4] rounded overflow-hidden bg-gray-100 shadow-sm">
          <img
            src={coverImageUrl}
            alt={t("postCard.cover")}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-20 sm:w-24 flex-shrink-0 aspect-[3/4] rounded bg-gray-100 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black/20">
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" fill="currentColor"/>
          </svg>
        </div>
      )}

      {/* Book Info - Middle */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="text-base font-bold text-black leading-tight mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Author */}
        <p className="text-sm text-text-secondary mb-1">{authorName || t("common.anonymous")}</p>

        {/* Meta */}
        <p className="text-xs text-text-secondary mb-3">{timeAgo}</p>

        {/* Content Snippet */}
        <p className="text-sm text-black/70 leading-relaxed line-clamp-2 mb-3">
          {content}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/?tag=${encodeURIComponent(tag)}`);
                }}
                className="bg-gray-100 text-black text-xs px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLikeClick}
            disabled={isLikeLoading}
            className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
              liked
                ? "text-red-500"
                : "text-black/40 hover:text-red-500"
            }`}
          >
            <MaterialIcon name="favorite" size="sm" filled={liked} />
            <span className="text-xs font-medium">
              {formatCount(currentLikeCount)}
            </span>
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-black/40 hover:text-primary transition-colors"
          >
            <MaterialIcon name="chat_bubble" size="sm" />
            <span className="text-xs font-medium">0</span>
          </button>
        </div>
      </div>

      {/* Action Buttons - Right */}
      <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="btn-primary text-xs px-4 py-2"
        >
          {t("postCard.readMore")}
        </button>
      </div>
    </div>
  );
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}
