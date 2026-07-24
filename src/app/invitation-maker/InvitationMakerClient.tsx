'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';

// Load Razorpay script dynamically
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Handle successful payment redirect (for fallback)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setIsPaid(true);
      alert('Payment successful! You can now download your image.');
    }
    if (query.get('canceled')) {
      alert('Payment was canceled.');
    }
  }, []);

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
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const doDownload = async () => {
    const el = previewRef.current;
    if (!el) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `${eventType}-invitation.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Could not generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    const el = previewRef.current;
    if (!el) return;

    if (isPaid) {
      doDownload();
      return;
    }

    setIsPaying(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load.');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Invitation Card Download',
          amount: 3000, // 3000 paise = ₹30
        }),
      });
      const { orderId, amount, currency, keyId, error } = await res.json();
      if (error) throw new Error(error);

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'ShivanshStudio',
        description: 'Invitation Card Download',
        order_id: orderId,
        handler: function () {
          setIsPaid(true);
          setIsPaying(false);
          alert('Payment successful! Downloading your invitation...');
          doDownload();
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            alert('Payment was canceled.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation failed', err);
      alert('Failed to start payment process.');
      setIsPaying(false);
    }
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
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
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
      <div className="flex flex-wrap gap-2 mb-8">
        {eventTypes.map(et => (
          <button
            key={et.key}
            onClick={() => setEventType(et.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
              eventType === et.key ? 'gradient-primary text-white shadow-lg scale-105' : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="text-lg">{et.emoji}</span>
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
          ].map(field => (
            <div key={field.key}>
              <label className="text-sm text-text-secondary block mb-1">{field.label}</label>
              {field.key === 'specialMessage' ? (
                <textarea
                  value={details[field.key]}
                  onChange={e => updateField(field.key, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary resize-none"
                />
              ) : (
                <input
                  type={('type' in field && field.type) || 'text'}
                  value={details[field.key]}
                  onChange={e => updateField(field.key, e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
                />
              )}
            </div>
          ))}

          {/* Download button in form too */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3 gradient-primary text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating PNG...</>
            ) : (
              <>{t(locale, 'common.downloadPNG')} — Free ↓</>
            )}
          </button>
        </div>

        {/* Preview — always visible, no gate */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider self-start">Live Preview</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={eventType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[400px]"
            >
              <div
                ref={previewRef}
                style={{ background: style.bg }}
                className="w-full aspect-[3/4] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
              >
                {/* Decorative circles */}
                <div className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-[-20px] left-[-20px] w-36 h-36 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

                <div className="relative z-10 space-y-3">
                  <div className="text-6xl drop-shadow-lg">{style.emoji}</div>
                  <p style={{ color: style.subColor }} className="text-xs uppercase tracking-[0.25em] font-semibold">
                    You&apos;re Invited!
                  </p>
                  <h2
                    style={{ color: style.textColor, fontFamily: "'Playfair Display', serif" }}
                    className="text-2xl font-bold leading-tight"
                  >
                    {headingText[eventType]}
                  </h2>
                  <p style={{ color: style.accent }} className="text-3xl font-extrabold drop-shadow">
                    {details.personName}
                    {eventType === 'birthday' && details.age ? ` — ${details.age}` : ''}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div style={{ background: style.subColor }} className="h-px w-10" />
                    <span style={{ color: style.subColor }}>✦</span>
                    <div style={{ background: style.subColor }} className="h-px w-10" />
                  </div>
                  <p style={{ color: style.textColor }} className="text-sm font-semibold">{formatDate(details.eventDate)}</p>
                  <p style={{ color: style.subColor }} className="text-sm">{details.eventTime}</p>
                  <p style={{ color: style.textColor }} className="text-sm font-semibold">{details.eventVenue}</p>
                  <p style={{ color: style.subColor }} className="text-xs italic mt-3 max-w-[260px] mx-auto leading-relaxed">
                    {details.specialMessage}
                  </p>
                  <p style={{ color: style.subColor }} className="text-xs mt-1">— {details.hostName}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Download button below preview */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || isPaying}
            className="px-8 py-3 gradient-primary text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {isDownloading || isPaying ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
            ) : (
              <>{isPaid ? '📥 Download Now' : '📥 Download Invitation — ₹30'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
