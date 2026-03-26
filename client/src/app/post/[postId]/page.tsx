"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ReviewSection from "@/app/components/ReviewSection";
import {
  getPostDetail,
  updatePost,
  serverUrl,
  toggleLike,
  toggleBookmark,
  getToken,
  getMyInfo,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/app/components/MaterialIcon";
import TagInput from "@/app/components/TagInput";
import { getTimeAgoParams } from "@/lib/timeAgo";

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
    tags?: string[];
    likeCount?: number;
    bookmarkCount?: number;
    likedByMe?: boolean;
    bookmarkedByMe?: boolean;
    creatorAccountId?: string;
  }

  const router = useRouter();
  const t = useTranslations();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [myAccountId, setMyAccountId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
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
        const [postData, myInfo] = await Promise.all([
          getPostDetail(postId),
          getMyInfo(),
        ]);
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setBookInfo(postData.bookInfo);
        setTags(postData.tags || []);
        setLiked(postData.likedByMe || false);
        setBookmarked(postData.bookmarkedByMe || false);
        setLikeCount(postData.likeCount || 0);
        setBookmarkCount(postData.bookmarkCount || 0);
        setMyAccountId(myInfo?.id ?? null);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLikeClick = async () => {
    if (!getToken()) {
      router.push(`/auth?redirect=${encodeURIComponent(`/post/${postId}`)}`);
      return;
    }
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    const success = await toggleLike(postId, prevLiked);
    if (!success) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
    setIsLikeLoading(false);
  };

  const handleBookmarkClick = async () => {
    if (!getToken()) {
      router.push(`/auth?redirect=${encodeURIComponent(`/post/${postId}`)}`);
      return;
    }
    if (isBookmarkLoading) return;
    setIsBookmarkLoading(true);
    const prevBookmarked = bookmarked;
    const prevCount = bookmarkCount;
    setBookmarked(!bookmarked);
    setBookmarkCount(bookmarked ? bookmarkCount - 1 : bookmarkCount + 1);
    const success = await toggleBookmark(postId, prevBookmarked);
    if (!success) {
      setBookmarked(prevBookmarked);
      setBookmarkCount(prevCount);
    }
    setIsBookmarkLoading(false);
  };

  const handleUpdate = async () => {
    if (!post) return;
    const updatedBookInfo = { ...bookInfo, title, content };
    const success = await updatePost({
      id: post.id,
      title,
      content,
      tags,
      bookInfo: updatedBookInfo,
    });
    if (success) {
      alert(t("postDetail.editSuccess"));
      setPost({ ...post, title, content, bookInfo: updatedBookInfo, tags });
      setBookInfo(updatedBookInfo);
      setIsEditing(false);
    } else {
      alert(t("postDetail.editFailed"));
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const timeParams = getTimeAgoParams(post.createdAt);
  const timeAgo = timeParams.key === "fallback"
    ? timeParams.fallbackDate!
    : t(`time.${timeParams.key}`, timeParams.values);

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="site-container py-8">
        {isEditing ? (
          /* Edit Mode */
          <div className="max-w-3xl mx-auto">
            <div className="card-padded space-y-6">
              <h2 className="text-xl font-bold">{t("postDetail.editPost")}</h2>
              <div>
                <label className="block text-sm font-medium mb-2">{t("postDetail.title")}</label>
                <input
                  className="w-full text-lg font-bold"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("postDetail.titlePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("postDetail.content")}</label>
                <textarea
                  className="w-full min-h-[200px] resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("postDetail.contentPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("postDetail.tags")}</label>
                <TagInput tags={tags} onChange={setTags} />
              </div>
              <div className="flex gap-3 pt-4">
                <button className="btn-primary flex-1 py-3" onClick={handleUpdate}>
                  {t("postDetail.saveChanges")}
                </button>
                <button className="btn flex-1 py-3" onClick={() => setIsEditing(false)}>
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* TheStoryGraph-style 2-column layout */}
            <div className="grid lg:grid-cols-[280px_1fr_240px] gap-8 lg:gap-12">
              {/* Left Column - Book Cover & Actions */}
              <div className="flex flex-col items-center lg:items-start gap-4">
                {post.bookInfo?.coverImageUrl ? (
                  <div className="relative w-48 lg:w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                    <img
                      src={toAbsoluteUrl(post.bookInfo.coverImageUrl)}
                      alt={t("postCard.cover")}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 lg:w-full aspect-[3/4] rounded-lg bg-gray-100 flex items-center justify-center">
                    <MaterialIcon name="menu_book" size="3xl" className="text-black/20" />
                  </div>
                )}

                {/* Side Actions */}
                {myAccountId && post.creatorAccountId === myAccountId && (
                  <div className="w-full space-y-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn w-full text-sm gap-2"
                    >
                      <MaterialIcon name="edit" size="sm" />
                      {t("postDetail.editPost")}
                    </button>
                  </div>
                )}
              </div>

              {/* Center Column - Main Content */}
              <div className="space-y-6">
                {/* Title & Author */}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {post.title}
                  </h1>
                  <p className="text-text-secondary">{t("common.anonymousUser")} · {timeAgo}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => router.push(`/?tag=${encodeURIComponent(tag)}`)}
                          className="bg-gray-100 text-black text-xs px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="card-padded">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">
                    {t("postDetail.description")}
                  </h2>
                  <p className="text-base leading-relaxed text-black/80">
                    {post.content}
                  </p>
                </div>

                {/* Community Reviews */}
                <div className="card-padded">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
                    {t("postDetail.communityReviews")}
                  </h2>
                  <ReviewSection
                    postId={postId}
                    creatorAccountId={"0197353d-b73f-7847-ae1c-1f4ff1839b67"}
                  />
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="hidden lg:flex flex-col gap-3">
                <button
                  onClick={handleLikeClick}
                  disabled={isLikeLoading}
                  className={`btn w-full text-sm gap-2 ${
                    liked ? "text-red-500 border-red-200 bg-red-50" : ""
                  }`}
                >
                  <MaterialIcon name="favorite" size="sm" filled={liked} />
                  {liked ? t("postDetail.liked") : t("postDetail.like")} ({likeCount})
                </button>

                <button
                  onClick={handleBookmarkClick}
                  disabled={isBookmarkLoading}
                  className={`btn w-full text-sm gap-2 ${
                    bookmarked ? "text-primary border-primary/30 bg-primary-light" : ""
                  }`}
                >
                  <MaterialIcon name="bookmark" size="sm" filled={bookmarked} />
                  {bookmarked ? t("postDetail.bookmarkSaved") : t("postDetail.bookmarkSave")} ({bookmarkCount})
                </button>
              </div>
            </div>

            {/* Mobile Actions (below content on small screens) */}
            <div className="flex lg:hidden gap-3 mt-6 pt-6 border-t border-border">
              <button
                onClick={handleLikeClick}
                disabled={isLikeLoading}
                className={`btn flex-1 text-sm gap-2 ${
                  liked ? "text-red-500 border-red-200 bg-red-50" : ""
                }`}
              >
                <MaterialIcon name="favorite" size="sm" filled={liked} />
                {liked ? t("postDetail.liked") : t("postDetail.like")} ({likeCount})
              </button>
              <button
                onClick={handleBookmarkClick}
                disabled={isBookmarkLoading}
                className={`btn flex-1 text-sm gap-2 ${
                  bookmarked ? "text-primary border-primary/30 bg-primary-light" : ""
                }`}
              >
                <MaterialIcon name="bookmark" size="sm" filled={bookmarked} />
                {bookmarked ? t("postDetail.bookmarkSaved") : t("postDetail.bookmarkSave")} ({bookmarkCount})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
