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
    <div className="min-h-[80vh] bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="card-padded">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 6h6v28H8V6zm9 0h6v28h-6V6zm9 2h6v24h-6V8z" fill="#000000"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-black mb-1">
              서책의 파도
            </h1>
            <p className="text-text-secondary text-sm">
              Sign in to continue to your library
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full py-3 mt-6 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <button type="button" className="text-sm text-text-secondary hover:text-primary transition">
              Forgot your password?
            </button>
            <div className="flex justify-center gap-6 mt-4 text-xs text-text-secondary">
              <a href="#" className="hover:text-primary transition no-underline">Terms</a>
              <a href="#" className="hover:text-primary transition no-underline">Privacy</a>
              <a href="#" className="hover:text-primary transition no-underline">Support</a>
            </div>
          </div>
        </div>
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
