import { getPostList, serverUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

function toAbsoluteUrl(url: string): string {
  if (!url) return "";
  // 이미 절대 URL이면 그대로 반환
  if (/^https?:\/\//i.test(url)) return url;
  // 상대경로면 서버 주소를 붙여서 반환
  return `${serverUrl}${url.startsWith("/") ? url : "/" + url}`;
}

export default async function PostListPage() {
  const data = await getPostList();

  return (
    <div className="site-container">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Post List</h1>
      <ul className="space-y-7">
        {data.postList.map((post: any) => (
          <li key={post.id} className="card-padded">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            {post.bookInfo?.coverImageUrl && (
              <div className="mt-3">
                <Image
                  src={toAbsoluteUrl(post.bookInfo.coverImageUrl)}
                  alt={post.bookInfo.title || "Book cover"}
                  width={128}
                  height={192}
                  className="rounded-md shadow-sm"
                />
              </div>
            )}
            <p className="text-black/80 mb-2 line-clamp-2">{post.content}</p>
            <p className="text-sm text-black/60 mb-1">
              👍 {post.likeCount} | 🕒 {new Date(post.createdAt).toLocaleString()}
            </p>

            {post.bookInfo?.title && (
              <div className="mt-3 text-sm text-black/70">
                📖 <strong>{post.bookInfo.title}</strong>: {post.bookInfo.content}
              </div>
            )}

            <Link href={`/post/${post.id}`} className="btn-link text-sm mt-4 inline-block">
              Read more →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
