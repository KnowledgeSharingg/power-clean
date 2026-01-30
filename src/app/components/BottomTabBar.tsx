"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MaterialIcon from "./MaterialIcon";

interface TabItem {
  icon: string;
  label: string;
  href: string;
}

const tabs: TabItem[] = [
  { icon: "home", label: "Home", href: "/" },
  { icon: "explore", label: "Discover", href: "/discover" },
  { icon: "bookmarks", label: "Library", href: "/library" },
  { icon: "person", label: "Profile", href: "/profile" },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-tab-bar bg-white/80 dark:bg-background-dark/80 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-primary" : "text-slate-400"
            }`}
          >
            <MaterialIcon name={tab.icon} filled={isActive} size="2xl" />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
