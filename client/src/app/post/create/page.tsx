"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createPost, uploadImage, getCreatedPostByAI } from "@/lib/api";
import AIInputPopover from "@/app/components/AIInputPopover";
import MaterialIcon from "@/app/components/MaterialIcon";
import TagInput from "@/app/components/TagInput";

export default function CreatePost() {
  const router = useRouter();
  const t = useTranslations("createPost");
  const tc = useTranslations("common");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiScript, setAiScript] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
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
      console.error("AI auto-fill failed:", err);
      setAiError(
        err instanceof Error ? err.message : t("aiFillFailed")
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
      console.error("Image upload failed:", error);
      alert(t("imageUploadFailed"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      ...form,
      title: form.bookInfo.title,
      content: form.bookInfo.content,
      tags,
    };
    const success = await createPost(postData);
    if (success) {
      alert(t("postCreated"));
      router.push("/");
    } else {
      alert(t("postFailed"));
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="content-container py-8">
        <h1 className="text-2xl font-bold text-primary mb-8">{t("title")}</h1>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Book Search & AI */}
            <section className="card-padded space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                {t("bookSearch")}
              </h2>
              <input
                className="w-full"
                placeholder={t("bookNamePlaceholder")}
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
                {t("aiAutoFill")}
              </button>
            </section>

            {/* 2. Book Information */}
            <section className="card-padded space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                {t("bookInformation")}
              </h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("bookTitle")}</label>
                <input
                  type="text"
                  name="bookInfo.title"
                  value={form.bookInfo.title}
                  onChange={handleChange}
                  placeholder={t("bookTitlePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("summaryReview")}</label>
                <textarea
                  className="min-h-[120px] resize-y"
                  placeholder={t("summaryPlaceholder")}
                  name="bookInfo.content"
                  value={form.bookInfo.content}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t("bookLink")} <span className="text-xs text-text-secondary font-normal">{t("bookLinkOptional")}</span>
                </label>
                <input
                  placeholder={t("bookLinkPlaceholder")}
                  name="bookInfo.link"
                  value={form.bookInfo.link}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* 3. Book Cover */}
            <section className="card-padded space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                {t("bookCoverPhoto")}
              </h2>
              {form.bookInfo.coverImageUrl ? (
                <div className="relative w-40 aspect-[3/4] rounded-lg overflow-hidden border border-border">
                  <img
                    src={form.bookInfo.coverImageUrl}
                    alt={t("bookCoverPhoto")}
                    className="absolute inset-0 w-full h-full object-cover"
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
                    <p className="text-xs">{t("uploadCover")}</p>
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

            {/* 4. Tags */}
            <section className="card-padded space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                {t("tags")}
              </h2>
              <TagInput tags={tags} onChange={setTags} />
            </section>

            {/* Submit */}
            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="btn flex-1 py-3">
                {tc("cancel")}
              </button>
              <button type="submit" className="btn-primary flex-1 py-3 gap-2">
                {t("createPost")}
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
