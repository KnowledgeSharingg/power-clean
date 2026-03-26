import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "user-attachments.githubusercontent.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "image.aladin.co.kr" },
      { protocol: "http", hostname: "image.aladin.co.kr" },
      { protocol: "https", hostname: "contents.kyobobook.co.kr" },
    ],
  },
};

export default withNextIntl(nextConfig);
