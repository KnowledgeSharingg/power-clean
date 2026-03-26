"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-border py-8 mt-12">
      <div className="site-container text-center">
        <p className="text-sm text-text-secondary">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
