"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";

export default function CreatePost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    creatorAccountId: "123e4567-e89b-12d3-a456-426614174000",
    bookInfo: {
      title: "",
      content: "",
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
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
}
