"use client";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthConfirmModal from "../components/AuthConfirmModal";
import { login } from "@/lib/api";

export default function AuthClient({ redirect = "/" }: { redirect?: string }) {
  const router = useRouter();

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
    <div className="w-full bg-white text-black px-4">
      <div className="w-full max-w-[480px] mx-auto bg-white rounded-2xl border border-black/10 p-6 shadow-lg">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-center pb-1">
          Bookly
        </h1>
        <p className="text-black/60 text-sm font-medium leading-relaxed text-center mb-6">
          Your social gateway to a world of stories and shared discovery.
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
              className="w-full bg-black/5 border border-black/10 rounded-xl h-12 px-4 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-link focus:border-link focus:bg-white transition-all"
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
              className="w-full bg-black/5 border border-black/10 rounded-xl h-12 px-4 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-link focus:border-link focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="flex items-center justify-center rounded-xl h-14 bg-link text-white text-base font-bold w-full shadow-lg shadow-link/30 active:scale-[0.98] transition-all mt-2 disabled:opacity-50"
          >
            {loading ? "처리 중..." : "Sign In"}
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
