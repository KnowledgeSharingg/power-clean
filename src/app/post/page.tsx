import Link from "next/link";

export default async function PostListPage() {
  const data = await getPostList();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 게시글 목록</h1>
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
            <Link
              href={`/posts/${post.id}`}
              className="inline-block mt-4 text-blue-600 hover:underline text-sm"
            >
              자세히 보기 →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
