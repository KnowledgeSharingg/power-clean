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
    <div className="max-w-md mx-auto min-h-screen bg-white text-black flex flex-col">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/10">
        <div className="flex items-center p-4 justify-between">
          <div className="flex size-10 items-center justify-start">
            <button className="flex items-center justify-center rounded-lg text-link" title="Back" onClick={() => router.back
