"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const imageUrl = await res.text(); // 서버가 String 반환 시
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
    <div className="container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="content"
            placeholder="Post Content"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="bookInfo.title"
            placeholder="Book Title"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="bookInfo.content"
            placeholder="Book Summary"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="bookInfo.link"
            placeholder="Book Link"
            onChange={handleChange}
          />
        </div>
        {/* 🔸 이미지 업로드 필드 */}
        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.bookInfo.coverImageUrl && (
            <div style={{ marginTop: "8px" }}>
              <Image
                src={form.bookInfo.coverImageUrl || "/default-image.png"}
                alt="Preview"
                width={200}
                height={300}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
}
