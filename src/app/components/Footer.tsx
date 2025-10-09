import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="site-container h-14 flex items-center justify-between text-sm text-black/70">
        <p>© {year} Power Clean. All rights reserved.</p>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-link underline underline-offset-2 decoration-1 hover:decoration-2">Home</Link>
          <Link href="/post" className="text-link underline underline-offset-2 decoration-1 hover:decoration-2">Posts</Link>
        </nav>
      </div>
    </footer>
  );
}
