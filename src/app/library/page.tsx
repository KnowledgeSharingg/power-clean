"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyBookmarks, getToken, serverUrl } from "@/lib/api";
import MaterialIcon from "@/app/components/MaterialIcon";
import PostCard from "@/app/components/PostCard";
import BottomTabBar from "@/app/components/BottomTabBar";

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

export default function LibraryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/auth?redirect=/library");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await getMyBookmarks();
        if (mounted) setPosts(data.postList || []);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-lg mx-auto">
          <h2 className="text-xl font-extrabold tracking-tight">My Library</h2>
        </div>
      </header>

      <main className="max-w-lg mx-auto pb-24">
        <div className="flex flex-col gap-6 px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <MaterialIcon name="bookmark" size="3xl" className="mb-4" />
              <p className="text-lg font-medium">No bookmarks yet</p>
              <p className="text-sm text-center mt-2">
                Save posts you want to read later by tapping the bookmark icon
              </p>
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

      <BottomTabBar />
    </div>
  );
}
