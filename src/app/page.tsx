"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">📚 Power Clean</h1>
      <p className="text-lg mb-8 text-gray-600">
        Share book information and engage in discussions!
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-700 transition duration-200"
          onClick={() => router.push("/post/create")}
        >
          Add Post ➕
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow hover:bg-green-600 transition duration-200"
          onClick={() => router.push("/post")}
        >
          View Posts 📄
        </button>
      </div>
    </div>
  );
}
