"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    // 앱 로드 시 토큰이 있으면 내 정보 조회
    fetchMe();
  }, []);

  // 로그인 혹은 이미 로그인된 상태에서 redirect 쿼리가 있으면 원래 페이지로 이동
  useEffect(() => {
    if (me && redirectParam) {
      const target = safeDecode(redirectParam) || "/";
      // replace로 히스토리를 깔끔하게 유지
      router.replace(target);
    }
  }, [me, redirectParam, router]);

  const safeDecode = (value: string) => {
    try {
      const decoded = decodeURIComponent(value);
      // 보안상 내부 경로만 허용
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
    if (!ok) setError("회원가입에 실패했습니다.");
    else alert("회원가입 성공! 로그인 해주세요.");
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const token = await login({ email, password });
    setLoading(false);
    if (!token) {
      setError("로그인에 실패했습니다.");
      return;
    }
    await fetchMe();
    // 로그인 성공 시 redirect 처리
    const target = redirectParam ? safeDecode(redirectParam) : "/";
    router.replace(target);
  };

  const handleUpdateNickname = async () => {
    if (!nickname) return;
    setError(null);
    setLoading(true);
    const ok = await updateNickname(nickname);
    setLoading(false);
    if (!ok) setError("닉네임 변경에 실패했습니다.");
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
            <h3 className="font-bold mb-2">로그인</h3>
            <input
              className="border p-2 w-full mb-2"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              disabled={loading}
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "처리중..." : "로그인"}
            </button>
          </div>

          <div className="border rounded p-3">
            <h3 className="font-bold mb-2">회원가입</h3>
            <input
              className="border p-2 w-full mb-2"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              disabled={loading}
              onClick={handleSignUp}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "처리중..." : "회원가입"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">로그인 완료</p>
            <p>
              <strong>{me.nickname}</strong> ({me.email})
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className="border p-2 rounded"
              placeholder="새 닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              disabled={loading}
              onClick={handleUpdateNickname}
              className="bg-purple-600 text-white px-3 py-2 rounded"
            >
              닉네임 변경
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
