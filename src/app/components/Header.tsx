"use client";

import Link from "next/link";
import { useAuth } from "@/app/auth/useAuth";
import { User } from "lucide-react";

export default function Header() {
  const { isLoggedIn, nickname, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-black/10">
      <div className="site-container flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight text-black">
            Power Clean
          </Link>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-gray-600" />
                {nickname || "User"}
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg bg-black text-white hover:bg-black/80 transition"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="underline underline-offset-2 decoration-1 text-link hover:decoration-2"
            >
              Account
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
