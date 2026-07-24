'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { useState, useEffect } from 'react';

const tools = [
  {
    key: 'nav.imageEditor',
    href: '/image-editor',
    icon: '🖼️',
    color: 'from-indigo-500 to-purple-600',
    desc: 'Add text, watermarks, stickers & tune colors professionally.',
    tag: 'PRO',
    tagColor: 'from-blue-500 to-indigo-500',
  },
  {
    key: 'nav.bgRemover',
    href: '/background-remover',
    icon: '✂️',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Instant AI-powered background removal — one click, done.',
    tag: 'FREE',
    tagColor: 'from-green-500 to-emerald-500',
  },
  {
    key: 'nav.weddingCards',
    href: '/wedding-cards',
    icon: '💍',
    color: 'from-amber-500 to-orange-600',
    desc: 'Beautifully crafted Indian wedding invitation templates.',
    tag: 'FREE',
    tagColor: 'from-green-500 to-emerald-500',
  },
  {
    key: 'nav.invitationMaker',
    href: '/invitation-maker',
    icon: '🎉',
    color: 'from-pink-500 to-rose-600',
    desc: 'Create stunning invitations for birthdays, engagements & more.',
    tag: 'PRO',
    tagColor: 'from-blue-500 to-indigo-500',
  },
  {
    key: 'nav.quotePoster',
    href: '/quote-poster',
    icon: '✍️',
    color: 'from-violet-500 to-fuchsia-600',
    desc: 'Design inspiring, highly shareable quote posters.',
    tag: 'FREE',
    tagColor: 'from-green-500 to-emerald-500',
  },
  {
    key: 'nav.passportMaker',
    href: '/passport-maker',
    icon: '🛂',
    color: 'from-blue-600 to-indigo-800',
    desc: 'AI-processed passport & ID photos meeting govt. standards.',
    tag: 'PRO',
    tagColor: 'from-blue-500 to-indigo-500',
  },
  {
    key: 'nav.resumeEnhancer',
    href: '/resume-enhancer',
    icon: '🧾',
    color: 'from-slate-500 to-gray-700',
    desc: 'ATS-optimized resume builder with AI-powered enhancements.',
    tag: 'PRO',
    tagColor: 'from-blue-500 to-indigo-500',
  },
  {
    key: 'nav.socialMedia',
    href: '/social-media',
    icon: '📸',
    color: 'from-cyan-500 to-blue-600',
    desc: 'Generate beautiful social media posts for Instagram & more.',
    tag: 'FREE',
    tagColor: 'from-green-500 to-emerald-500',
  },
  {
    key: 'nav.videoEditor',
    href: '/video-editor',
    icon: '🎬',
    color: 'from-blue-500 to-indigo-600',
    desc: 'Timeline editing, merge clips & apply 20+ professional filters.',
    tag: 'FREE',
    tagColor: 'from-green-500 to-emerald-500',
  },
];

const trustBadges = [
  { icon: '🔒', label: 'Privacy First', sub: 'Files never stored' },
  { icon: '⚡', label: 'Instant Results', sub: 'No waiting, no queue' },
  { icon: '🚫', label: 'No Signup', sub: 'Start immediately' },
  { icon: '🌐', label: 'Hindi & English', sub: 'Bilingual support' },
];

