"use client";

import { Suspense } from "react";
import AuthPanel from "../components/AuthPanel";

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full bg-[#ede4cf] text-[#4b3b2a] font-serif flex flex-col items-center py-16 px-4">
      <h1 className="text-2xl font-bold mb-6">내 계정</h1>
      <p className="mb-4 text-sm text-[#5c4033]">로그인, 회원가입, 내 정보 조회 및 닉네임 변경을 여기에서 할 수 있습니다.</p>
      <Suspense fallback={null}>
        <AuthPanel />
      </Suspense>
    </div>
  );
}
