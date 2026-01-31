"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import MaterialIcon from "./MaterialIcon";

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
  coverImageUrl?: string;
}

export default function PostCard({
  id,
  title,
  content,
  likeCount,
  createdAt,
  authorName = "Anonymous",
  authorAvatar,
  coverImageUrl,
}: PostCardProps) {
  const router = useRouter();
  const timeAgo = getTimeAgo(createdAt);

  const handleCardClick = () => {
    router.push(`/post/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Author Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
            style={
              authorAvatar
                ? { backgroundImage: `url(${authorAvatar})` }
                : undefined
            }
          />
          <div>
            <p className="text-sm font-bold">{authorName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {timeAgo}
            </p>
          </div>
        </div>
        <button className="text-slate-400" onClick={(e) => e.stopPropagation()}>
          <MaterialIcon name="more_horiz" />
        </button>
      </div>

      {/* Cover Image */}
      {coverImageUrl && (
        <div className="px-4">
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-900 shadow-inner">
            <Image
              src={coverImageUrl}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-extrabold leading-tight mb-3 text-slate-900 dark:text-white">{title}</h3>

        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed line-clamp-3 mb-4">
          {content}
        </p>

        {/* Actions */}
        <div className="flex items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-4">
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
            >
              <MaterialIcon name="favorite" size="xl" />
              <span className="text-sm font-bold">{formatCount(likeCount)}</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
            >
              <MaterialIcon name="chat_bubble" size="xl" />
              <span className="text-sm font-bold">0</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
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
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}
