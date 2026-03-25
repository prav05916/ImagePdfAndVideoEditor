'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { key: 'nav.dashboard', href: '/', icon: '🏠' },
  { key: 'nav.imageEditor', href: '/image-editor', icon: '🖼️' },
  { key: 'nav.videoEditor', href: '/video-editor', icon: '🎬' },
  { key: 'nav.weddingCards', href: '/wedding-cards', icon: '💍' },
  { key: 'nav.invitationMaker', href: '/invitation-maker', icon: '🎉' },
  { key: 'nav.socialMedia', href: '/social-media', icon: '📸' },
  { key: 'nav.bgRemover', href: '/background-remover', icon: '✂️' },
  { key: 'nav.quotePoster', href: '/quote-poster', icon: '✍️' },
  { key: 'nav.resumeEnhancer', href: '/resume-enhancer', icon: '🧾' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { locale, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] glass flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
              P
            </div>
            <div>
              <h1 className="font-bold text-lg text-text-primary tracking-tight">
                {t(locale, 'common.appName')}
              </h1>
              <p className="text-xs text-text-muted">{t(locale, 'common.tagline')}</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary/20 text-primary-light'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full gradient-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="text-lg">{item.icon}</span>
                <span>{t(locale, item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="glass-light rounded-xl p-4 text-center">
            <p className="text-xs text-text-muted">PixelCraft Studio v1.0</p>
            <p className="text-xs text-text-muted mt-1">© 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
}
