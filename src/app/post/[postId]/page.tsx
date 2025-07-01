"use client";

import { useEffect, useState } from "react";
import ReviewSection from "@/app/components/ReviewSection";
import { getPostDetail, updatePost } from "@/lib/api";

export default function PostDetailPage({
  params,
}: {
  params: { postId: string };
}) {
  interface AuthorInfo {
    name: string;
    dateOfBirth: string;
    phoneNumber: string;
    gender: string;
    history: string;
  }

  interface BookInfo {
    title: string;
    content: string;
    link: string;
    coverImageUrl: string;
    authorInfo?: AuthorInfo;
  }

  interface Post {
    createdAt: string;
    id: string;
    title: string;
    content: string;
    bookInfo: BookInfo;
  }

  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [bookInfo, setBookInfo] = useState<{
    title: string;
    content: string;
    link: string;
    authorInfo?: {
      name: string;
      dateOfBirth: string;
      phoneNumber: string;
      gender: string;
      history: string;
    };
  }>({
    title: "",
    content: "",
    link: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostDetail(params.postId);
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setBookInfo(postData.bookInfo);
      } catch (error) {
        console.error(error);
        setLoadError(true);
      }
    };
    fetchPost();
  }, [params.postId]);

  const handleUpdate = async () => {
    if (!post) return;

    const success = await updatePost({
      id: post.id,
      title,
      content,
      bookInfo,
    });
    if (success) {
      alert("수정 성공!");
      setPost({ ...post, title, content, bookInfo }); // 로컬 상태 업데이트
      setIsEditing(false);
    } else {
      alert("수정 실패!");
    }
  };

  if (!post) {
    return (
      <div className="p-4 text-red-600">게시글을 불러오고 있습니다...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {isEditing ? (
        <>
          <input
            className="border p-2 w-full text-3xl font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="새 제목"
          />
          <textarea
            className="border p-2 w-full mt-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="새 내용"
          />

          <div className="mt-4">
            <h2 className="text-2xl font-semibold">📚 도서 정보 수정</h2>
            <input
              className="border p-2 w-full mt-2"
              value={bookInfo?.title}
              onChange={(e) =>
                setBookInfo({ ...bookInfo, title: e.target.value })
              }
              placeholder="도서 제목"
            />
            <textarea
              className="border p-2 w-full mt-2"
              value={bookInfo?.content}
              onChange={(e) =>
                setBookInfo({ ...bookInfo, content: e.target.value })
              }
              placeholder="도서 내용"
            />
            <input
              className="border p-2 w-full mt-2"
              value={bookInfo?.link}
              onChange={(e) =>
                setBookInfo({ ...bookInfo, link: e.target.value })
              }
              placeholder="도서 링크"
            />
            {/* 필요하면 authorInfo도 같은 방식으로 확장 가능 */}
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              className="bg-green-600 text-white p-2 rounded"
              onClick={handleUpdate}
            >
              저장
            </button>
            <button
              className="bg-gray-400 text-white p-2 rounded"
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600">
            작성일: {new Date(post.createdAt).toLocaleString()}
          </p>
          <p className="text-lg mt-4">{post.content}</p>

          <div className="border-t pt-4 mt-6">
            <h2 className="text-2xl font-semibold">📚 관련 도서 정보</h2>
            <p className="text-xl font-bold">{post.bookInfo?.title}</p>
            <p className="text-gray-700">{post.bookInfo?.content}</p>
            <a
              href={post.bookInfo?.link}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              도서 링크
            </a>
            {post.bookInfo?.authorInfo?.name && (
              <div className="border-t pt-4 mt-6">
                <h2 className="text-2xl font-semibold">✍️ 작가 정보</h2>
                <ul className="list-disc list-inside text-gray-700">
                  <li>이름: {post.bookInfo.authorInfo.name}</li>
                  <li>생년월일: {post.bookInfo.authorInfo.dateOfBirth}</li>
                  <li>연락처: {post.bookInfo.authorInfo.phoneNumber}</li>
                  <li>성별: {post.bookInfo.authorInfo.gender}</li>
                  <li>약력: {post.bookInfo.authorInfo.history}</li>
                </ul>
              </div>
            )}
            <button
              className="bg-blue-600 text-white p-2 rounded mt-4"
              onClick={() => setIsEditing(true)}
            >
              수정하기
            </button>
          </div>
        </>
      )}
      {!isEditing && (
        <ReviewSection
          postId={params.postId}
          // TODO: 로그인 기능 추가되면 값 넘기도록.
          creatorAccountId={"0197353d-b73f-7847-ae1c-1f4ff1839b67"}
        />
      )}
    </div>
  );
}
