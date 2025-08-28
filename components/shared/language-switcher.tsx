"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Button } from "@/components/ui/button";
import { Check, Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Use translated language names from translations
  const languageNames: Record<string, string> = {
    en: t('common.english'),
    de: t('common.german'),
    fr: t('common.french'),
  };

  const languageFlags: Record<string, string> = {
    en: "🇬🇧",
    de: "🇩🇪",
    fr: "🇫🇷",
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-amber-200 bg-white hover:bg-amber-50 text-amber-800"
        >
          <Globe className="h-4 w-4 text-amber-600" />
          <span className="hidden sm:inline">{languageNames[language]}</span>
          <span className="inline sm:hidden">{languageFlags[language]}</span>
          <ChevronDown
            className={`h-4 w-4 text-amber-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-amber-200 w-40">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between ${
              language === lang.code
                ? "bg-amber-100 text-amber-900"
                : "hover:bg-amber-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{languageFlags[lang.code]}</span>
              <span>{languageNames[lang.code]}</span>
            </div>
            {language === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-4 w-4 text-amber-600" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
