"use client";

import { useState } from "react";
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
  const [showList, setShowList] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleList = async () => {
    if (!showList && posts.length === 0) {
      setLoading(true);
      try {
        const data = await getPostList();
        setPosts(data.postList);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    setShowList((prev) => !prev); // 리스트 보여짐 상태 토글
  };

  const toAbsoluteUrl = (url: string): string => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `${serverUrl}${url.startsWith("/") ? url : "/" + url}`;
  };

  return (
    <div className="site-container">
      <p className="text-base sm:text-lg mb-8 text-center prose-muted">
        Share book information and engage in discussions!
      </p>

      <div className="mb-6 flex gap-3">
        <Link href="/auth" className="btn-outline">내 계정 관리 (로그인/회원가입)</Link>
        <button className="btn" onClick={() => router.push("/post/create")}>Add Post ➕</button>
      </div>

      <button
        className="btn-outline mb-4"
        onClick={toggleList}
      >
        {showList ? "Hide Posts ▲" : "View Posts ▼"}
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden w-full ${
          showList ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ul className="space-y-7">
            {posts.map((post) => (
              <li key={post.id} className="card-padded">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {post.bookInfo?.title && (
                  <div className="mt-3 text-sm text-black/70">
                    {post.bookInfo.coverImageUrl && (
                      <div className="w-24 h-auto relative mb-2">
                        <Image
                          src={toAbsoluteUrl(post.bookInfo.coverImageUrl)}
                          alt={`${post.bookInfo.title} cover`}
                          width={96}
                          height={144}
                          className="rounded-md mb-2 shadow-sm object-contain"
                        />
                      </div>
                    )}
                    📖 <strong>{post.bookInfo.title}</strong>: {post.bookInfo.content}
                  </div>
                )}
                <p className="text-black/80 mb-2 line-clamp-2">{post.content}</p>
                <p className="text-sm text-black/60 mb-1">
                  👍 {post.likeCount} | 🕒 {new Date(post.createdAt).toLocaleString()}
                </p>
                <Link href={`/post/${post.id}`} className="btn-link text-sm">
                  Read more →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
