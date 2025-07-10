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

  return (
    <div className="min-h-screen w-full bg-[#ede4cf] text-[#4b3b2a] font-serif flex flex-col items-center py-16 px-4 transition-all duration-500">
      <p className="text-lg mb-8 text-[#5c4033] text-center">
        Share book information and engage in discussions!
      </p>

      <div
        className={`transition-all duration-500 ${showList ? "mb-2" : "mb-10"}`}
      >
        <button
          className="bg-[#6a563f] text-white px-6 py-3 rounded-2xl shadow hover:bg-[#4b3b2a] transition duration-200"
          onClick={() => router.push("/post/create")}
        >
          Add Post ➕
        </button>
      </div>

      <button
        className="bg-[#c2b28f] text-[#4b3b2a] px-5 py-2 rounded-xl shadow hover:bg-[#a99977] transition duration-200 mb-4"
        onClick={toggleList}
      >
        {showList ? "Hide Posts ▲" : "View Posts ▼"}
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden w-full max-w-4xl ${
          showList ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ul className="space-y-6 p-6">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                {post.bookInfo?.title && (
                  <div className="mt-3 text-sm text-gray-600">
                    {post.bookInfo.coverImageUrl && (
                      <div className="w-24 h-auto relative mb-2">
                        <Image
                          src={`${post.bookInfo.coverImageUrl}`}
                          alt={`${post.bookInfo.title} cover`}
                          width={96}
                          height={144}
                          className="rounded-lg mb-2 shadow object-contain"
                        />
                      </div>
                    )}
                    📖 <strong>{post.bookInfo.title}</strong>:{" "}
                    {post.bookInfo.content}
                  </div>
                )}
                <p className="text-gray-700 mb-2 line-clamp-2">
                  {post.content}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  👍 {post.likeCount} | 🕒{" "}
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <Link
                  href={`/post/${post.id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline text-sm"
                >
                  Read more →
                </Link>{" "}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
