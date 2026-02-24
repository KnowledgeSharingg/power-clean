"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/auth/useAuth";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isLoggedIn, nickname, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/library", label: "Library" },
    { href: "/post/create", label: "New Post" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="site-container flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Image
              src="/logo.png"
              alt="서책의 파도"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-lg font-bold text-black tracking-tight hidden sm:inline">
              서책의 파도
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium no-underline transition-colors pb-[17px] pt-[18px] border-b-2 ${
                  pathname === link.href
                    ? "text-primary border-primary"
                    : "text-black/70 border-transparent hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Search + Auth */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden lg:block">
            <input
              type="text"
              placeholder="Search all books..."
              className="w-64 h-9 px-4 text-sm border border-border rounded-full bg-white placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {(nickname || "U").charAt(0).toUpperCase()}
                </button>
                {/* Dropdown */}
                <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm font-medium border-b border-border">
                    {nickname || "User"}
                  </div>
                  <Link href="/library" className="block px-4 py-2 text-sm text-black/70 hover:bg-gray-50 no-underline">
                    My Library
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-black/70 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