const greetings = [
  "Welcome back! Let's create something amazing today. 👋",
  "Ready to design? Your next masterpiece starts here. ✨",
  "Good to have you here! What will you build today? 🚀",
  "Your creative studio awaits. Let's make it beautiful. 🎨",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { locale } = useAppStore();
  const [greeting, setGreeting] = useState('');
  const [typedText, setTypedText] = useState('');
  const [filterTag, setFilterTag] = useState<'ALL' | 'FREE' | 'PRO'>('ALL');

  useEffect(() => {
    const g = greetings[Math.floor(Date.now() / 86400000) % greetings.length];
    setGreeting(g);
    let i = 0;
    const timer = setInterval(() => {
      setTypedText(g.slice(0, i + 1));
      i++;
      if (i >= g.length) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, []);

  const filteredTools = tools.filter(tool => filterTag === 'ALL' || tool.tag === filterTag);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-8 sm:p-12"
      >
        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 right-12 w-52 h-52 rounded-full bg-white/10 blur-3xl animate-float" />
          <div className="absolute bottom-4 left-16 w-40 h-40 rounded-full bg-white/10 blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-white/5 blur-xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 max-w-2xl">
          {/* Greeting typewriter */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-bold bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/10">
              🎯 All-in-One Design Platform
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight min-h-[3.5rem]">
            {typedText}<span className="animate-pulse">|</span>
          </h1>
          <p className="text-white/75 text-base sm:text-lg mb-6 leading-relaxed">
            Edit images, create wedding cards, remove backgrounds with AI, build your resume, make passport photos and more — all <span className="text-white font-bold">completely free</span>, no signup needed.
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap gap-3">
            <Link href="/image-editor" className="px-6 py-2.5 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm">
              🖼️ Start Editing Free
            </Link>
            <Link href="/resume-enhancer" className="px-6 py-2.5 bg-white/15 backdrop-blur text-white font-bold rounded-xl border border-white/20 hover:bg-white/25 transition-all text-sm">
              🧾 Build Resume
            </Link>
          </div>
        </div>

        {/* Floating tool bubbles decoration */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 opacity-70">
          {['🖼️', '✂️', '💍', '🧾', '🛂'].map((icon, i) => (
            <motion.div
              key={i}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/10 shadow-lg"
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── TRUST BADGES ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {trustBadges.map((badge, i) => (
          <motion.div
            key={i}
            variants={item}
            className="glass rounded-2xl p-4 flex items-center gap-3 hover:glow transition-shadow duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
              {badge.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-text-primary">{badge.label}</div>
              <div className="text-[11px] text-text-muted">{badge.sub}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── TOOLS SECTION ── */}
      <div>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{t(locale, 'dashboard.quickActions')}</h2>
            <p className="text-text-muted text-sm mt-0.5">Pick a tool and start creating — most are completely free</p>
          </div>
          {/* Filter tabs */}
          <div className="flex bg-surface-lighter border border-border rounded-xl overflow-hidden text-xs font-bold">
            {(['ALL', 'FREE', 'PRO'] as const).map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 transition-colors ${filterTag === tag ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                {tag === 'FREE' ? '✓ Free' : tag === 'PRO' ? '⚡ Pro' : 'All'}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
        >
          {filteredTools.map(tool => (
            <motion.div key={tool.href} variants={item} layout>
              <Link href={tool.href}>
                <div className="relative glass bg-white/5 dark:bg-black/20 rounded-2xl p-5 sm:p-6 transition-all duration-300 group cursor-pointer hover:bg-white/10 dark:hover:bg-black/40 hover:-translate-y-1 hover:shadow-2xl border border-border overflow-hidden h-full flex flex-col min-h-[180px]">
                  {/* Ambient glow on hover */}
                  <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${tool.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Tag */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-gradient-to-r ${tool.tagColor} text-white shadow-sm`}>
                      {tool.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg relative z-10`}>
                    {tool.icon}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-text-primary mb-1.5 relative z-10 group-hover:text-primary-light transition-colors">
                    {t(locale, tool.key)}
                  </h3>

                  <p className="text-xs text-text-muted flex-1 relative z-10 leading-relaxed">
                    {tool.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary-light opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 relative z-10">
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

      {/* ── WHY CHOOSE US ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Why thousands trust ShivanshStudio</h2>
          <p className="text-text-muted text-sm max-w-xl mx-auto">We built this platform to be the best free creative tool for Indian users — no subscriptions, no hidden costs.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '🧠',
              title: 'AI-Powered Tools',
              desc: 'Background remover, ATS resume scanner, and smart image tools all powered by advanced AI.',
            },
            {
              icon: '🇮🇳',
              title: 'Built for India',
              desc: 'Hindi & English support, Indian wedding templates, government photo standards, and rupee-first pricing.',
            },
            {
              icon: '🔓',
              title: 'No Lock-in',
              desc: 'Most tools are completely free. No account required. Your files stay on your device — we never store them.',
            },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl bg-surface-lighter border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-text-primary mb-2">{f.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── QUICK STATS ── */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Design Tools', value: '9+', icon: '📐', sub: 'And growing' },
          { label: 'Templates', value: '100+', icon: '🎨', sub: 'Ready to use' },
          { label: 'Free Tools', value: '7', icon: '💚', sub: 'No cost ever' },
          { label: 'Languages', value: '2', icon: '🌍', sub: 'Hindi & English' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            className="glass rounded-2xl p-5 text-center hover:glow transition-shadow duration-300"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs font-bold text-text-primary mt-0.5">{stat.label}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{stat.sub}</div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
