'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';

type Template = 'traditional' | 'modern' | 'royal' | 'floral' | 'vintage';

interface CardDetails {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  brideFamily: string;
  groomFamily: string;
  message: string;
}

const templateStyles: Record<Template, { bg: string; border: string; accent: string; font: string; pattern: string }> = {
  traditional: {
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 30%, #F59E0B 100%)',
    border: '3px solid #B45309',
    accent: '#92400E',
    font: "'Playfair Display', serif",
    pattern: 'radial-gradient(circle at 30% 30%, rgba(180,83,9,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(180,83,9,0.1) 0%, transparent 50%)',
  },
  modern: {
    bg: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 50%, #E7E5E4 100%)',
    border: '1px solid #D6D3D1',
    accent: '#1C1917',
    font: "'Inter', sans-serif",
    pattern: 'none',
  },
  royal: {
    bg: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
    border: '3px solid #C7A951',
    accent: '#FDE68A',
    font: "'Playfair Display', serif",
    pattern: 'radial-gradient(circle at 20% 20%, rgba(253,230,138,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(253,230,138,0.1) 0%, transparent 40%)',
  },
  floral: {
    bg: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)',
    border: '2px solid #FDA4AF',
    accent: '#BE123C',
    font: "'Playfair Display', serif",
    pattern: 'radial-gradient(circle at 10% 90%, rgba(190,18,60,0.05) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(190,18,60,0.05) 0%, transparent 40%)',
  },
  vintage: {
    bg: 'linear-gradient(135deg, #FEFCE8 0%, #FEF08A 50%, #FDE047 100%)',
    border: '4px double #854D0E',
    accent: '#713F12',
    font: "'Playfair Display', serif",
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(133,77,14,0.03) 10px, rgba(133,77,14,0.03) 20px)',
  },
};

