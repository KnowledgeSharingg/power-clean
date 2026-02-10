"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, uploadImage, getCreatedPostByAI } from "@/lib/api";
import Image from "next/image";
import AIInputPopover from "@/app/components/AIInputPopover";
import MaterialIcon from "@/app/components/MaterialIcon";

export default function CreatePost() {
  const router = useRouter();
  const [aiOpen, setAiOpen] = useState(false);
  const [aiScript, setAiScript] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    creatorAccountId: "123e4567-e89b-12d3-a456-426614174000",
    bookInfo: {
      title: "",
      content: "",
      coverImageUrl: "",
      link: "",
      authorInfo: {
        name: "",
        dateOfBirth: "",
        phoneNumber: "",
        gender: "",
        history: "",
      },
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setForm((prev) => {
      if (keys.length === 1) {
        return { ...prev, [name]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof typeof prev] as object),
            [keys[1]]: value,
          },
        };
      } else if (keys.length === 3) {
        const parentObj = prev[keys[0] as keyof typeof prev] as Record<string, unknown>;
        const nestedObj = parentObj?.[keys[1]] as Record<string, unknown> | undefined;
        return {
          ...prev,
          [keys[0]]: {
            ...parentObj,
            [keys[1]]: {
              ...nestedObj,
              [keys[2]]: value,
            },
          },
        };
      }
      return prev;
    });
  };

  const handleAIConfirm = async () => {
    if (!aiScript.trim()) return;
    setAiError(null);
    setIsLoadingAI(true);
    try {
      const aiData = await getCreatedPostByAI(aiScript.trim());
      setForm((prev) => ({
        ...prev,
        title: aiData.title ?? prev.title,
        content: aiData.content ?? prev.content,
        bookInfo: {
          ...prev.bookInfo,
          title: aiData.bookInfo?.title ?? prev.bookInfo.title,
          content: aiData.bookInfo?.content ?? prev.bookInfo.content,
          link: aiData.bookInfo?.link ?? prev.bookInfo.link,
          coverImageUrl:
            aiData.bookInfo?.coverImageUrl ?? prev.bookInfo.coverImageUrl,
          authorInfo: {
            ...prev.bookInfo.authorInfo,
            history: prev.bookInfo.authorInfo.history,
          },
        },
      }));
      setAiOpen(false);
    } catch (err: unknown) {
      console.error("AI 자동 채우기 실패:", err);
      setAiError(
        err instanceof Error ? err.message : "Failed to auto-fill. Please try again."
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        bookInfo: { ...prev.bookInfo, coverImageUrl: imageUrl },
      }));
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      ...form,
      title: form.bookInfo.title,
      content: form.bookInfo.content,
    };
    const success = await createPost(postData);
    if (success) {
      alert("Post successfully created!");
      router.push("/");
    } else {
      alert("Failed to create post.");
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="content-container py-8">
        <h1 className="text-2xl font-bold text-primary mb-8">Create New Post</h1>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Book Search & AI */}
            <section className="card-padded space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                Book Search
              </h2>
              <input
                className="w-full"
                placeholder="Enter book name..."
                name="bookInfo.title"
                value={form.bookInfo.title}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setAiOpen(true)}
                className="btn-primary w-full py-3 gap-2"
              >
                <MaterialIcon name="auto_awesome" size="sm" />
                AI Auto-Fill Details
              </button>
            </section>

            {/* 2. Book Information */}
            <section className="card-padded space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                Book Information
              </h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Book Title</label>
                <input
                  type="text"
                  name="bookInfo.title"
                  value={form.bookInfo.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Summary / Review</label>
                <textarea
                  className="min-h-[120px] resize-y"
                  placeholder="Share your thoughts about this book..."
                  name="bookInfo.content"
                  value={form.bookInfo.content}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Book Link <span className="text-xs text-text-secondary font-normal">(optional)</span>
                </label>
                <input
                  placeholder="https://goodreads.com/book/..."
                  name="bookInfo.link"
                  value={form.bookInfo.link}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* 3. Book Cover */}
            <section className="card-padded space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                Book Cover Photo
              </h2>
              {form.bookInfo.coverImageUrl ? (
                <div className="relative w-40 aspect-[3/4] rounded-lg overflow-hidden border border-border">
                  <Image
                    src={form.bookInfo.coverImageUrl}
                    alt="Book Cover"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        bookInfo: { ...prev.bookInfo, coverImageUrl: "" },
                      }))
                    }
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black transition"
                  >
                    <MaterialIcon name="close" size="xs" />
                  </button>
                </div>
              ) : (
                <label className="block w-40 aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition cursor-pointer">
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-text-secondary">
                    <MaterialIcon name="add_a_photo" size="lg" />
                    <p className="text-xs">Upload cover</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </section>

            {/* Submit */}
            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="btn flex-1 py-3">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 py-3 gap-2">
                Create Post
                <MaterialIcon name="publish" size="sm" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {aiOpen && (
        <AIInputPopover
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          script={aiScript}
          onChange={setAiScript}
          onConfirm={() => { void handleAIConfirm(); }}
          isLoading={isLoadingAI}
          error={aiError}
        />
      )}
    </div>
  );
}
