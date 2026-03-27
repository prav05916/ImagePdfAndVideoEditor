'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';
import FileUpload from '@/components/ui/FileUpload';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type OutputSize = 'passport' | 'resume' | 'linkedin';

const sizeConfigs: Record<OutputSize, { w: number; h: number; label: string }> = {
  passport: { w: 413, h: 531, label: '35×45mm' },
  resume: { w: 400, h: 400, label: '400×400' },
  linkedin: { w: 800, h: 800, label: '800×800' },
};

export default function ResumeEnhancerPage() {
  const { locale } = useAppStore();
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'photo'|'resume'>('photo');

  // Photo Enhancer State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputSize, setOutputSize] = useState<OutputSize>('passport');
  const [brightness, setBrightness] = useState(10);
  const [contrast, setContrast] = useState(10);
  const [bgCleanup, setBgCleanup] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processImage = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    setIsProcessing(true);

    setTimeout(() => {
      const size = sizeConfigs[outputSize];
      canvas.width = size.w;
      canvas.height = size.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Center-crop to output aspect ratio
      const imgAspect = img.width / img.height;
      const outAspect = size.w / size.h;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgAspect > outAspect) {
        sw = img.height * outAspect;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / outAspect;
        sy = (img.height - sh) / 2;
      }

      // Fill white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size.w, size.h);

      // Apply brightness/contrast via CSS filter
      ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size.w, size.h);
      ctx.filter = 'none';

      // Background cleanup - lighten near-white edges
      if (bgCleanup) {
        const imageData = ctx.getImageData(0, 0, size.w, size.h);
        const data = imageData.data;
        const margin = Math.floor(size.w * 0.05);
        for (let y = 0; y < size.h; y++) {
          for (let x = 0; x < size.w; x++) {
            if (x < margin || x > size.w - margin || y < margin || y > size.h - margin) {
              const idx = (y * size.w + x) * 4;
              const avg = (data[idx] + data[idx+1] + data[idx+2]) / 3;
              if (avg > 180) {
                data[idx] = 255; data[idx+1] = 255; data[idx+2] = 255;
              }
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    }, 1000);
  }, [outputSize, brightness, contrast, bgCleanup]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = `resume-photo-${outputSize}.png`;
    link.href = processedImage;
    link.click();
  };

  const sizes: { key: OutputSize; label: string }[] = [
    { key: 'passport', label: t(locale, 'resumeEnhancer.passportSize') },
    { key: 'resume', label: t(locale, 'resumeEnhancer.resumeSize') },
    { key: 'linkedin', label: t(locale, 'resumeEnhancer.linkedinSize') },
  ];

  // Resume Maker State
  const [resumeData, setResumeData] = useState({
    fullName: 'Shivansh Doe',
    email: 'shivansh@example.com',
    phone: '+91 9876543210',
    summary: 'A highly motivated software engineer with experience in React and Next.js. Passionate about building excellent user interfaces and crafting scalable web applications.',
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    duration: '2021 - Present',
    degree: 'B.Tech in Computer Science',
    school: 'National Institute of Technology',
    skills: 'JavaScript, TypeScript, React, Next.js, Tailwind CSS, Git'
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    const element = document.getElementById('resume-preview-container');
    if (!element) return;
    setIsProcessing(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Resume_${resumeData.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="🧾" title={t(locale, 'resumeEnhancer.title')} subtitle={t(locale, 'resumeEnhancer.subtitle')} />
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8 justify-center">
        <button 
          onClick={() => setActiveTab('photo')}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'photo' ? 'gradient-primary text-white shadow-lg' : 'bg-surface-lighter text-text-muted hover:text-text-primary'}`}
        >
          {t(locale, 'resumeEnhancer.photoTab')}
        </button>
        <button 
          onClick={() => setActiveTab('resume')}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'resume' ? 'gradient-primary text-white shadow-lg' : 'bg-surface-lighter text-text-muted hover:text-text-primary'}`}
        >
          {t(locale, 'resumeEnhancer.resumeTab')}
        </button>
      </div>

      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <h3 className="text-xl font-bold text-text-primary mb-4">{t(locale, 'resumeEnhancer.personalInfo')}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.fullName')}</label>
                <input name="fullName" value={resumeData.fullName} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.email')}</label>
                <input name="email" value={resumeData.email} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.phone')}</label>
                <input name="phone" value={resumeData.phone} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.summary')}</label>
              <textarea name="summary" value={resumeData.summary} onChange={handleResumeChange} rows={3} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary resize-none" />
            </div>

            <h3 className="text-xl font-bold text-text-primary pt-4 border-t border-border">{t(locale, 'resumeEnhancer.experience')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.jobTitle')}</label>
                <input name="jobTitle" value={resumeData.jobTitle} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.company')}</label>
                <input name="company" value={resumeData.company} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.duration')}</label>
                <input name="duration" value={resumeData.duration} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-text-primary pt-4 border-t border-border">{t(locale, 'resumeEnhancer.education')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.degree')}</label>
                <input name="degree" value={resumeData.degree} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t(locale, 'resumeEnhancer.school')}</label>
                <input name="school" value={resumeData.school} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-text-primary pt-4 border-t border-border">{t(locale, 'resumeEnhancer.skills')}</h3>
            <div>
              <input name="skills" value={resumeData.skills} onChange={handleResumeChange} className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm text-text-primary focus:border-primary" />
            </div>

            <button 
              onClick={generatePDF}
              disabled={isProcessing}
              className="w-full mt-6 py-3 rounded-xl font-bold text-sm gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isProcessing ? t(locale, 'common.processing') : t(locale, 'resumeEnhancer.generatePdf')}
            </button>
          </div>

          {/* Preview A4 Page */}
          <div className="sticky top-6">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden aspect-[1/1.414] w-full max-w-[500px] mx-auto text-black flex flex-col items-center justify-start p-6" id="resume-preview-container">
               {/* Minimalist Professional Layout */}
               <div className="w-full border-b-2 border-gray-300 pb-4 mb-4 text-center">
                 <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{resumeData.fullName}</h1>
                 <p className="text-xs text-gray-500 mt-2 flex justify-center gap-3">
                    <span>{resumeData.email}</span> • <span>{resumeData.phone}</span>
                 </p>
               </div>
               
               <div className="w-full text-left space-y-5">
                  <section>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1 border-b border-gray-200 pb-1">Summary</h2>
                    <p className="text-xs text-gray-600 leading-relaxed">{resumeData.summary}</p>
                  </section>

                  <section>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1 border-b border-gray-200 pb-1">Experience</h2>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-semibold text-gray-700">{resumeData.jobTitle}</h3>
                      <span className="text-[10px] text-gray-500 font-medium">{resumeData.duration}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{resumeData.company}</p>
                  </section>

                  <section>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1 border-b border-gray-200 pb-1">Education</h2>
                    <div className="mb-1">
                      <h3 className="text-sm font-semibold text-gray-700">{resumeData.degree}</h3>
                      <p className="text-xs text-gray-600 font-medium">{resumeData.school}</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1 border-b border-gray-200 pb-1">Skills</h2>
                    <p className="text-xs text-gray-600 leading-relaxed">{resumeData.skills}</p>
                  </section>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'photo' && (
      <>
      <canvas ref={canvasRef} className="hidden" />

      {!originalImage ? (
        <FileUpload onFileSelect={handleFileSelect} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4">
              <p className="text-sm text-text-muted mb-2 text-center">Original</p>
              <div className="rounded-xl overflow-hidden bg-black/20 flex items-center justify-center min-h-[350px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalImage} alt="Original" className="max-w-full max-h-[400px] object-contain" />
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-sm text-text-muted mb-2 text-center">Enhanced</p>
              <div className="rounded-xl overflow-hidden bg-white flex items-center justify-center min-h-[350px]">
                {processedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={processedImage} alt="Enhanced" className="max-w-full max-h-[400px] object-contain" />
                ) : (
                  <p className="text-gray-400 text-sm">{t(locale, 'resumeEnhancer.enhancePhoto')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-sm text-text-secondary block mb-2">{t(locale, 'resumeEnhancer.outputSize')}</label>
                <div className="space-y-2">
                  {sizes.map((s) => (
                    <button key={s.key} onClick={() => setOutputSize(s.key)}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all text-left px-4 ${
                        outputSize === s.key ? 'gradient-primary text-white' : 'bg-surface-lighter text-text-muted hover:text-text-secondary'
                      }`}>
                      {s.label} ({sizeConfigs[s.key].label})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">{t(locale, 'imageEditor.brightness')}</span>
                  <span className="text-text-muted font-mono">{brightness}</span>
                </div>
                <input type="range" min={-30} max={50} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-lighter accent-primary" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">{t(locale, 'imageEditor.contrast')}</span>
                  <span className="text-text-muted font-mono">{contrast}</span>
                </div>
                <input type="range" min={-30} max={50} value={contrast} onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-lighter accent-primary" />
              </div>

              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" checked={bgCleanup} onChange={(e) => setBgCleanup(e.target.checked)} className="accent-primary" />
                {t(locale, 'resumeEnhancer.bgCleanup')}
              </label>

              <button onClick={processImage} disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  isProcessing ? 'bg-surface-lighter text-text-muted cursor-wait' : 'gradient-primary text-white shadow-lg hover:opacity-90'
                }`}>
                {isProcessing ? t(locale, 'common.processing') : t(locale, 'resumeEnhancer.enhancePhoto')}
              </button>

              {processedImage && (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  onClick={handleDownload} className="w-full py-3 rounded-xl font-semibold text-sm gradient-gold text-white shadow-lg">
                  {t(locale, 'common.downloadPNG')}
                </motion.button>
              )}

              <button onClick={() => { setOriginalImage(null); setProcessedImage(null); }}
                className="w-full py-2 rounded-xl border border-border text-text-muted text-sm hover:text-text-secondary transition-all">
                {t(locale, 'common.upload')} ↺
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
