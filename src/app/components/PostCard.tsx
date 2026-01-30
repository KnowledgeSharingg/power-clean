"use client";

import Link from "next/link";
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
  bookInfo?: {
    coverImageUrl: string;
    title: string;
    content: string;
  };
  genre?: string;
  rating?: number;
}

export default function PostCard({
  id,
  title,
  content,
  likeCount,
  createdAt,
  authorName = `Post #${id}`,
  authorAvatar,
  bookInfo,
  genre = "Book",
  rating = 4.5,
}: PostCardProps) {
  const timeAgo = getTimeAgo(createdAt);

  return (
    <div className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
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
        <button className="text-slate-400">
          <MaterialIcon name="more_horiz" />
        </button>
      </div>

      {/* Cover Image */}
      {bookInfo?.coverImageUrl && (
        <div className="px-4">
          <div className="relative group aspect-[16/10] rounded-lg overflow-hidden bg-slate-900 shadow-inner">
            <Image
              src={bookInfo.coverImageUrl}
              alt={`${bookInfo.title} cover`}
              fill
              className="object-cover opacity-90 transition-transform group-hover:scale-105 duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wider">
                {genre}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold leading-tight">{title}</h3>
            {bookInfo?.title && (
              <p className="text-primary text-sm font-medium">
                {bookInfo.title}
              </p>
            )}
          </div>
          <div className="flex items-center bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg">
            <MaterialIcon name="star" size="sm" filled />
            <span className="text-xs font-bold ml-1">{rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
          {content}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-4">
            <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <MaterialIcon name="favorite" size="xl" />
              <span className="text-sm font-bold">{formatCount(likeCount)}</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <MaterialIcon name="chat_bubble" size="xl" />
              <span className="text-sm font-bold">0</span>
            </button>
          </div>
          <Link
            href={`/post/${id}`}
            className="text-primary text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-primary/10"
          >
            Read More
          </Link>
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
