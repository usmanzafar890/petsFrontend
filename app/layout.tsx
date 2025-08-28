import type React from "react";
import "./globals.css";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { LanguageProvider } from "@/lib/i18n/language-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body>
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.app",
};
