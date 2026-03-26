"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  getMyInfo,
  login,
  logout,
  signUp,
  updateNickname,
} from "@/lib/api";

interface MeResponse {
  id: string;
  email: string;
  nickname: string;
  createdAt?: string;
}

export default function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect") || null;
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    const data = await getMyInfo();
    setMe(data);
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (me && redirectParam) {
      const target = safeDecode(redirectParam) || "/";
      router.replace(target);
    }
  }, [me, redirectParam, router]);

  const safeDecode = (value: string) => {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded.startsWith("/")) return decoded;
      return "/";
    } catch {
      return "/";
    }
  };

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    const ok = await signUp({ email, password, nickname });
    setLoading(false);
    if (!ok) setError(t("auth.signUpFailed"));
    else alert(t("auth.signUpSuccess"));
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const token = await login({ email, password });
    setLoading(false);
    if (!token) {
      setError(t("auth.loginFailed"));
      return;
    }
    await fetchMe();
    const target = redirectParam ? safeDecode(redirectParam) : "/";
    router.replace(target);
  };

  const handleUpdateNickname = async () => {
    if (!nickname) return;
    setError(null);
    setLoading(true);
    const ok = await updateNickname(nickname);
    setLoading(false);
    if (!ok) setError(t("auth.nicknameFailed"));
    await fetchMe();
  };

  const handleLogout = () => {
    logout();
    setMe(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-xl font-semibold mb-3">Auth</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {!me ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <h3 className="font-bold mb-2">{t("auth.signIn")}</h3>
            <input
              className="border p-2 w-full mb-2"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder={t("auth.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              disabled={loading}
              onClick={handleLogin}
              className="bg-link hover:bg-link/90 text-white px-4 py-2 rounded"
            >
              {loading ? t("auth.processing") : t("auth.signInAction")}
            </button>
          </div>

          <div className="border rounded p-3">
            <h3 className="font-bold mb-2">{t("auth.signUp")}</h3>
            <input
              className="border p-2 w-full mb-2"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder={t("auth.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder={t("auth.nickname")}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              disabled={loading}
              onClick={handleSignUp}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? t("auth.processing") : t("auth.signUpAction")}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">{t("auth.loginComplete")}</p>
            <p>
              <strong>{me.nickname}</strong> ({me.email})
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className="border p-2 rounded"
              placeholder={t("auth.newNickname")}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              disabled={loading}
              onClick={handleUpdateNickname}
              className="bg-link hover:bg-link/90 text-white px-3 py-2 rounded"
            >
              {t("auth.updateNickname")}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            >
              {t("common.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
