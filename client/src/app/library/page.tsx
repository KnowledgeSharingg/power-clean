"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getMyBookmarks, getToken, serverUrl } from "@/lib/api";
import MaterialIcon from "@/app/components/MaterialIcon";
import PostCard from "@/app/components/PostCard";

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
  const t = useTranslations("library");
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
    <div className="bg-white text-black min-h-screen">
      <div className="site-container py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">{t("title")}</h1>

        <div className="card-padded mb-6">
          <p className="text-sm text-text-secondary">
            {t("description")}
          </p>
        </div>

        <div className="space-y-0 divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
              <MaterialIcon name="bookmark_border" size="3xl" className="mb-4 opacity-40" />
              <p className="text-lg font-medium mb-2">{t("noBookmarks")}</p>
              <p className="text-sm text-center max-w-md">
                {t("noBookmarksHelp")}
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
      </div>
    </div>
  );
}
