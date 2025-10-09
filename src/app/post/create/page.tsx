"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, uploadImage } from "@/lib/api";
import Image from "next/image";

export default function CreatePost() {
  const router = useRouter();
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
          <div>
            <input
              type="text"
              name="title"
              placeholder="Post Title"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <textarea
              name="content"
              placeholder="Post Content"
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
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="bookInfo.content"
              placeholder="Book Summary"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="bookInfo.link"
              placeholder="Book Link"
              onChange={handleChange}
            />
          </div>
          {/* 🔸 이미지 업로드 필드 */}
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
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
        </form>
      </div>
    </div>
  );
}
