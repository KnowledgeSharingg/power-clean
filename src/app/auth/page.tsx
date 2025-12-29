"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthConfirmModal from "../components/AuthConfirmModal";
import { login } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const token = await login({ email, password });
      if (token) {
        router.replace(redirect || "/");
      } else {
        setOpenModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => setOpenModal(false);
  const handleModalSuccess = () => {
    setOpenModal(false);
    router.replace(redirect || "/");
  };

  return (
    <div className="min-h-screen w-full bg-white text-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">내 계정</h1>
        <p className="text-sm text-black/60 mb-6">
          이메일과 비밀번호로 계속 진행하세요.
        </p>
        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90 disabled:opacity-50"
          >
            {loading ? "처리 중..." : "Continue"}
          </button>
        </form>
      </div>

      <AuthConfirmModal
        open={openModal}
        email={email}
        password={password}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
