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
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex size-10 items-center justify-start">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center"
            >
              <MaterialIcon name="arrow_back_ios" />
            </button>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Register New Book
          </h2>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        {/* 1. Book Identification */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-text-muted mb-3">
            1. Book Identification
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-[#233648] shadow-sm border border-slate-200 dark:border-transparent overflow-hidden">
              <div className="text-text-muted flex items-center justify-center pl-4">
                <MaterialIcon name="search" />
              </div>
              <input
                className="w-full border-none bg-transparent focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-text-muted px-3"
                placeholder="Enter book name..."
                name="bookInfo.title"
                value={form.bookInfo.title}
                onChange={handleChange}
              />
            </div>
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
            >
              <MaterialIcon name="magic_button" size="lg" />
              <span>AI Auto-Fill Details</span>
            </button>
          </div>
        </div>

        {/* 2. Book Information */}
        <section className="px-4 mt-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-text-muted">
            2. Book Information
          </h3>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5 ml-1">
              Book Title
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark-alt px-4 py-3 text-base font-semibold focus:ring-2 focus:ring-primary focus:border-transparent transition"
              type="text"
              name="bookInfo.title"
              value={form.bookInfo.title}
              onChange={handleChange}
              placeholder="Book title"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5 ml-1">
              Book Summary
            </label>
            <textarea
              className="w-full min-h-[100px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark-alt p-4 text-sm leading-relaxed focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="AI will generate this..."
              name="bookInfo.content"
              value={form.bookInfo.content}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5 ml-1">
              Book Link (Store/Goodreads)
            </label>
            <div className="flex w-full items-stretch rounded-xl bg-white dark:bg-card-dark-alt border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="text-slate-400 flex items-center justify-center pl-4">
                <MaterialIcon name="link" size="sm" />
              </div>
              <input
                className="w-full border-none bg-transparent focus:ring-0 text-sm py-3 px-3"
                placeholder="https://..."
                name="bookInfo.link"
                value={form.bookInfo.link}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* 3. Book Cover Photo */}
        <section className="px-4 mt-8 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-text-muted">
            3. Book Cover Photo
          </h3>
          <div className="relative group">
              {form.bookInfo.coverImageUrl ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700">
                  <Image
                    src={form.bookInfo.coverImageUrl}
                    alt="Book Cover"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <label className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-card-dark-alt flex flex-col items-center justify-center gap-2 cursor-pointer transition hover:border-primary/50">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <MaterialIcon name="add_a_photo" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Upload or snap a photo
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase">
                    Optional
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
          </div>
        </section>
      </main>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>Register & Post</span>
            <MaterialIcon name="publish" />
          </button>
        </div>
      </div>

      {aiOpen && (
        <AIInputPopover
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          script={aiScript}
          onChange={setAiScript}
          onConfirm={() => {
            void handleAIConfirm();
          }}
          isLoading={isLoadingAI}
          error={aiError}
        />
      )}
    </div>
  );
}
