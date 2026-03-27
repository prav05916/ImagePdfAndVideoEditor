'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import PageHeader from '@/components/shared/PageHeader';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function VideoEditorPage() {
  const { locale } = useAppStore();
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [ready, setReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [video1, setVideo1] = useState<File | null>(null);
  const [video2, setVideo2] = useState<File | null>(null);
  const [video1Url, setVideo1Url] = useState<string | null>(null);
  
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [speed, setSpeed] = useState(1);
  
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState('');

  const loadFFmpeg = async () => {
    try {
      const ffmpegObj = new FFmpeg();
      ffmpegObj.on('log', ({ message }) => {
        console.log(message);
        setProgressMsg(message);
      });
      // toBlobURL handles the Web Worker and WASM fetching dynamically.
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpegObj.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setFFmpeg(ffmpegObj);
      setReady(true);
    } catch (e) {
      console.error(e);
      alert('Failed to load FFmpeg. Check console for WASM/CORS issues.');
    }
  };

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const handleVideoSelect = (file: File, isSecond: boolean = false) => {
    if (isSecond) {
      setVideo2(file);
    } else {
      setVideo1(file);
      const url = URL.createObjectURL(file);
      setVideo1Url(url);
    }
    setProcessedVideoUrl(null);
  };

  const trimVideo = async () => {
    if (!ffmpeg || !ready || !video1) return;
    setIsProcessing(true);
    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(video1));
      
      const duration = endTime - startTime;
      let args = ['-i', 'input.mp4', '-ss', startTime.toString(), '-t', duration.toString()];

      if (speed !== 1) {
        const pts = 1 / speed;
        args.push('-filter_complex', `[0:v]setpts=${pts}*PTS[v];[0:a]atempo=${speed}[a]`, '-map', '[v]', '-map', '[a]');
      } else {
        args.push('-c', 'copy');
      }

      args.push('output.mp4');
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile('output.mp4');
      const url = URL.createObjectURL(new Blob([data as any], { type: 'video/mp4' }));
      setProcessedVideoUrl(url);
    } catch (error) {
      console.error(error);
      alert('Error trimming video.');
    } finally {
      setIsProcessing(false);
    }
  };

  const mergeVideos = async () => {
    if (!ffmpeg || !ready || !video1 || !video2) return;
    setIsProcessing(true);
    try {
      await ffmpeg.writeFile('input1.mp4', await fetchFile(video1));
      await ffmpeg.writeFile('input2.mp4', await fetchFile(video2));

      // Create concat list
      const concatList = "file input1.mp4\nfile input2.mp4";
      await ffmpeg.writeFile('list.txt', concatList);

      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'list.txt',
        '-c', 'copy',
        'output.mp4'
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const url = URL.createObjectURL(new Blob([data as any], { type: 'video/mp4' }));
      setProcessedVideoUrl(url);
    } catch (error) {
      console.error(error);
      alert('Error merging videos. Ensure both are same format/codecs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedVideoUrl) return;
    const link = document.createElement('a');
    link.download = 'processed_video.mp4';
    link.href = processedVideoUrl;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon="🎬" title={t(locale, 'videoEditor.title')} subtitle={t(locale, 'videoEditor.subtitle')} />

      {!ready && (
        <div className="flex items-center justify-center p-12 glass rounded-2xl">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-text-secondary font-medium">{t(locale, 'videoEditor.initFfmpeg')}</p>
          </div>
        </div>
      )}

      {ready && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* UPLOAD & PREVIEW */}
          <div className="space-y-6">
            <div className="glass padding-6 rounded-2xl p-6">
              <label className="text-sm text-text-secondary block mb-2 font-medium">{t(locale, 'videoEditor.uploadFirst')}</label>
              <input 
                type="file" 
                accept="video/*" 
                onChange={(e) => e.target.files && handleVideoSelect(e.target.files[0], false)}
                className="w-full text-sm text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light transition-all"
              />
              
              {video1Url && (
                <div className="mt-4 rounded-xl overflow-hidden bg-black/50 aspect-video flex items-center justify-center">
                  <video src={video1Url} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div className="glass padding-6 rounded-2xl p-6">
              <label className="text-sm text-text-secondary block mb-2 font-medium">{t(locale, 'videoEditor.uploadSecond')}</label>
              <input 
                type="file" 
                accept="video/*" 
                onChange={(e) => e.target.files && handleVideoSelect(e.target.files[0], true)}
                className="w-full text-sm text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-surface-lighter file:text-text-primary hover:file:bg-surface transition-all"
              />
              {video2 && (
                <p className="mt-2 text-xs text-primary-light">✓ {video2.name} selected for merging</p>
              )}
            </div>
          </div>

          {/* CONTROLS & RESULT */}
          <div className="space-y-6">
            {video1 && (
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-secondary block mb-2">{t(locale, 'videoEditor.startTime')}</label>
                    <input 
                      type="number" 
                      min="0"
                      value={startTime}
                      onChange={(e) => setStartTime(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter border border-border text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary block mb-2">{t(locale, 'videoEditor.endTime')}</label>
                    <input 
                      type="number" 
                      min="1"
                      value={endTime}
                      onChange={(e) => setEndTime(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter border border-border text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-text-secondary block mb-2">{t(locale, 'videoEditor.speed')}</label>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-lighter border border-border text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value={0.5}>{t(locale, 'videoEditor.speed05x')}</option>
                    <option value={1}>{t(locale, 'videoEditor.speed1x')}</option>
                    <option value={1.5}>{t(locale, 'videoEditor.speed15x')}</option>
                    <option value={2}>{t(locale, 'videoEditor.speed2x')}</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={trimVideo} 
                    disabled={isProcessing}
                    className="flex-1 py-3 gradient-gold text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 transition-all hover:-translate-y-1"
                  >
                    {t(locale, 'videoEditor.trim')}
                  </button>
                  <button 
                    onClick={mergeVideos} 
                    disabled={isProcessing || !video2}
                    className="flex-1 py-3 gradient-primary text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 transition-all hover:-translate-y-1"
                  >
                    {t(locale, 'videoEditor.merge')}
                  </button>
                </div>

                {isProcessing && (
                  <div className="text-center p-4 bg-black/20 rounded-xl border border-border/50">
                    <p className="text-sm font-semibold text-primary mb-1">{t(locale, 'videoEditor.processing')}</p>
                    <p className="text-xs text-text-muted font-mono h-4 overflow-hidden truncate">{progressMsg}</p>
                  </div>
                )}
              </div>
            )}

            <AnimatePresence>
              {processedVideoUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-6 border-l-4 border-green-500"
                >
                  <h3 className="text-lg font-bold text-text-primary mb-4">Result</h3>
                  <div className="rounded-xl overflow-hidden bg-black aspect-video mb-4">
                    <video src={processedVideoUrl} controls className="w-full h-full object-contain" />
                  </div>
                  <button 
                    onClick={handleDownload}
                    className="w-full py-3 bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-green-600 transition-all"
                  >
                    {t(locale, 'videoEditor.download')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