export default function WeddingCardsPage() {
  const { locale } = useAppStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<Template>('traditional');
  const [step, setStep] = useState<'template' | 'customize' | 'preview'>('template');
  const [details, setDetails] = useState<CardDetails>({
    brideName: locale === 'hi' ? 'प्रिया' : 'Priya',
    groomName: locale === 'hi' ? 'राहुल' : 'Rahul',
    weddingDate: '2026-02-14',
    weddingTime: '7:00 PM',
    venue: locale === 'hi' ? 'ताज पैलेस, नई दिल्ली' : 'Taj Palace, New Delhi',
    brideFamily: locale === 'hi' ? 'श्री और श्रीमती शर्मा' : 'Mr. & Mrs. Sharma',
    groomFamily: locale === 'hi' ? 'श्री और श्रीमती वर्मा' : 'Mr. & Mrs. Verma',
    message: t(locale, 'weddingCards.defaultMessage'),
  });

  const handleDownloadPNG = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null, useCORS: true });
    const link = document.createElement('a');
    link.download = 'wedding-invitation.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('wedding-invitation.pdf');
  };

  const updateField = (key: keyof CardDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const style = templateStyles[template];
  const isTraditional = template === 'traditional';
  const isRoyal = template === 'royal';
  const isFloral = template === 'floral';
  const isVintage = template === 'vintage';
  const textColor = template === 'modern' ? '#1C1917' : isRoyal ? '#FDE68A' : isFloral ? '#881337' : isVintage ? '#422006' : '#92400E';
  const subTextColor = template === 'modern' ? '#57534E' : isRoyal ? '#C4B5FD' : isFloral ? '#BE123C' : isVintage ? '#854D0E' : '#B45309';

  const templates: { key: Template; label: string; desc: string; preview: string }[] = [
    { key: 'traditional', label: t(locale, 'weddingCards.traditional'), desc: t(locale, 'weddingCards.traditionalDesc'), preview: '🕉️' },
    { key: 'modern', label: t(locale, 'weddingCards.modern'), desc: t(locale, 'weddingCards.modernDesc'), preview: '✦' },
    { key: 'royal', label: t(locale, 'weddingCards.royal'), desc: t(locale, 'weddingCards.royalDesc'), preview: '👑' },
    { key: 'floral', label: 'Floral Elegance', desc: 'Soft pastel colors with floral motifs', preview: '🌺' },
    { key: 'vintage', label: 'Vintage Classic', desc: 'Retro borders and sepia tones', preview: '📜' },
  ];

  const formFields: { key: keyof CardDetails; label: string; type?: string }[] = [
    { key: 'brideName', label: t(locale, 'weddingCards.brideName') },
    { key: 'groomName', label: t(locale, 'weddingCards.groomName') },
    { key: 'weddingDate', label: t(locale, 'weddingCards.weddingDate'), type: 'date' },
    { key: 'weddingTime', label: t(locale, 'weddingCards.weddingTime') },
    { key: 'venue', label: t(locale, 'weddingCards.venue') },
    { key: 'brideFamily', label: t(locale, 'weddingCards.brideFamily') },
    { key: 'groomFamily', label: t(locale, 'weddingCards.groomFamily') },
    { key: 'message', label: t(locale, 'weddingCards.message') },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="💍" title={t(locale, 'weddingCards.title')} subtitle={t(locale, 'weddingCards.subtitle')} />

      {/* Steps indicator */}
      <div className="flex items-center gap-4 mb-8">
        {['template', 'customize', 'preview'].map((s, i) => (
          <button key={s} onClick={() => setStep(s as typeof step)} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step === s ? 'gradient-primary text-white shadow-lg' : 'bg-surface-lighter text-text-muted'
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step === s ? 'text-primary-light' : 'text-text-muted'}`}>
              {s === 'template' ? t(locale, 'weddingCards.selectTemplate') : s === 'customize' ? t(locale, 'weddingCards.customize') : t(locale, 'common.preview')}
            </span>
            {i < 2 && <div className="w-8 h-px bg-border hidden sm:block" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'template' && (
          <motion.div key="template" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tmpl) => (
              <motion.div
                key={tmpl.key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setTemplate(tmpl.key); setStep('customize'); }}
                className={`glass rounded-2xl p-6 cursor-pointer transition-all ${template === tmpl.key ? 'ring-2 ring-primary glow' : 'hover:ring-1 hover:ring-primary/30'}`}
              >
                <div className="text-5xl mb-4 text-center">{tmpl.preview}</div>
                <h3 className="text-lg font-bold text-text-primary text-center">{tmpl.label}</h3>
                <p className="text-sm text-text-muted text-center mt-2">{tmpl.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step === 'customize' && (
          <motion.div key="customize" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-text-primary mb-2">{t(locale, 'weddingCards.customize')}</h3>
              {formFields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-text-secondary block mb-1">{field.label}</label>
                  {field.key === 'message' ? (
                    <textarea
                      value={details[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary resize-none"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={details[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('template')} className="flex-1 py-2.5 glass rounded-xl text-text-secondary text-sm font-semibold">
                  {t(locale, 'common.back')}
                </button>
                <button onClick={() => setStep('preview')} className="flex-1 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm">
                  {t(locale, 'common.preview')}
                </button>
              </div>
            </div>

            {/* Mini preview */}
            <div className="flex items-start justify-center">
              <div className="transform scale-75 origin-top">
                <CardPreviewContent ref={previewRef} details={details} style={style} textColor={textColor} subTextColor={subTextColor} isTraditional={isTraditional} isRoyal={isRoyal} isFloral={isFloral} isVintage={isVintage} />
              </div>
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col items-center">
            <CardPreviewContent ref={previewRef} details={details} style={style} textColor={textColor} subTextColor={subTextColor} isTraditional={isTraditional} isRoyal={isRoyal} isFloral={isFloral} isVintage={isVintage} />
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={handleDownloadPNG} className="px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm shadow-lg">
                {t(locale, 'common.downloadPNG')}
              </button>
              <button onClick={handleDownloadPDF} className="px-6 py-2.5 gradient-gold text-white rounded-xl font-semibold text-sm shadow-lg">
                {t(locale, 'common.downloadPDF')}
              </button>
              <button onClick={() => setStep('customize')} className="px-6 py-2.5 glass rounded-xl text-text-secondary text-sm font-semibold">
                ← {t(locale, 'common.back')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { forwardRef } from 'react';

interface CardPreviewProps {
  details: CardDetails;
  style: typeof templateStyles.traditional;
  textColor: string;
  subTextColor: string;
  isTraditional: boolean;
  isRoyal: boolean;
  isFloral: boolean;
  isVintage: boolean;
}

const CardPreviewContent = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ details, style, textColor, subTextColor, isTraditional, isRoyal, isFloral, isVintage }, ref) => {
    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      } catch { return dateStr; }
    };

    return (
      <div
        ref={ref}
        style={{
          background: style.bg,
          border: style.border,
          backgroundImage: style.pattern,
          fontFamily: style.font,
        }}
        className="w-[480px] min-h-[680px] rounded-lg p-10 relative overflow-hidden shadow-2xl"
      >
        {/* Decorative corners */}
        {(isTraditional || isRoyal || isFloral || isVintage) && (
          <>
            <div style={{ color: subTextColor }} className="absolute top-4 left-4 text-3xl opacity-40">{isFloral ? '✻' : isVintage ? '⚜' : '❋'}</div>
            <div style={{ color: subTextColor }} className="absolute top-4 right-4 text-3xl opacity-40">{isFloral ? '✻' : isVintage ? '⚜' : '❋'}</div>
            <div style={{ color: subTextColor }} className="absolute bottom-4 left-4 text-3xl opacity-40">{isFloral ? '✻' : isVintage ? '⚜' : '❋'}</div>
            <div style={{ color: subTextColor }} className="absolute bottom-4 right-4 text-3xl opacity-40">{isFloral ? '✻' : isVintage ? '⚜' : '❋'}</div>
          </>
        )}

        <div className="text-center space-y-5 relative z-10">
          {/* Header ornament */}
          {isTraditional && <div style={{ color: style.accent }} className="text-5xl mb-2">🕉️</div>}
          {isRoyal && <div style={{ color: style.accent }} className="text-5xl mb-2">👑</div>}
          {isFloral && <div style={{ color: style.accent }} className="text-5xl mb-2">🌺</div>}
          {isVintage && <div style={{ color: style.accent }} className="text-5xl mb-2">✦</div>}

          {/* Header */}
          <div style={{ color: subTextColor }} className="text-sm uppercase tracking-[0.3em]">
            {isTraditional ? '|| शुभ विवाह ||' : isRoyal ? '✦ Royal Wedding ✦' : isFloral ? '— Endless Love —' : isVintage ? 'The Grand Union' : '— Wedding Invitation —'}
          </div>

          {/* Message */}
          <p style={{ color: subTextColor }} className="text-xs leading-relaxed max-w-[320px] mx-auto">
            {details.message}
          </p>

          {/* Names */}
          <div className="space-y-2 py-4">
            <p style={{ color: textColor }} className="text-3xl font-bold">{details.brideName}</p>
            <p style={{ color: subTextColor }} className="text-lg">&amp;</p>
            <p style={{ color: textColor }} className="text-3xl font-bold">{details.groomName}</p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3">
            <div style={{ background: subTextColor }} className="h-px w-16 opacity-40" />
            <span style={{ color: subTextColor }} className="text-xs">✦</span>
            <div style={{ background: subTextColor }} className="h-px w-16 opacity-40" />
          </div>

          {/* Date & Time */}
          <div className="space-y-1">
            <p style={{ color: textColor }} className="text-sm font-semibold">{formatDate(details.weddingDate)}</p>
            <p style={{ color: subTextColor }} className="text-sm">{details.weddingTime}</p>
          </div>

          {/* Venue */}
          <div className="py-2">
            <p style={{ color: subTextColor }} className="text-xs uppercase tracking-wider mb-1">Venue</p>
            <p style={{ color: textColor }} className="text-sm font-semibold">{details.venue}</p>
          </div>

          {/* Families */}
          <div className="flex justify-center gap-8 pt-4">
            <div className="text-center">
              <p style={{ color: subTextColor }} className="text-xs mb-1">Bride&apos;s Family</p>
              <p style={{ color: textColor }} className="text-sm font-semibold">{details.brideFamily}</p>
            </div>
            <div className="text-center">
              <p style={{ color: subTextColor }} className="text-xs mb-1">Groom&apos;s Family</p>
              <p style={{ color: textColor }} className="text-sm font-semibold">{details.groomFamily}</p>
            </div>
          </div>

          {/* Footer ornament */}
          {(isTraditional || isRoyal) && (
            <div style={{ color: subTextColor }} className="text-2xl pt-4 opacity-60">
              ❦ ❦ ❦
            </div>
          )}
        </div>
      </div>
    );
  }
);

CardPreviewContent.displayName = 'CardPreviewContent';
