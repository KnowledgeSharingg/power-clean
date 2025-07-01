import { getPostList } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function PostListPage() {
  const data = await getPostList();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Post List</h1>
      <ul className="space-y-6">
        {data.postList.map((post: any) => (
          <li
            key={post.id}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-700 mb-2 line-clamp-2">{post.content}</p>
            <p className="text-sm text-gray-500 mb-1">
              👍 {post.likeCount} | 🕒{" "}
              {new Date(post.createdAt).toLocaleString()}
            </p>

            {post.bookInfo?.title && (
              <div className="mt-3 text-sm text-gray-600">
                📖 <strong>{post.bookInfo.title}</strong>:{" "}
                {post.bookInfo.content}
              </div>
            )}

            {post.bookInfo?.coverImageUrl && (
              <div className="mt-3">
                <Image
                  src={post.bookInfo.coverImageUrl}
                  alt={post.bookInfo.title || "Book cover"}
                  width={128} // 원하는 너비
                  height={192} // 원하는 높이
                  className="rounded-md"
                />
              </div>
            )}

            <Link
              href={`/post/${post.id}`}
              className="inline-block mt-4 text-blue-600 hover:underline text-sm"
            >
              Read more →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
