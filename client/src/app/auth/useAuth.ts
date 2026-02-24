"use client";
import { useEffect, useState } from "react";
import { getMyInfo, getToken, logout as apiLogout } from "@/lib/api";

export interface MeResponse {
  id: string;
  email: string;
  nickname: string;
  createdAt?: string;
}

export function useAuth() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMe = async () => {
    const token = getToken();
    if (!token) {
      setMe(null);
      setLoading(false);
      return;
    }
    try {
      const data = await getMyInfo();
      setMe(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    const onFocus = () => fetchMe();
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const logout = () => {
    apiLogout();
    setMe(null);
  };

  return {
    isLoggedIn: !!me,
    nickname: me?.nickname || "",
    me,
    loading,
    logout,
  };
}
