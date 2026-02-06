"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostList, serverUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "./components/MaterialIcon";
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
  const router = useRouter();

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
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src="/logo.png"
                alt="서책의 파도 로고"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">서책의 파도</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="size-9 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center"
            >
              <MaterialIcon name="person" size="lg" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto pb-24">
        {/* Search Section */}
        <div className="px-4 py-4">
          <label className="relative flex items-center w-full">
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <MaterialIcon name="search" />
            </div>
            <input
              className="w-full h-12 pl-12 pr-4 rounded-xl border-none bg-slate-200/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all text-base placeholder:text-slate-500 dark:placeholder:text-slate-400"
              placeholder="Books, authors, or users..."
              type="text"
            />
          </label>
        </div>

        {/* Feed Section */}
        <div className="flex flex-col gap-6 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <MaterialIcon name="menu_book" size="3xl" className="mb-4" />
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm">Be the first to share a book!</p>
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
      </main>

      {/* FAB */}
      <button
        onClick={() => router.push("/post/create")}
        className="fixed right-6 bottom-24 bg-primary text-white size-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40"
      >
        <MaterialIcon name="add" size="3xl" />
      </button>

    </div>
  );
}
