"use client";

import { useState, useEffect } from "react";
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
  UserCog,
} from "lucide-react";
import { InvitationNotification } from "@/components/dashboard/invitation-notification";
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

  // Define section IDs as a type for type safety
  type SectionId = 'dashboard' | 'pets' | 'health' | 'communication' | 'settings';
  
  // Initialize with all sections collapsed
  const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>({
    dashboard: false,
    pets: false,
    health: false,
    communication: false,
    settings: false,
  });

  // Toggle function that ensures only one section is expanded at a time
  const toggleSection = (section: SectionId) => {
    setExpandedSections(prev => {
      // Create a new state with all sections collapsed
      const newState: Record<SectionId, boolean> = {
        dashboard: false,
        pets: false,
        health: false,
        communication: false,
        settings: false,
      };
      
      // If the clicked section was already expanded, leave all collapsed
      // Otherwise, expand only the clicked section
      if (!prev[section]) {
        newState[section] = true;
      }
      
      return newState;
    });
  };

  // Auto-expand the section containing the active route
  useEffect(() => {
    // Find which section contains the current path
    const findActiveSection = (): SectionId | null => {
      for (const section of navigationSections) {
        if (section.items.some(item => pathname === item.href)) {
          return section.id;
        }
      }
      return null;
    };
    
    const activeSection = findActiveSection();
    if (activeSection) {
      setExpandedSections(prev => {
        // Only update if the active section isn't already expanded
        if (!prev[activeSection]) {
          const newState: Record<SectionId, boolean> = {
            dashboard: false,
            pets: false,
            health: false,
            communication: false,
            settings: false,
          };
          newState[activeSection] = true;
          return newState;
        }
        return prev;
      });
    }
  }, [pathname]);

  // Define the navigation section type
  type NavigationSection = {
    id: SectionId;
    title: string;
    icon: React.ElementType;
    color: string;
    items: Array<{
      href: string;
      label: string;
      icon: React.ElementType;
      petIcon: React.ElementType;
      color: string;
    }>;
  };

  const navigationSections: NavigationSection[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Home,
      color: "amber",
      items: [
        {
          href: "/dashboard",
          label: t("navigation.home"),
          icon: Home,
          petIcon: Dog,
          color: "amber",
        },
        {
          href: "/dashboard/analytics",
          label: t("navigation.analytics"),
          icon: BarChart,
          petIcon: PawPrint,
          color: "purple",
        },
      ],
    },
    {
      id: "pets",
      title: "Pets",
      icon: PawPrint,
      color: "pink",
      items: [
        {
          href: "/dashboard/pets",
          label: "Pets Dashboard",
          icon: PawPrint,
          petIcon: Dog,
          color: "pink",
        },
        {
          href: "/dashboard/add-pet",
          label: "Add Pet",
          icon: Plus,
          petIcon: Cat,
          color: "orange",
        },
      ],
    },
    {
      id: "health",
      title: "Health & Care",
      icon: Shield,
      color: "green",
      items: [
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
          href: "/dashboard/emergency",
          label: t("navigation.emergency"),
          icon: AlertTriangle,
          petIcon: PawPrint,
          color: "red",
        },
      ],
    },
    {
      id: "communication",
      title: "Communication",
      icon: MessageSquare,
      color: "teal",
      items: [
        {
          href: "/dashboard/messages",
          label: t("navigation.messages"),
          icon: MessageSquare,
          petIcon: Cat,
          color: "teal",
        },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: UserCog,
      color: "gray",
      items: [
        {
          href: "/dashboard/profile",
          label: t("navigation.profile") || "Profile",
          icon: UserCog,
          petIcon: Dog,
          color: "pink",
        },
      ],
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
            <div className="flex items-center justify-between w-full">
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
              <div>
                <InvitationNotification />
              </div>
            </div>
          </motion.div>

          <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200">
            {navigationSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              // Use type assertion to fix TypeScript error
              const isExpanded = expandedSections[section.id as SectionId];
              const sectionColor = section.color;
              
              return (
                <div key={section.id} className="space-y-1">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors border shadow-sm ${
                        `bg-${sectionColor}-50/50 text-${sectionColor}-800 hover:bg-${sectionColor}-100/50 border-${sectionColor}-100/50`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md shadow-sm bg-gradient-to-br from-${sectionColor}-100 to-${sectionColor}-200`}>
                          <SectionIcon className={`w-4 h-4 text-${sectionColor}-600`} />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {section.title}
                        </span>
                        {section.id === 'pets' && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-medium text-amber-600">
                            {section.items.length}
                          </div>
                        )}
                      </div>
                      <div 
                        className={`transform transition-all duration-300 ${isExpanded ? `rotate-90 text-${sectionColor}-600` : 'text-gray-400'}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </motion.div>
                  
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`mt-2 ml-3 space-y-1.5 pl-1 border-l border-${sectionColor}-200/50`}
                    >
                      {section.items.map((item, index) => {
                        const Icon = item.icon;
                        const PetIcon = item.petIcon;
                        const isActive = pathname === item.href;
                        const itemColor = item.color;
                        const colorClass = `${itemColor}-${isActive ? "600" : "500"}`;

                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ x: 3 }}
                          >
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className={`w-full justify-start gap-3 h-9 rounded-md relative overflow-hidden ${
                                isActive
                                  ? `bg-gradient-to-r from-${itemColor}-50 to-${itemColor}-100 text-${itemColor}-700 shadow-sm`
                                  : `hover:bg-${itemColor}-50/50 text-gray-600 hover:text-${itemColor}-600`
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
                                    className={`w-3.5 h-3.5 ${
                                      isActive ? `text-${colorClass}` : "text-gray-500"
                                    }`}
                                  />
                                </div>
                              </div>

                              <span className="font-medium text-sm">{item.label}</span>

                              {isActive && (
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 0.1 }}
                                  className="absolute right-2"
                                >
                                  <PetIcon className="w-5 h-5" />
                                </motion.div>
                              )}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
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
