'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';
import FileUpload from '@/components/ui/FileUpload';

type BgOption = 'transparent' | 'white' | 'custom';

export default function BackgroundRemoverPage() {
  const { locale } = useAppStore();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [extractedImage, setExtractedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgOption, setBgOption] = useState<BgOption>('transparent');
  const [customColor, setCustomColor] = useState('#22C55E');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setExtractedImage(null);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const processImage = useCallback(async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const imageBlob = await removeBackground(originalImage, {
        progress: (key: string, current: number, total: number) => console.log(`Downloading ${key}: ${current}/${total}`),
      });
      const url = URL.createObjectURL(imageBlob);
      setExtractedImage(url);
    } catch (error) {
      console.error('BG Removal failed:', error);
      alert('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage]);

  // Combine extracted image with selected background
  useEffect(() => {
    if (!extractedImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (bgOption === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgOption === 'custom') {
        ctx.fillStyle = customColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = extractedImage;
  }, [extractedImage, bgOption, customColor]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'bg-removed.png';
    link.href = processedImage;
    link.click();
  };

  const bgOptions: { key: BgOption; label: string }[] = [
    { key: 'transparent', label: t(locale, 'bgRemover.transparent') },
    { key: 'white', label: t(locale, 'bgRemover.white') },
    { key: 'custom', label: t(locale, 'bgRemover.custom') },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="✂️" title={t(locale, 'bgRemover.title')} subtitle={t(locale, 'bgRemover.subtitle')} />
      <canvas ref={canvasRef} className="hidden" />

      {!originalImage ? (
        <FileUpload onFileSelect={handleFileSelect} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4">
              <p className="text-sm text-text-muted mb-2 text-center">Original</p>
              <div className="rounded-xl overflow-hidden bg-black/20 flex items-center justify-center min-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalImage} alt="Original" className="max-w-full max-h-[400px] object-contain" />
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-sm text-text-muted mb-2 text-center">Result</p>
              <div className="rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]" style={{ background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 16px 16px' }}>
                {processedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={processedImage} alt="Processed" className="max-w-full max-h-[400px] object-contain" />
                ) : (
                  <p className="text-text-muted text-sm">{t(locale, 'bgRemover.removeBackground')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-sm text-text-secondary block mb-2">{t(locale, 'bgRemover.bgColor')}</label>
                <div className="flex gap-2">
                  {bgOptions.map((opt) => (
                    <button key={opt.key} onClick={() => setBgOption(opt.key)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        bgOption === opt.key ? 'gradient-primary text-white' : 'bg-surface-lighter text-text-muted hover:text-text-secondary'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {bgOption === 'custom' && (
                  <div className="mt-3 flex items-center gap-3">
                    <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                    <span className="text-sm text-text-muted">{customColor}</span>
                  </div>
                )}
              </div>

              {!extractedImage ? (
                <button onClick={processImage} disabled={isProcessing}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    isProcessing ? 'bg-surface-lighter text-text-muted cursor-wait' : 'gradient-primary text-white shadow-lg hover:opacity-90'
                  }`}>
                  {isProcessing ? t(locale, 'bgRemover.processing') : t(locale, 'bgRemover.removeBackground')}
                </button>
              ) : (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  onClick={handleDownload} className="w-full py-3 rounded-xl font-semibold text-sm gradient-gold text-white shadow-lg">
                  {t(locale, 'common.downloadPNG')}
                </motion.button>
              )}

              <button onClick={() => { setOriginalImage(null); setExtractedImage(null); setProcessedImage(null); }}
                className="w-full py-2 rounded-xl border border-border text-text-muted text-sm hover:text-text-secondary transition-all">
                {t(locale, 'common.upload')} ↺
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
