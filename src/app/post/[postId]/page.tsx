"use client";

import { use, useEffect, useState } from "react";
import ReviewSection from "@/app/components/ReviewSection";
import { getPostDetail, updatePost, serverUrl } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/app/components/MaterialIcon";

function toAbsoluteUrl(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${serverUrl}${url.startsWith("/") ? url : "/" + url}`;
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
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
    likeCount?: number;
  }

  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [bookInfo, setBookInfo] = useState<{
    title: string;
    content: string;
    link: string;
    coverImageUrl: string;
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
    coverImageUrl: "",
  });

  const { postId } = use(params);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostDetail(postId);
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setBookInfo(postData.bookInfo);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdate = async () => {
    if (!post) return;

    const updatedBookInfo = {
      ...bookInfo,
      title,
      content,
    };

    const success = await updatePost({
      id: post.id,
      title,
      content,
      bookInfo: updatedBookInfo,
    });
    if (success) {
      alert("수정 성공!");
      setPost({ ...post, title, content, bookInfo: updatedBookInfo });
      setBookInfo(updatedBookInfo);
      setIsEditing(false);
    } else {
      alert("수정 실패!");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <MaterialIcon name="arrow_back_ios_new" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            Post Details
          </h2>
        </div>
        <div className="flex gap-2">
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <MaterialIcon name="share" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <MaterialIcon name="more_horiz" />
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pb-32">
        {isEditing ? (
          <div className="max-w-lg mx-auto p-4">
            <div className="bg-white dark:bg-card-dark-alt rounded-xl p-5 space-y-4">
              <input
                className="w-full text-2xl font-bold bg-transparent border-b border-gray-200 dark:border-gray-700 pb-2 focus:outline-none focus:border-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className="w-full min-h-[120px] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
              />

              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="flex-1 bg-gray-200 dark:bg-gray-700 py-3 rounded-xl font-bold"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Cover Image */}
            {post.bookInfo?.coverImageUrl && (
              <div className="px-4 pt-4 flex justify-center">
                <div className="relative w-48 aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={toAbsoluteUrl(post.bookInfo.coverImageUrl)}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Content Card */}
            <div className="px-4 pt-4 relative z-10">
              <div className="bg-white dark:bg-card-dark-alt rounded-xl p-5 shadow-xl border border-gray-100 dark:border-gray-800">
                {/* User Info & Rating */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="size-12 rounded-full overflow-hidden border-2 border-primary bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <MaterialIcon name="person" size="xl" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Anonymous User</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        shared {timeAgo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                    <MaterialIcon name="star" size="sm" filled />
                    4.8
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-extrabold tracking-tight mb-4">
                  {post.title}
                </h1>

                {/* Content */}
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 mt-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 group">
                  <MaterialIcon
                    name="favorite"
                    className="text-red-500"
                    filled
                  />
                  <span className="text-sm font-bold">
                    {post.likeCount || 0}
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="reviews" className="text-gray-500" />
                  <span className="text-sm font-bold">Reviews</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg"
                >
                  <MaterialIcon name="edit" size="lg" />
                </button>
                <button className="flex items-center justify-center text-gray-500 hover:text-primary">
                  <MaterialIcon name="bookmark" />
                </button>
              </div>
            </div>

            </>
        )}

        {/* Review Section */}
        {!isEditing && (
          <div className="px-4 pb-8">
            <ReviewSection
              postId={postId}
              creatorAccountId={"0197353d-b73f-7847-ae1c-1f4ff1839b67"}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
