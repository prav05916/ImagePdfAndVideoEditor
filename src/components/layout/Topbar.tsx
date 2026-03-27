'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function Topbar() {
  const { locale, setLocale, toggleSidebar } = useAppStore();

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-surface-lighter/50 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page title spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="relative flex items-center glass-light rounded-full p-1">
            <button
              onClick={() => setLocale('en')}
              className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
                locale === 'en' ? 'text-white' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {locale === 'en' && (
                <motion.div
                  layoutId="langToggle"
                  className="absolute inset-0 gradient-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t(locale, 'common.english')}</span>
            </button>
            <button
              onClick={() => setLocale('hi')}
              className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
                locale === 'hi' ? 'text-white' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {locale === 'hi' && (
                <motion.div
                  layoutId="langToggle"
                  className="absolute inset-0 gradient-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t(locale, 'common.hindi')}</span>
            </button>
          </div>

          {/* User avatar */}
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform shadow-lg">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
