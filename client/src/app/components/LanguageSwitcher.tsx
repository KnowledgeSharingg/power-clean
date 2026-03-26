"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setLocale } from "@/i18n/locale";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();

  const handleSwitch = async () => {
    const next = locale === "ko" ? "en" : "ko";
    await setLocale(next);
    router.refresh();
  };

  return (
    <button
      onClick={handleSwitch}
      className="text-sm text-black/70 hover:text-primary transition-colors px-2 py-1 rounded"
      title={t("switchLanguage")}
    >
      {locale === "ko" ? "EN" : "KO"}
    </button>
  );
}
