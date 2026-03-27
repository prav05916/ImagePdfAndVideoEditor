'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';

type EventType = 'birthday' | 'engagement' | 'babyShower' | 'housewarming' | 'anniversary';

interface EventDetails {
  personName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  hostName: string;
  specialMessage: string;
  age: string;
}

const eventStyles: Record<EventType, { bg: string; emoji: string; accent: string; textColor: string; subColor: string }> = {
  birthday: {
    bg: 'linear-gradient(135deg, #EC4899 0%, #F97316 50%, #EAB308 100%)',
    emoji: '🎂',
    accent: '#FDE68A',
    textColor: '#FFFFFF',
    subColor: 'rgba(255,255,255,0.85)',
  },
  engagement: {
    bg: 'linear-gradient(135deg, #BE185D 0%, #E11D48 50%, #FB7185 100%)',
    emoji: '💍',
    accent: '#FDE68A',
    textColor: '#FFFFFF',
    subColor: 'rgba(255,255,255,0.85)',
  },
  babyShower: {
    bg: 'linear-gradient(135deg, #67E8F9 0%, #A78BFA 50%, #F0ABFC 100%)',
    emoji: '👶',
    accent: '#FFFFFF',
    textColor: '#1E1B4B',
    subColor: 'rgba(30,27,75,0.7)',
  },
  housewarming: {
    bg: 'linear-gradient(135deg, #FDE68A 0%, #D97706 50%, #92400E 100%)',
    emoji: '🏡',
    accent: '#FEF3C7',
    textColor: '#FFFFFF',
    subColor: 'rgba(255,255,255,0.9)',
  },
  anniversary: {
    bg: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 50%, #475569 100%)',
    emoji: '🥂',
    accent: '#F8FAFC',
    textColor: '#0F172A',
    subColor: 'rgba(15,23,42,0.7)',
  },
};

export default function InvitationMakerPage() {
  const { locale } = useAppStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [eventType, setEventType] = useState<EventType>('birthday');
  const [showPreview, setShowPreview] = useState(false);
  const [details, setDetails] = useState<EventDetails>({
    personName: locale === 'hi' ? 'आरव' : 'Aarav',
    eventDate: '2026-04-15',
    eventTime: '5:00 PM',
    eventVenue: locale === 'hi' ? 'गार्डन पैलेस, मुंबई' : 'Garden Palace, Mumbai',
    hostName: locale === 'hi' ? 'शर्मा परिवार' : 'Sharma Family',
    specialMessage: locale === 'hi' ? 'आपकी उपस्थिति हमारे लिए सबसे बड़ा उपहार होगा!' : 'Your presence is the greatest gift!',
    age: '5',
  });

  const updateField = (key: keyof EventDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null });
    const link = document.createElement('a');
    link.download = `${eventType}-invitation.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const style = eventStyles[eventType];
  const eventTypes: { key: EventType; label: string; emoji: string }[] = [
    { key: 'birthday', label: t(locale, 'invitationMaker.birthday'), emoji: '🎂' },
    { key: 'engagement', label: t(locale, 'invitationMaker.engagement'), emoji: '💍' },
    { key: 'babyShower', label: t(locale, 'invitationMaker.babyShower'), emoji: '👶' },
    { key: 'housewarming', label: 'Housewarming', emoji: '🏡' },
    { key: 'anniversary', label: 'Anniversary', emoji: '🥂' },
  ];

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); } catch { return dateStr; }
  };

  const headingText: Record<EventType, string> = {
    birthday: locale === 'hi' ? 'जन्मदिन की पार्टी!' : 'Birthday Party!',
    engagement: locale === 'hi' ? 'सगाई समारोह' : 'Engagement Ceremony',
    babyShower: locale === 'hi' ? 'बेबी शावर' : 'Baby Shower',
    housewarming: locale === 'hi' ? 'गृह प्रवेश' : 'Housewarming',
    anniversary: locale === 'hi' ? 'विवाह वर्षगांठ' : 'Anniversary',
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="🎉" title={t(locale, 'invitationMaker.title')} subtitle={t(locale, 'invitationMaker.subtitle')} />

      {/* Event Type Selector */}
      <div className="flex gap-3 mb-8">
        {eventTypes.map((et) => (
          <button
            key={et.key}
            onClick={() => setEventType(et.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              eventType === et.key ? 'gradient-primary text-white shadow-lg scale-105' : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="text-xl">{et.emoji}</span>
            {et.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-text-primary">{t(locale, 'weddingCards.customize')}</h3>
          {[
            { key: 'personName' as const, label: t(locale, 'invitationMaker.personName') },
            ...(eventType === 'birthday' ? [{ key: 'age' as const, label: t(locale, 'invitationMaker.age') }] : []),
            { key: 'eventDate' as const, label: t(locale, 'invitationMaker.eventDate'), type: 'date' },
            { key: 'eventTime' as const, label: t(locale, 'invitationMaker.eventTime') },
            { key: 'eventVenue' as const, label: t(locale, 'invitationMaker.eventVenue') },
            { key: 'hostName' as const, label: t(locale, 'invitationMaker.hostName') },
            { key: 'specialMessage' as const, label: t(locale, 'invitationMaker.specialMessage') },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm text-text-secondary block mb-1">{field.label}</label>
              {field.key === 'specialMessage' ? (
                <textarea value={details[field.key]} onChange={(e) => updateField(field.key, e.target.value)} rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary resize-none" />
              ) : (
                <input type={('type' in field && field.type) || 'text'} value={details[field.key]} onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary" />
              )}
            </div>
          ))}
          <button onClick={() => setShowPreview(true)} className="w-full py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm">
            {t(locale, 'common.preview')} →
          </button>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div key={eventType} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[420px]">
              <div
                ref={previewRef}
                style={{ background: style.bg }}
                className="w-full aspect-[3/4] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
              >
                {/* Decorative circles */}
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/10 blur-xl" />
                <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full bg-white/10 blur-xl" />

                <div className="relative z-10 space-y-4">
                  <div className="text-6xl">{style.emoji}</div>
                  <p style={{ color: style.subColor }} className="text-sm uppercase tracking-[0.2em]">You&apos;re Invited!</p>
                  <h2 style={{ color: style.textColor, fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold">
                    {headingText[eventType]}
                  </h2>
                  <p style={{ color: style.accent }} className="text-4xl font-extrabold">
                    {details.personName}
                    {eventType === 'birthday' && details.age ? ` — ${details.age}` : ''}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div style={{ background: style.subColor }} className="h-px w-12" />
                    <span style={{ color: style.subColor }}>✦</span>
                    <div style={{ background: style.subColor }} className="h-px w-12" />
                  </div>
                  <p style={{ color: style.textColor }} className="text-sm font-semibold">{formatDate(details.eventDate)}</p>
                  <p style={{ color: style.subColor }} className="text-sm">{details.eventTime}</p>
                  <p style={{ color: style.textColor }} className="text-sm font-semibold">{details.eventVenue}</p>
                  <p style={{ color: style.subColor }} className="text-xs italic mt-4 max-w-[280px] mx-auto">{details.specialMessage}</p>
                  <p style={{ color: style.subColor }} className="text-xs mt-2">— {details.hostName}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-3 mt-4">
            <button onClick={handleDownload} className="px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm shadow-lg">
              {t(locale, 'common.downloadPNG')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
