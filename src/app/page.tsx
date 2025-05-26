"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    // <div className="container mx-auto px-4 py-12 text-center">
    //   <p className="text-lg mb-8 text-gray-600">
    //     Share book information and engage in discussions!
    //   </p>
    //   <div className="flex justify-center gap-4">
    //     <button
    //       className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-700 transition duration-200"
    //       onClick={() => router.push("/post/create")}
    //     >
    //       Add Post ➕
    //     </button>
    //     {/* <button
    //       className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow hover:bg-green-600 transition duration-200"
    //       onClick={() => router.push("/post")}
    //     >
    //       View Posts 📄
    //     </button> */}
    //   </div>
    // </div>
    <div className="min-h-screen w-full bg-[#ede4cf] text-[#4b3b2a] font-serif">
      {/* <div className="container mx-auto px-4 py-12 text-center"> */}
      <p className="text-lg mb-8 text-[#5c4033]">
        Share book information and engage in discussions!
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="bg-[#ede4cf] text-white px-6 py-3 rounded-2xl shadow hover:bg-[#6a563f] transition duration-200"
          onClick={() => router.push("/post/create")}
        >
          Add Post ➕
        </button>
        {/* <button
          className="bg-[#557153] text-white px-6 py-3 rounded-2xl shadow hover:bg-[#445f43] transition duration-200"
          onClick={() => router.push("/post")}
        >
          View Posts 
        </button> */}
      </div>
      {/* </div> */}
    </div>
  );
}
