"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Plus,
  Clock,
  Stethoscope,
  Shield,
  AlertTriangle,
  Menu,
  X,
  Home,
  WifiOff,
  LogOut,
  BarChart,
  PawPrint,
  Dog,
  Cat,
  Rabbit,
  Bird,
  Fish,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/stores/auth";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useTranslation } from "@/lib/i18n/client";

interface SidebarProps {
  isOnline: boolean;
}

export function Sidebar({ isOnline }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navigationItems = [
    {
      href: "/dashboard",
      label: t("navigation.home"),
      icon: Home,
      petIcon: Dog,
      color: "amber",
    },
    {
      href: "/dashboard/add-pet",
      label: "Add Pet",
      icon: Plus,
      petIcon: Cat,
      color: "orange",
    },
    {
      href: "/dashboard/schedules",
      label: t("navigation.schedule"),
      icon: Clock,
      petIcon: Rabbit,
      color: "yellow",
    },
    {
      href: "/dashboard/appointments",
      label: "Vet Visits",
      icon: Stethoscope,
      petIcon: Bird,
      color: "blue",
    },
    {
      href: "/dashboard/health",
      label: t("navigation.health"),
      icon: Shield,
      petIcon: Fish,
      color: "green",
    },
    {
      href: "/dashboard/messages",
      label: t("navigation.messages"),
      icon: MessageSquare,
      petIcon: Cat,
      color: "teal",
    },
    {
      href: "/dashboard/emergency",
      label: t("navigation.emergency"),
      icon: AlertTriangle,
      petIcon: PawPrint,
      color: "red",
    },
    {
      href: "/dashboard/analytics",
      label: t("navigation.analytics"),
      icon: BarChart,
      petIcon: PawPrint,
      color: "purple",
    },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      <aside
        className={`
          fixed left-0 top-0 h-full bg-gradient-to-b from-amber-50 to-white z-40 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 w-72 shadow-lg overflow-hidden
        `}
      >
        {/* Decorative paw prints in background */}
        <div className="absolute top-0 right-0 opacity-[0.03] z-0">
          <PawPrint className="w-40 h-40 text-amber-900" />
        </div>
        <div className="absolute bottom-20 left-0 opacity-[0.03] z-0 transform -rotate-12">
          <PawPrint className="w-32 h-32 text-amber-900" />
        </div>

        <div className="flex flex-col h-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-5 border-b border-amber-200"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 opacity-50 blur-md"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                  <PawPrint className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  PetCare
                </h1>
                <div className="flex items-center gap-1.5">
                  <Dog className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-sm text-amber-700">
                    Hi, {user?.name || "Pet Parent"}!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="px-3 pt-5 pb-2">
            <h2 className="text-xs font-semibold text-amber-800/70 uppercase tracking-wider px-3 mb-2">
              Pet Dashboard
            </h2>
          </div>

          <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const PetIcon = item.petIcon;
              const isActive = pathname === item.href;
              const colorClass = `${item.color}-${isActive ? "600" : "500"}`;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-11 rounded-xl relative overflow-hidden ${
                      isActive
                        ? `bg-${item.color}-100 hover:bg-${item.color}-200 text-${item.color}-700`
                        : `hover:bg-${item.color}-50 text-gray-600 hover:text-${item.color}-600`
                    }`}
                    onClick={() => {
                      router.push(item.href);
                      if (window.innerWidth < 768) {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    {isActive && (
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 bg-${colorClass} rounded-r-full`}
                      ></div>
                    )}
                    <div className="relative">
                      {isActive && (
                        <div
                          className={`absolute -inset-1 rounded-full bg-${colorClass} opacity-20 blur-sm`}
                        ></div>
                      )}
                      <div
                        className={`relative p-1.5 rounded-full ${
                          isActive ? `bg-${colorClass}/10` : ""
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? `text-${colorClass}` : "text-gray-500"
                          }`}
                        />
                      </div>
                    </div>

                    <span className="font-medium">{item.label}</span>

                    {isActive && (
                      <div className="absolute right-2 opacity-10">
                        <PetIcon className="w-6 h-6" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-amber-200 mt-auto">
            {!isOnline && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-white bg-gradient-to-r from-red-500 to-red-400 p-2.5 rounded-lg shadow-sm">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline Mode</span>
                </div>
              </motion.div>
            )}
            {/* Language Switcher */}
            <div className="mb-3 w-full">
              <div className="flex justify-start w-full">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-1.5">
                <PawPrint className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-amber-700 font-medium">
                  PetCare v2.0
                </span>
              </div>
              <div className="text-xs text-amber-600/60">©2025</div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 group"
                onClick={handleLogout}
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-20 bg-amber-400 blur-sm transition-opacity"></div>
                  <LogOut className="w-4 h-4 relative" />
                </div>
                <span>{t("navigation.logout")}</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
