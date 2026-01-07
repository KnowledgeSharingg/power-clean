"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, uploadImage, getCreatedPostByAI } from "@/lib/api";
import Image from "next/image";
import AIInputPopover from "@/app/components/AIInputPopover";

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
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof typeof prev] as object),
            [keys[1]]: {
              ...(prev[keys[0] as keyof typeof prev] as any)?.[keys[1]],
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
    } catch (err: any) {
      console.error("AI 자동 채우기 실패:", err);
      setAiError(err?.message || "Failed to auto-fill. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // 🔸 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);

      setForm((prev) => ({
        ...prev,
        bookInfo: {
          ...prev.bookInfo,
          coverImageUrl: imageUrl,
        },
      }));
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createPost(form);
    if (success) {
      alert("Post successfully created!");
      router.push("/");
    } else {
      alert("Failed to create post.");
    }
  };

  return (
    <div className="site-container">
      <div className="max-w-3xl mx-auto card-padded">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={isLoadingAI} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="title"
                placeholder="Post Title"
                value={form.title}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="px-2 py-1 rounded border text-sm hover:bg-black/5"
                title="AI Auto-fill"
                onClick={() => setAiOpen(true)}
              >
                ✨
              </button>
            </div>
            <div>
              <textarea
                name="content"
                placeholder="Post Content"
                value={form.content}
                onChange={handleChange}
                required
                rows={6}
              />
            </div>
            <div>
              <input
                type="text"
                name="bookInfo.title"
                placeholder="Book Title"
                value={form.bookInfo.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="bookInfo.content"
                placeholder="Book Summary"
                value={form.bookInfo.content}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="bookInfo.link"
                placeholder="Book Link"
                value={form.bookInfo.link}
                onChange={handleChange}
              />
            </div>
            {/* 🔸 이미지 업로드 필드 */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {form.bookInfo.coverImageUrl && (
                <div className="mt-2">
                  <Image
                    src={form.bookInfo.coverImageUrl || "/default-image.png"}
                    alt="Preview"
                    width={200}
                    height={300}
                    className="rounded-md border border-black/10 object-contain"
                  />
                </div>
              )}
            </div>
            <button type="submit" className="btn">
              Submit
            </button>
          </fieldset>
        </form>
        <AIInputPopover
          open={aiOpen}
          script={aiScript}
          onChange={setAiScript}
          onConfirm={handleAIConfirm}
          onClose={() => setAiOpen(false)}
          isLoading={isLoadingAI}
          error={aiError}
        />
      </div>
    </div>
  );
}
