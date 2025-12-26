"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-black/10">
      <div className="site-container flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight text-black">
            Power Clean
          </Link>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/auth"
            className="underline underline-offset-2 decoration-1 text-link hover:decoration-2"
          >
            Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
