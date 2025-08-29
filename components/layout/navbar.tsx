"use client";

import Link from 'next/link';
import { PawPrint, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useLanguage } from '@/lib/i18n/language-context';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <PawPrint className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">{t('common.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              {t('navigation.about') || 'About'}
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              {t('navigation.pricing') || 'Pricing'}
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              {t('navigation.contact') || 'Contact'}
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link 
              href="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.about') || 'About'}
            </Link>
            <Link 
              href="/pricing" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.pricing') || 'Pricing'}
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.contact') || 'Contact'}
            </Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
