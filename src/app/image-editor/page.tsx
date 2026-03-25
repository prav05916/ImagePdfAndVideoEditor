'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper, { Area } from 'react-easy-crop';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';
import FileUpload from '@/components/ui/FileUpload';

type Tab = 'crop' | 'resize' | 'adjust' | 'transform' | 'enhance';

export default function ImageEditorPage() {
  const { locale } = useAppStore();
  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('adjust');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [cropAspect, setCropAspect] = useState<number | undefined>(undefined);
  const [showCropper, setShowCropper] = useState(false);

  // Adjust state
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);

  // Transform config
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [preset, setFilterPreset] = useState<'none'|'grayscale'|'sepia'|'invert'>('none');

  // Resize state
  const [resizeW, setResizeW] = useState(0);
  const [resizeH, setResizeH] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [origAspect, setOrigAspect] = useState(1);

  // Enhance state
  const [enhanced, setEnhanced] = useState(false);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setImage(e.target?.result as string);
        setResizeW(img.width);
        setResizeH(img.height);
        setOrigAspect(img.width / img.height);
        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setFilterPreset('none');
        setEnhanced(false);
        setImage(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawImage = useCallback((img: HTMLImageElement | null, b: number, c: number, s: number, rot: number, fh: boolean, fv: boolean, prst: string, enh: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const isRotated = rot === 90 || rot === 270;
    canvas.width = isRotated ? img.height : img.width;
    canvas.height = isRotated ? img.width : img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(fh ? -1 : 1, fv ? -1 : 1);

    let filterStr = `brightness(${100 + b}%) contrast(${100 + c}%) saturate(${100 + s}%)`;
    if (prst === 'grayscale') filterStr += ' grayscale(100%)';
    if (prst === 'sepia') filterStr += ' sepia(100%)';
    if (prst === 'invert') filterStr += ' invert(100%)';
    ctx.filter = filterStr;

    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    if (enh) {
      // Sharpen
      const w = canvas.width, h = canvas.height;
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const copy = new Uint8ClampedArray(data);
      const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let ch = 0; ch < 3; ch++) {
            let val = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * w + (x + kx)) * 4 + ch;
                val += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
              }
            }
            data[(y * w + x) * 4 + ch] = Math.min(255, Math.max(0, val));
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }, []);

  useEffect(() => {
    if (originalImageRef.current && canvasRef.current && !showCropper) {
      drawImage(originalImageRef.current, brightness, contrast, saturation, rotation, flipH, flipV, preset, enhanced);
    }
  }, [brightness, contrast, saturation, rotation, flipH, flipV, preset, enhanced, drawImage, image, showCropper]);

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const applyCrop = () => {
    if (!croppedArea || !originalImageRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      originalImageRef.current,
      croppedArea.x, croppedArea.y, croppedArea.width, croppedArea.height,
      0, 0, croppedArea.width, croppedArea.height
    );
    const newImg = new Image();
    newImg.onload = () => {
      originalImageRef.current = newImg;
      setImage(canvas.toDataURL());
      setResizeW(newImg.width);
      setResizeH(newImg.height);
      setOrigAspect(newImg.width / newImg.height);
      setShowCropper(false);
      drawImage(newImg, brightness, contrast, saturation, rotation, flipH, flipV, preset, enhanced);
    };
    newImg.src = canvas.toDataURL();
  };

  const applyResize = () => {
    if (!originalImageRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = resizeW;
    canvas.height = resizeH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(originalImageRef.current, 0, 0, resizeW, resizeH);
    const newImg = new Image();
    newImg.onload = () => {
      originalImageRef.current = newImg;
      setImage(canvas.toDataURL());
      drawImage(newImg, brightness, contrast, saturation, rotation, flipH, flipV, preset, enhanced);
    };
    newImg.src = canvas.toDataURL();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'pixelcraft-edited.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'crop', label: t(locale, 'imageEditor.crop') },
    { key: 'resize', label: t(locale, 'imageEditor.resize') },
    { key: 'adjust', label: t(locale, 'imageEditor.adjust') },
    { key: 'transform', label: 'Transform' },
    { key: 'enhance', label: t(locale, 'imageEditor.enhance') },
  ];

  const Slider = ({ label, value, onChange, min = -100, max = 100 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-muted font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-lighter accent-primary"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="🖼️" title={t(locale, 'imageEditor.title')} subtitle={t(locale, 'imageEditor.subtitle')} />

      {!image ? (
        <FileUpload onFileSelect={handleFileSelect} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden relative">
              {showCropper && image ? (
                <div className="relative w-full" style={{ height: '500px' }}>
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={cropAspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-black/20 min-h-[400px]">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                {t(locale, 'common.downloadPNG')}
              </button>
              <button
                onClick={() => { setImage(null); setEnhanced(false); setBrightness(0); setContrast(0); setSaturation(0); setRotation(0); setFlipH(false); setFlipV(false); setFilterPreset('none'); }}
                className="px-6 py-2.5 glass rounded-xl text-text-secondary text-sm font-semibold hover:text-text-primary transition-colors"
              >
                {t(locale, 'common.upload')} ↺
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="glass rounded-2xl p-1 flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); if (tab.key === 'crop') setShowCropper(true); else setShowCropper(false); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.key
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-2xl p-6 space-y-5"
              >
                {activeTab === 'adjust' && (
                  <>
                    <Slider label={t(locale, 'imageEditor.brightness')} value={brightness} onChange={setBrightness} />
                    <Slider label={t(locale, 'imageEditor.contrast')} value={contrast} onChange={setContrast} />
                    <Slider label={t(locale, 'imageEditor.saturation')} value={saturation} onChange={setSaturation} />
                    <button
                      onClick={() => { setBrightness(0); setContrast(0); setSaturation(0); }}
                      className="w-full py-2 rounded-xl border border-border text-text-muted text-sm hover:text-text-secondary hover:border-primary/30 transition-all"
                    >
                      {t(locale, 'common.reset')}
                    </button>
                  </>
                )}

                {activeTab === 'transform' && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-text-secondary mb-3">Rotate & Flip</p>
                      <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => setRotation((r) => (r - 90 + 360) % 360)} className="py-2.5 glass rounded-xl text-center hover:bg-white/10 text-lg" title="Rotate Left">↺</button>
                        <button onClick={() => setRotation((r) => (r + 90) % 360)} className="py-2.5 glass rounded-xl text-center hover:bg-white/10 text-lg" title="Rotate Right">↻</button>
                        <button onClick={() => setFlipH(!flipH)} className={`py-2.5 glass rounded-xl text-center hover:bg-white/10 text-lg ${flipH ? 'bg-primary/20 ring-1 ring-primary' : ''}`} title="Flip Horizontal">↔</button>
                        <button onClick={() => setFlipV(!flipV)} className={`py-2.5 glass rounded-xl text-center hover:bg-white/10 text-lg ${flipV ? 'bg-primary/20 ring-1 ring-primary' : ''}`} title="Flip Vertical">↕</button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-3">Filters</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(['none', 'grayscale', 'sepia', 'invert'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setFilterPreset(p)}
                            className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${preset === p ? 'gradient-primary text-white' : 'bg-surface-lighter text-text-muted hover:text-text-secondary'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'crop' && (
                  <div className="space-y-4">
                    <p className="text-sm text-text-secondary">{t(locale, 'imageEditor.cropRatio')}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: t(locale, 'imageEditor.free'), value: undefined },
                        { label: t(locale, 'imageEditor.square'), value: 1 },
                        { label: '16:9', value: 16/9 },
                        { label: '4:3', value: 4/3 },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => { setCropAspect(opt.value); setShowCropper(true); }}
                          className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                            cropAspect === opt.value
                              ? 'gradient-primary text-white'
                              : 'bg-surface-lighter text-text-muted hover:text-text-secondary'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={applyCrop} className="w-full py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm">
                      {t(locale, 'common.apply')} {t(locale, 'imageEditor.crop')}
                    </button>
                  </div>
                )}

                {activeTab === 'resize' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-text-secondary">{t(locale, 'imageEditor.width')}</label>
                      <input
                        type="number"
                        value={resizeW}
                        onChange={(e) => {
                          const w = Number(e.target.value);
                          setResizeW(w);
                          if (keepAspect) setResizeH(Math.round(w / origAspect));
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary">{t(locale, 'imageEditor.height')}</label>
                      <input
                        type="number"
                        value={resizeH}
                        onChange={(e) => {
                          const h = Number(e.target.value);
                          setResizeH(h);
                          if (keepAspect) setResizeW(Math.round(h * origAspect));
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-surface-lighter border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                      <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} className="accent-primary" />
                      {t(locale, 'imageEditor.maintainAspect')}
                    </label>
                    <button onClick={applyResize} className="w-full py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm">
                      {t(locale, 'common.apply')} {t(locale, 'imageEditor.resize')}
                    </button>
                  </div>
                )}

                {activeTab === 'enhance' && (
                  <div className="space-y-4 text-center">
                    <div className="text-4xl mb-2">✨</div>
                    <h3 className="text-lg font-bold text-text-primary">{t(locale, 'imageEditor.enhanceQuality')}</h3>
                    <p className="text-sm text-text-muted">{t(locale, 'imageEditor.enhanceDesc')}</p>
                    <button
                      onClick={() => setEnhanced(!enhanced)}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                        enhanced
                          ? 'bg-success/20 text-success border border-success/30'
                          : 'gradient-primary text-white shadow-lg'
                      }`}
                    >
                      {enhanced ? `✓ ${t(locale, 'imageEditor.enhanced')}` : t(locale, 'imageEditor.enhanceQuality')}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
