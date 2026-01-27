"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostList, serverUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  createdAt: string;
  bookInfo?: {
    coverImageUrl: string;
    title: string;
    content: string;
  };
}

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

  const toAbsoluteUrl = (url: string): string => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `${serverUrl}${url.startsWith("/") ? url : "/" + url}`;
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white text-black">
      {/* 상단 네비(페이지 내부 헤더 대체) */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-black/10">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-1 bg-black text-white">
              <span className="text-sm font-bold">📚</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Bookly</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-black text-white hover:bg-black/90"
              onClick={() => router.push("/post/create")}
            >
              +
            </button>
          </div>
        </div>
      </header>

      {/* 검색 영역 */}
      <div className="px-4 py-4">
        <label className="relative flex items-center w-full">
          <div className="absolute left-4 text-black/40 pointer-events-none">
            🔎
          </div>
          <input
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-black/10 bg-black/5 focus:ring-2 focus:ring-link focus:bg-white transition-all text-base placeholder:text-black/40"
            placeholder="Books, authors, or users..."
            type="text"
          />
        </label>
      </div>

      {/* 피드 섹션 */}
      <main className="px-4 pb-24">
        <div className="w-full">
          {loading ? (
            <p className="text-center py-6">Loading...</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-black/10"
                >
                  {/* 작성자/메타 */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-black/10" />
                      <div>
                        <p className="text-sm font-bold">Post #{post.id}</p>
                        <p className="text-xs text-black/50">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-black/40">•••</button>
                  </div>

                  {/* 커버 이미지 */}
                  {post.bookInfo?.coverImageUrl && (
                    <div className="px-4">
                      <div className="relative group aspect-[16/10] rounded-lg overflow-hidden bg-black/10">
                        <Image
                          src={toAbsoluteUrl(post.bookInfo.coverImageUrl)}
                          alt={`${post.bookInfo.title} cover`}
                          fill
                          className="object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {post.bookInfo?.title && (
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded uppercase tracking-wider">
                              {post.bookInfo.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 본문 및 액션 */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold leading-tight">
                          {post.title}
                        </h3>
                        {post.bookInfo?.title && (
                          <p className="text-link text-sm font-medium">
                            📖 {post.bookInfo.title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center bg-black/5 text-black px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold">👍</span>
                        <span className="text-xs font-bold ml-1">
                          {post.likeCount}
                        </span>
                      </div>
                    </div>

                    {post.bookInfo?.content && (
                      <p className="text-black/70 text-sm line-clamp-2 mb-4">
                        {post.bookInfo.content}
                      </p>
                    )}
                    <p className="text-black/80 mb-2 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-black/10">
                      <div className="flex gap-4">
                        <span className="text-sm font-bold text-black/60">
                          Likes {post.likeCount}
                        </span>
                      </div>
                      <Link
                        href={`/post/${post.id}`}
                        className="btn-link text-sm"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
