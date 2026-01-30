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

    const success = await updatePost({
      id: post.id,
      title,
      content,
      bookInfo,
    });
    if (success) {
      alert("수정 성공!");
      setPost({ ...post, title, content, bookInfo });
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

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-3">Book Information</h3>
                <input
                  className="w-full mb-2 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={bookInfo?.title}
                  onChange={(e) =>
                    setBookInfo({ ...bookInfo, title: e.target.value })
                  }
                  placeholder="Book Title"
                />
                <textarea
                  className="w-full min-h-[80px] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={bookInfo?.content}
                  onChange={(e) =>
                    setBookInfo({ ...bookInfo, content: e.target.value })
                  }
                  placeholder="Book Description"
                />
                <input
                  className="w-full mt-2 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary"
                  value={bookInfo?.link}
                  onChange={(e) =>
                    setBookInfo({ ...bookInfo, link: e.target.value })
                  }
                  placeholder="Book Link"
                />
              </div>

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
            {/* Hero Image */}
            {post.bookInfo?.coverImageUrl && (
              <div className="relative w-full aspect-[3/4]">
                <div
                  className="w-full h-full bg-center bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url(${toAbsoluteUrl(post.bookInfo.coverImageUrl)})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
                </div>
              </div>
            )}

            {/* Floating Content Card */}
            <div className="px-4 -mt-20 relative z-10">
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

                {/* Title & Author */}
                <h1 className="text-2xl font-extrabold tracking-tight mb-1">
                  {post.title}
                </h1>
                {post.bookInfo?.title && (
                  <h2 className="text-gray-600 dark:text-gray-300 font-medium mb-4">
                    by {post.bookInfo.title}
                  </h2>
                )}

                {/* Genre Tags */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <div className="flex h-7 items-center justify-center rounded-lg bg-primary/20 px-3">
                    <p className="text-primary text-xs font-bold">Book</p>
                  </div>
                  <div className="flex h-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 px-3">
                    <p className="text-gray-600 dark:text-gray-400 text-xs font-bold">
                      Review
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Poster's Perspective */}
            {post.bookInfo?.coverImageUrl && (
              <div className="px-4 mt-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3 px-1">
                  Poster&apos;s Perspective
                </h3>
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800">
                  <Image
                    src={toAbsoluteUrl(post.bookInfo.coverImageUrl)}
                    alt="Book perspective"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

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

            {/* Book Info Section */}
            {post.bookInfo?.content && (
              <div className="px-4 py-6">
                <h3 className="text-lg font-bold mb-3">About the Book</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {post.bookInfo.content}
                </p>
                {post.bookInfo.link && (
                  <a
                    href={post.bookInfo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-primary font-medium text-sm hover:underline"
                  >
                    <MaterialIcon name="link" size="sm" />
                    View on Bookstore
                  </a>
                )}
              </div>
            )}

            {/* Author Info */}
            {post.bookInfo?.authorInfo?.name && (
              <div className="px-4 pb-6">
                <h3 className="text-lg font-bold mb-3">About the Author</h3>
                <div className="bg-gray-50 dark:bg-card-dark rounded-xl p-4">
                  <p className="font-semibold">{post.bookInfo.authorInfo.name}</p>
                  {post.bookInfo.authorInfo.history && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {post.bookInfo.authorInfo.history}
                    </p>
                  )}
                </div>
              </div>
            )}
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
