"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/lib/stores/socketContext";


export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith('/dashboard') && !pathname.startsWith('/login') && !pathname.startsWith('/signup');
  const isDashboard = pathname.startsWith('/dashboard');

  // Wrap with SocketProvider only for dashboard routes where messaging is needed
  const content = isDashboard ? (
    <SocketProvider>{children}</SocketProvider>
  ) : (
    children
  );

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">{content}</main>
      {showNavbar && <Footer />}
      <Toaster />
    </div>
  );
}
