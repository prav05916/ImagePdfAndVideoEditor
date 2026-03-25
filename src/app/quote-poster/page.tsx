'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';

type BgStyle = 'gradient1' | 'gradient2' | 'gradient3' | 'dark' | 'nature' | 'abstract';
type FontStyle = 'serif' | 'sansSerif' | 'handwritten';
type PosterSize = 'square' | 'story' | 'desktop';

const bgStyles: Record<BgStyle, string> = {
  gradient1: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  gradient2: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  gradient3: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
  dark: 'linear-gradient(135deg, #0C0C0C 0%, #1A1A2E 50%, #16213E 100%)',
  nature: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
  abstract: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
};

const fontFamilies: Record<FontStyle, string> = {
  serif: "'Playfair Display', serif",
  sansSerif: "'Inter', sans-serif",
  handwritten: "'Playfair Display', serif",
};

const sizeConfigs: Record<PosterSize, { w: number; h: number; label: string }> = {
  square: { w: 480, h: 480, label: '1:1' },
  story: { w: 360, h: 640, label: '9:16' },
  desktop: { w: 640, h: 360, label: '16:9' },
};

export default function QuotePosterPage() {
  const { locale } = useAppStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [quoteText, setQuoteText] = useState(locale === 'hi' ? 'सपने वो नहीं जो सोते हुए आते हैं, सपने वो हैं जो सोने नहीं देते।' : 'The only way to do great work is to love what you do.');
  const [authorName, setAuthorName] = useState(locale === 'hi' ? 'डॉ. एपीजे अब्दुल कलाम' : 'Steve Jobs');
  const [bgStyle, setBgStyle] = useState<BgStyle>('gradient1');
  const [fontStyle, setFontStyle] = useState<FontStyle>('serif');
  const [posterSize, setPosterSize] = useState<PosterSize>('square');
  const [fontSize, setFontSize] = useState(28);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null });
    const link = document.createElement('a');
    link.download = 'quote-poster.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const size = sizeConfigs[posterSize];
  const bgStyleOptions: { key: BgStyle; label: string; preview: string }[] = [
    { key: 'gradient1', label: 'Purple', preview: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
    { key: 'gradient2', label: 'Pink', preview: 'bg-gradient-to-br from-pink-400 to-rose-500' },
    { key: 'gradient3', label: 'Blue', preview: 'bg-gradient-to-br from-blue-400 to-cyan-400' },
    { key: 'dark', label: 'Dark', preview: 'bg-gradient-to-br from-gray-900 to-slate-800' },
    { key: 'nature', label: 'Nature', preview: 'bg-gradient-to-br from-teal-600 to-green-500' },
    { key: 'abstract', label: 'Warm', preview: 'bg-gradient-to-br from-pink-400 to-yellow-300' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="✍️" title={t(locale, 'quotePoster.title')} subtitle={t(locale, 'quotePoster.subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm text-text-secondary block mb-1">{t(locale, 'quotePoster.quoteText')}</label>
              <textarea value={quoteText} onChange={(e) => setQuoteText(e.target.value)} rows={4}
                className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">{t(locale, 'quotePoster.authorName')}</label>
              <input value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm text-text-secondary block mb-2">{t(locale, 'quotePoster.bgStyle')}</label>
              <div className="grid grid-cols-3 gap-2">
                {bgStyleOptions.map((opt) => (
                  <button key={opt.key} onClick={() => setBgStyle(opt.key)}
                    className={`h-12 rounded-xl ${opt.preview} transition-all ${bgStyle === opt.key ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'}`} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-2">{t(locale, 'quotePoster.fontStyle')}</label>
              <div className="flex gap-2">
                {([['serif', t(locale, 'quotePoster.serif')], ['sansSerif', t(locale, 'quotePoster.sansSerif')]] as [FontStyle, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setFontStyle(key)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      fontStyle === key ? 'gradient-primary text-white' : 'bg-surface-lighter text-text-muted'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-2">{t(locale, 'quotePoster.posterSize')}</label>
              <div className="flex gap-2">
                {([['square', t(locale, 'quotePoster.instagramSquare')], ['story', t(locale, 'quotePoster.instagramStory')], ['desktop', t(locale, 'quotePoster.desktopWallpaper')]] as [PosterSize, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setPosterSize(key)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      posterSize === key ? 'gradient-primary text-white' : 'bg-surface-lighter text-text-muted'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">{t(locale, 'socialMedia.fontSize')}</span>
                <span className="text-text-muted font-mono">{fontSize}px</span>
              </div>
              <input type="range" min={16} max={48} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-lighter accent-primary" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div
              ref={previewRef}
              style={{ background: bgStyles[bgStyle], width: size.w, height: size.h, fontFamily: fontFamilies[fontStyle] }}
              className="rounded-2xl flex flex-col items-center justify-center p-10 text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 max-w-[90%]">
                <div className="text-white/30 text-6xl mb-4">&ldquo;</div>
                <p className="text-white font-bold leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                  {quoteText}
                </p>
                {authorName && (
                  <p className="text-white/70 mt-6 text-sm tracking-wider">— {authorName}</p>
                )}
              </div>
            </div>
          </motion.div>
          <p className="text-text-muted text-xs mt-3">{size.w * 2} × {size.h * 2} px</p>
          <button onClick={handleDownload} className="mt-4 px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm shadow-lg">
            {t(locale, 'common.downloadPNG')}
          </button>
        </div>
      </div>
    </div>
  );
}
