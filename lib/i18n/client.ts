"use client";

import { useLanguage } from './language-context';

// Re-export the useLanguage hook as useTranslation for better semantics
export const useTranslation = () => {
  return useLanguage();
};
