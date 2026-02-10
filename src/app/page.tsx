"use client";

import { useState, useEffect } from "react";
import { getPostList, serverUrl } from "@/lib/api";
import PostCard from "./components/PostCard";

interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  createdAt: string;
  bookInfo?: {
    coverImageUrl: string;
    title?: string;
    content?: string;
  };
}

const toAbsoluteUrl = (url: string): string => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${serverUrl}${url.startsWith("/") ? url : "/" + url}`;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const data = await getPostList();
        if (mounted) setPosts(data.postList);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="site-container py-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary mb-6">Explore</h1>

        {/* Filter Section */}
        <div className="card-padded mb-6">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-black/70 hover:text-black">
              ▸ Filter all books
            </summary>
            <div className="mt-4 flex gap-3">
              <input
                className="flex-1 h-10 px-4 text-sm border border-border rounded-lg bg-white placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Search books, authors..."
                type="text"
              />
            </div>
          </details>
        </div>

        {/* Post List (TheStoryGraph style - vertical list, not grid) */}
        <div className="space-y-0 divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-black/40">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mb-4 opacity-40">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm mt-1">Be the first to share a book!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                likeCount={post.likeCount}
                likedByMe={post.likedByMe}
                createdAt={post.createdAt}
                coverImageUrl={
                  post.bookInfo?.coverImageUrl
                    ? toAbsoluteUrl(post.bookInfo.coverImageUrl)
                    : undefined
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
