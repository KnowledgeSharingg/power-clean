"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import AuthConfirmModal from "../components/AuthConfirmModal";
import { login } from "@/lib/api";

export default function AuthClient({ redirect = "/" }: { redirect?: string }) {
  const router = useRouter();
  const t = useTranslations();
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
              <Image
                src="/logo.png"
                alt={t("common.appName")}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-black mb-1">
              {t("common.appName")}
            </h1>
            <p className="text-text-secondary text-sm">
              {t("auth.tagline")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">
                {t("auth.email")}
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">
                {t("auth.password")}
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder={t("auth.passwordPlaceholder")}
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
              {loading ? t("auth.signingIn") : t("auth.signInAction")}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <button type="button" className="text-sm text-text-secondary hover:text-primary transition">
              {t("auth.forgotPassword")}
            </button>
            <div className="flex justify-center gap-6 mt-4 text-xs text-text-secondary">
              <a href="#" className="hover:text-primary transition no-underline">{t("auth.terms")}</a>
              <a href="#" className="hover:text-primary transition no-underline">{t("auth.privacy")}</a>
              <a href="#" className="hover:text-primary transition no-underline">{t("auth.support")}</a>
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
