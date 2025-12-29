import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "github.com",
      "user-attachments.githubusercontent.com",
      "localhost",
      "127.0.0.1",
      "image.aladin.co.kr",
    ],
  },
};

export default nextConfig;
