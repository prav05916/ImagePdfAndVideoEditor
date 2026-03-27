'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';

type TemplateStyle = 'gradient' | 'minimal' | 'bold' | 'artistic';

const templateConfigs: Record<TemplateStyle, { bg: string; textClass: string; overlayClass: string }> = {
  gradient: {
    bg: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    textClass: 'text-white',
    overlayClass: '',
  },
  minimal: {
    bg: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 100%)',
    textClass: 'text-gray-900',
    overlayClass: '',
  },
  bold: {
    bg: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 50%, #F9CA24 100%)',
    textClass: 'text-white',
    overlayClass: '',
  },
  artistic: {
    bg: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
    textClass: 'text-white',
    overlayClass: '',
  },
};

export default function SocialMediaPage() {
  const { locale } = useAppStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [postText, setPostText] = useState(locale === 'hi' ? 'आज का दिन शानदार है! ✨' : 'Today is amazing! ✨');
  const [hashtags, setHashtags] = useState('#photography #creative #design');
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>('gradient');
  const [fontSize, setFontSize] = useState(24);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null });
    const link = document.createElement('a');
    link.download = 'social-media-post.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const config = templateConfigs[templateStyle];
  const templates: { key: TemplateStyle; label: string }[] = [
    { key: 'gradient', label: t(locale, 'socialMedia.gradient') },
    { key: 'minimal', label: t(locale, 'socialMedia.minimal') },
    { key: 'bold', label: t(locale, 'socialMedia.bold') },
    { key: 'artistic', label: t(locale, 'socialMedia.artistic') },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="📸" title={t(locale, 'socialMedia.title')} subtitle={t(locale, 'socialMedia.subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm text-text-secondary block mb-1">{t(locale, 'socialMedia.postText')}</label>
              <textarea value={postText} onChange={(e) => setPostText(e.target.value)} rows={4}
                className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">{t(locale, 'socialMedia.hashtags')}</label>
              <input value={hashtags} onChange={(e) => setHashtags(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm text-text-secondary block mb-2">{t(locale, 'socialMedia.template')}</label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((tmpl) => (
                  <button key={tmpl.key} onClick={() => setTemplateStyle(tmpl.key)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      templateStyle === tmpl.key ? 'gradient-primary text-white' : 'bg-surface-lighter text-text-muted hover:text-text-secondary'
                    }`}>
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-2">{t(locale, 'socialMedia.fontSize')}: {fontSize}px</label>
              <input type="range" min={16} max={48} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-lighter accent-primary" />
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-2">{t(locale, 'socialMedia.alignment')}</label>
              <div className="flex gap-2">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button key={align} onClick={() => setTextAlign(align)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      textAlign === align ? 'gradient-primary text-white' : 'bg-surface-lighter text-text-muted'
                    }`}>
                    {align === 'left' ? '◀' : align === 'right' ? '▶' : '◆'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[480px]">
            <div
              ref={previewRef}
              style={{ background: config.bg }}
              className="w-full aspect-square rounded-2xl p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
            >
              {templateStyle === 'artistic' && (
                <>
                  <div className="absolute top-[-50px] right-[-50px] w-60 h-60 rounded-full bg-purple-500/20 blur-3xl" />
                  <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
                </>
              )}
              <div className="relative z-10 w-full px-4" style={{ textAlign }}>
                <p className={`${config.textClass} font-bold leading-relaxed whitespace-pre-line`} style={{ fontSize: `${fontSize}px` }}>
                  {postText}
                </p>
                {hashtags && (
                  <p className={`mt-6 text-sm opacity-70 ${config.textClass}`}>
                    {hashtags}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
          <p className="text-text-muted text-xs mt-3">1080 × 1080 px • Instagram Ready</p>
          <button onClick={handleDownload} className="mt-4 px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm shadow-lg">
            {t(locale, 'common.downloadPNG')}
          </button>
        </div>
      </div>
    </div>
  );
}
