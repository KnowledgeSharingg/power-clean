"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signUp, login } from "@/lib/api";

interface AuthConfirmModalProps {
  open: boolean;
  email: string;
  password: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthConfirmModal({
  open,
  email,
  password,
  onClose,
  onSuccess,
}: AuthConfirmModalProps) {
  const t = useTranslations();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSignUp = async () => {
    if (!nickname.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const ok = await signUp({ email, password, nickname: nickname.trim() });
      if (!ok) {
        setError(t("authConfirm.signUpFailed"));
        return;
      }
      const token = await login({ email, password });
      if (token) {
        onSuccess();
      } else {
        setError(t("authConfirm.signUpSuccessLoginFailed"));
      }
    } catch (e: any) {
      setError(e?.message || t("authConfirm.signUpError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-2">{t("authConfirm.title")}</h2>
        <p className="text-sm text-black/70 mb-4">
          {t("authConfirm.message")}
        </p>
        <div className="space-y-3">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="nickname"
            >
              {t("auth.nickname")}
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t("auth.nicknamePlaceholder")}
              className="w-full bg-black/5 border border-black/10 rounded-xl px-3 py-2 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-link focus:border-link focus:bg-white transition-all"
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-black/10 bg-white text-sm hover:bg-black/5 disabled:opacity-50"
              disabled={loading}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:bg-black/90 disabled:opacity-50"
              disabled={loading || !nickname.trim()}
            >
              {loading ? t("auth.processing") : t("auth.signUpAction")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
