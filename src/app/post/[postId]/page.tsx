// app/post/[postId]/page.tsx
import { getPostDetail } from "@/lib/api";

interface PostDetailPageProps {
  params: { postId: string };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const post = await getPostDetail(params.postId);

  if (!post) {
    return (
      <div className="p-4 text-red-600">게시글을 불러오지 못했습니다.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-2">
        작성일: {new Date(post.createdAt).toLocaleString()}
      </p>
      <p className="text-lg mb-6">{post.content}</p>

      <div className="border-t pt-4 mt-6">
        <h2 className="text-2xl font-semibold mb-2">📚 관련 도서 정보</h2>
        <p className="text-xl font-bold">{post.bookInfo.title}</p>
        <p className="text-gray-700 mb-1">{post.bookInfo.content}</p>
        <a
          href={post.bookInfo.link}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          도서 링크
        </a>
      </div>

      {post.bookInfo.authorInfo?.name && (
        <div className="border-t pt-4 mt-6">
          <h2 className="text-2xl font-semibold mb-2">✍️ 작가 정보</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>이름: {post.bookInfo.authorInfo.name}</li>
            <li>생년월일: {post.bookInfo.authorInfo.dateOfBirth}</li>
            <li>연락처: {post.bookInfo.authorInfo.phoneNumber}</li>
            <li>성별: {post.bookInfo.authorInfo.gender}</li>
            <li>약력: {post.bookInfo.authorInfo.history}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
