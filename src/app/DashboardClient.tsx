'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';

const tools = [
  { key: 'nav.videoEditor', href: '/video-editor', icon: '🎬', color: 'from-blue-500 to-indigo-600', desc: 'Timeline editing, merge clips, and apply 20+ pro filters.', tag: 'PRO' },
  { key: 'nav.resumeEnhancer', href: '/resume-enhancer', icon: '🧾', color: 'from-slate-500 to-gray-600', desc: 'ATS optimized resume builder and strict document checker.', tag: 'HOT' },
  { key: 'nav.imageEditor', href: '/image-editor', icon: '🖼️', color: 'from-indigo-500 to-purple-600', desc: 'Add text, watermarks, and tune colors professionally.', tag: 'HOT' },
  { key: 'nav.bgRemover', href: '/background-remover', icon: '✂️', color: 'from-emerald-500 to-teal-600', desc: 'Instant AI-powered background removal.', tag: 'PRO' },
  { key: 'nav.weddingCards', href: '/wedding-cards', icon: '💍', color: 'from-amber-500 to-orange-600', desc: 'Beautifully crafted Indian wedding templates.', tag: 'HOT' },
  { key: 'nav.invitationMaker', href: '/invitation-maker', icon: '🎉', color: 'from-pink-500 to-rose-600', desc: 'Create stunning invitations for any event.', tag: 'HOT' },
  { key: 'nav.socialMedia', href: '/social-media', icon: '📸', color: 'from-cyan-500 to-blue-600', desc: 'Generate engaging social media posts easily.', tag: 'PRO' },
  { key: 'nav.quotePoster', href: '/quote-poster', icon: '✍️', color: 'from-violet-500 to-fuchsia-600', desc: 'Design inspiring and highly shareable quote posters.', tag: 'HOT' },
];

const stats = [
  { labelKey: 'dashboard.totalTools', value: '250+', icon: '📐' },
  { labelKey: 'dashboard.templates', value: '100+', icon: '🎨' },
  { labelKey: 'dashboard.languages', value: '2', icon: '🌍' },
  { labelKey: 'dashboard.freeToUse', value: '✓', icon: '💰' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { locale } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-8 sm:p-12 mb-8"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-20 w-32 h-32 rounded-full bg-white/10 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            {t(locale, 'dashboard.title')}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl">
            {t(locale, 'dashboard.subtitle')}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            className="glass rounded-2xl p-5 text-center hover:glow transition-shadow duration-300"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-muted mt-1">{t(locale, stat.labelKey)}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-primary mb-1">{t(locale, 'dashboard.quickActions')}</h2>
        <p className="text-text-muted text-sm">Select a tool to get started hot or pro</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={item}>
            <Link href={tool.href}>
              <div className="relative glass bg-white/5 dark:bg-black/20 rounded-2xl p-5 sm:p-6 transition-all duration-300 group cursor-pointer hover:bg-white/10 dark:hover:bg-black/40 hover:-translate-y-1 hover:shadow-2xl border border-border overflow-hidden h-full flex flex-col">
                {/* Background ambient glow */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${tool.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                {tool.tag && (
                  <div className="absolute top-4 right-4">
                    <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${tool.tag === 'PRO' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30'}`}>
                      {tool.tag}
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg relative z-10`}>
                  {tool.icon}
                </div>

                <h3 className="font-bold text-sm sm:text-lg text-text-primary mb-2 relative z-10 group-hover:text-primary-light transition-colors">
                  {t(locale, tool.key)}
                </h3>

                <p className="text-xs text-text-muted flex-1 relative z-10 leading-relaxed">
                  {tool.desc}
                </p>

                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary-light opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 relative z-10">
                  <span>Launch Tool</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
