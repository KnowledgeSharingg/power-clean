"use client";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </header>
  );
}
