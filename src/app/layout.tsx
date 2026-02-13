import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Power Clean Admin",
  description: "Power Clean 관리자 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
