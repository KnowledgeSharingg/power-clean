"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthConfirmModal from "../components/AuthConfirmModal";
import { login } from "@/lib/api";
import MaterialIcon from "../components/MaterialIcon";

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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-mesh">
      {/* Hero Section with Background */}
      <div className="w-full h-[25vh] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-40"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/60 to-background-dark" />
      </div>

      {/* Logo Section */}
      <div className="relative px-6 flex flex-col items-center -mt-16 z-10">
        <div className="relative mb-6">
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full opacity-60" />
          <div className="relative">
            <div className="w-24 h-24 book-logo-gradient rounded-[2rem] flex items-center justify-center logo-shadow border border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <MaterialIcon
                name="menu_book"
                className="text-white text-6xl"
                filled
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center shadow-lg transform rotate-12">
              <MaterialIcon name="book_4" className="text-primary text-2xl" />
            </div>
          </div>
        </div>
        <h1 className="text-white tracking-tight text-4xl font-bold leading-tight text-center pb-1">
          Bookly
        </h1>
        <p className="text-slate-400 text-sm font-medium leading-relaxed text-center max-w-[280px]">
          Your social gateway to a world of stories and shared discovery.
        </p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleContinue}
        className="mt-10 flex-1 flex flex-col px-6 max-w-[480px] mx-auto w-full gap-4"
      >
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="input-field"
            />
          </div>
          <div className="relative group">
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="flex items-center justify-center rounded-xl h-14 bg-primary text-white text-base font-bold w-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all mt-4 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Sign In"}
        </button>

        <div className="flex flex-col items-center gap-6 mt-4">
          <button
            type="button"
            className="text-slate-500 text-sm font-semibold hover:text-slate-300 transition-colors"
          >
            Forgot your password?
          </button>
          <div className="w-full flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
              Secure Literary Access
            </span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="pb-8 pt-8 flex flex-col items-center gap-6">
        <div className="flex justify-center gap-8 px-6">
          <a
            className="text-[11px] text-slate-600 uppercase tracking-widest font-bold hover:text-primary transition-colors"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-[11px] text-slate-600 uppercase tracking-widest font-bold hover:text-primary transition-colors"
            href="#"
          >
            Privacy
          </a>
          <a
            className="text-[11px] text-slate-600 uppercase tracking-widest font-bold hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
        </div>
        <div className="h-1 w-32 bg-white/5 rounded-full mb-2" />
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
