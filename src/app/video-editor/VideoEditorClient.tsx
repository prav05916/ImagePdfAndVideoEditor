'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Advanced Types for CapCut clone
type TrackType = 'video' | 'audio' | 'text' | 'effect';
interface TimelineTrack {
  id: string;
  type: TrackType;
  clips: MediaClip[];
}

interface MediaClip {
  id: string;
  file?: File;
  fileUrl?: string;
  type: TrackType;
  name: string;
  duration: number; // original duration
  startAt: number; // position on timeline
  trimStart: number; // cut start
  trimEnd: number; // cut end
  // Transform
  scale: number;
  rotation: number;
  posX: number;
  posY: number;
  opacity: number;
  // Audio
  volume: number;
  // Text specific
  text?: string;
  color?: string;
  fontFamily?: string;
}

export default function VideoEditorPage() {
  const { locale } = useAppStore();
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [ready, setReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Advanced State
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    { id: 'v1', type: 'video', clips: [] },
    { id: 'a1', type: 'audio', clips: [] },
    { id: 't1', type: 'text', clips: [] }
  ]);
  
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<{id: string, file: File, url: string, type: 'video'|'audio'}[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const f = new FFmpeg();
        const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await f.load({
          coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setFFmpeg(f);
        setReady(true);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const type = file.type.startsWith('video') ? 'video' : 'audio';
    const url = URL.createObjectURL(file);
    setMediaLibrary(p => [...p, { id: Date.now().toString(), file, url, type }]);
  };

  const addClipToTimeline = (media: any) => {
    const trackIdx = tracks.findIndex(t => t.type === media.type);
    if (trackIdx === -1) return;
    
    // Auto-detect duration logic here (mocked for simplicity)
    const newClip: MediaClip = {
      id: Date.now().toString(),
      type: media.type,
      file: media.file,
      fileUrl: media.url,
      name: media.file.name,
      duration: 10, // mock
      startAt: 0,
      trimStart: 0,
      trimEnd: 10,
      scale: 1, rotation: 0, posX: 0, posY: 0, opacity: 1, volume: 1
    };

    setTracks(p => p.map((t, i) => i === trackIdx ? { ...t, clips: [...t.clips, newClip] } : t));
    setActiveClipId(newClip.id);
  };

  const addTextClip = () => {
    const trackIdx = tracks.findIndex(t => t.type === 'text');
    if (trackIdx === -1) return;
    const newClip: MediaClip = {
      id: Date.now().toString(), type: 'text', name: 'Text Layer',
      duration: 5, startAt: currentTime, trimStart: 0, trimEnd: 5,
      scale: 1, rotation: 0, posX: 0, posY: 0, opacity: 1, volume: 1,
      text: 'Double click to edit', color: '#ffffff', fontFamily: 'Inter'
    };
    setTracks(p => p.map((t, i) => i === trackIdx ? { ...t, clips: [...t.clips, newClip] } : t));
    setActiveClipId(newClip.id);
  };

  const getActiveClip = () => {
    for (const track of tracks) {
      const clip = track.clips.find(c => c.id === activeClipId);
      if (clip) return clip;
    }
    return null;
  };

  const updateActiveClip = (patch: Partial<MediaClip>) => {
    setTracks(p => p.map(t => ({
      ...t, clips: t.clips.map(c => c.id === activeClipId ? { ...c, ...patch } : c)
    })));
  };

  const activeClip = getActiveClip();

  const exportVideo = async () => {
    if (!ffmpeg || !ready) return;
    
    // For this initial version, we will export the Video track
    const videoTrack = tracks.find(t => t.type === 'video');
    if (!videoTrack || videoTrack.clips.length === 0) {
      alert("No video clips to export.");
      return;
    }

    setIsProcessing(true);
    const sessionId = Date.now();
    const createdFiles: string[] = [];
    
    try {
      let concatList = '';
      
      for (let i = 0; i < videoTrack.clips.length; i++) {
        const clip = videoTrack.clips[i];
        if (!clip.file) continue;
        
        const inp = `input_${sessionId}_${i}.mp4`;
        const out = `clip_${sessionId}_${i}.mp4`;
        
        await ffmpeg.writeFile(inp, await fetchFile(clip.file));
        createdFiles.push(inp);
        
        const dur = clip.trimEnd - clip.trimStart;
        const vFilters: string[] = [];
        
        // Basic transforms
        if (clip.rotation === 90) vFilters.push('transpose=1');
        else if (clip.rotation === 180) vFilters.push('transpose=2,transpose=2');
        else if (clip.rotation === -90 || clip.rotation === 270) vFilters.push('transpose=2');
        
        vFilters.push(`scale=1280*${clip.scale}:720*${clip.scale}:force_original_aspect_ratio=decrease`);
        vFilters.push('pad=1280:720:(ow-iw)/2:(oh-ih)/2');
        
        const args = ['-ss', clip.trimStart.toString(), '-t', dur.toString(), '-i', inp];
        const vf = `[0:v]${vFilters.join(',')}[v]`;
        const af = `[0:a]volume=${clip.volume}[a]`;
        args.push('-filter_complex', `${vf};${af}`, '-map', '[v]', '-map', '[a]');
        args.push('-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'aac', out);
        
        await ffmpeg.exec(args);
        createdFiles.push(out);
        concatList += `file '${out}'\n`;
      }
      
      const listFile = `list_${sessionId}.txt`;
      await ffmpeg.writeFile(listFile, concatList);
      createdFiles.push(listFile);
      
      const finalOut = `output_${sessionId}.mp4`;
      await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', finalOut]);
      createdFiles.push(finalOut);
      
      const data = await ffmpeg.readFile(finalOut);
      const videoUrl = URL.createObjectURL(new Blob([data as any], { type: 'video/mp4' }));
      
      // Auto download
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `exported_video_${sessionId}.mp4`;
      a.click();
      
    } catch (e) {
      console.error(e);
      alert('Export failed.');
    } finally {
      for (const f of createdFiles) {
        try { await ffmpeg.deleteFile(f); } catch (e) {}
      }
      setIsProcessing(false);
    }
  };

  if (!ready) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0d0d0d] text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-lg">Initializing FFmpeg WASM Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0d0d0d] text-white overflow-hidden font-sans">
      {/* TOP NAVIGATION / TOOLBAR */}
      <div className="h-14 bg-[#141414] border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">ShivanshStudio Premiere</div>
          <div className="h-6 w-px bg-white/20" />
          <button className="text-xs font-semibold px-3 py-1.5 rounded hover:bg-white/10 transition">File</button>
          <button className="text-xs font-semibold px-3 py-1.5 rounded hover:bg-white/10 transition">Edit</button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">1080p • 60FPS</span>
          <button onClick={exportVideo} disabled={isProcessing} className="px-6 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors disabled:opacity-50">
            {isProcessing ? 'Rendering...' : 'Export Video'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL: MEDIA LIBRARY */}
        <div className="w-72 bg-[#141414] border-r border-white/10 flex flex-col flex-shrink-0">
          <div className="flex text-xs font-bold border-b border-white/10">
            <button className="flex-1 py-3 text-blue-500 border-b-2 border-blue-500">Media</button>
            <button className="flex-1 py-3 text-white/50 hover:text-white">Audio</button>
            <button className="flex-1 py-3 text-white/50 hover:text-white" onClick={addTextClip}>Text</button>
            <button className="flex-1 py-3 text-white/50 hover:text-white">Effects</button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <label className="w-full py-3 mb-4 border border-dashed border-white/20 rounded bg-white/5 hover:bg-white/10 transition cursor-pointer flex flex-col items-center justify-center text-xs font-bold text-white/70">
              <span className="text-xl mb-1">📁</span>
              Import Media
              <input type="file" multiple accept="video/*,audio/*,image/*" className="hidden" onChange={handleFileUpload} />
            </label>

            <div className="grid grid-cols-2 gap-2">
              {mediaLibrary.map(m => (
                <div key={m.id} onClick={() => addClipToTimeline(m)} className="group relative aspect-video bg-black rounded border border-white/10 cursor-pointer overflow-hidden">
                  {m.type === 'video' ? (
                    <video src={m.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-blue-900/30 text-blue-500">🎵</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <span className="text-white text-xl">➕</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent text-[9px] truncate px-1.5">{m.file.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL: CANVAS PREVIEW */}
        <div className="flex-1 bg-[#0a0a0a] relative flex flex-col">
          <div className="h-10 bg-[#1a1a1a] flex items-center justify-center gap-4 text-xs font-mono text-white/70 border-b border-white/10">
            <span>{Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toFixed(1).padStart(4, '0')}</span>
          </div>
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            
            <div className="bg-black shadow-2xl relative" style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9' }}>
               {/* Simulate Canvas Engine rendering multiple tracks */}
               {tracks.map(track => track.clips.map(clip => {
                 // Check if active in timeline (mocked display logic)
                 const isActive = currentTime >= clip.startAt && currentTime <= (clip.startAt + (clip.trimEnd - clip.trimStart));
                 if (!isActive) return null;

                 if (clip.type === 'video') {
                   return (
                     <div key={clip.id} className="absolute inset-0 flex items-center justify-center" style={{ opacity: clip.opacity, transform: `scale(${clip.scale}) rotate(${clip.rotation}deg) translate(${clip.posX}px, ${clip.posY}px)` }}>
                       <video src={clip.fileUrl} className="w-full h-full object-cover" />
                     </div>
                   );
                 }
                 if (clip.type === 'text') {
                   return (
                     <div key={clip.id} className="absolute inset-0 flex items-center justify-center" style={{ opacity: clip.opacity, transform: `scale(${clip.scale}) rotate(${clip.rotation}deg) translate(${clip.posX}px, ${clip.posY}px)` }}>
                       <span style={{ color: clip.color, fontFamily: clip.fontFamily, fontSize: '3rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{clip.text}</span>
                     </div>
                   );
                 }
                 return null;
               }))}
            </div>

          </div>
          
          {/* Player Controls */}
          <div className="h-14 bg-[#141414] border-t border-white/10 flex items-center justify-center gap-6 px-4">
            <button className="text-white/50 hover:text-white transition">⏮</button>
            <button className="text-white/50 hover:text-white transition" onClick={() => setCurrentTime(p => Math.max(0, p - 0.1))}>⏪</button>
            <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-xl hover:scale-105 transition" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <button className="text-white/50 hover:text-white transition" onClick={() => setCurrentTime(p => p + 0.1)}>⏩</button>
            <button className="text-white/50 hover:text-white transition">⏭</button>
          </div>
        </div>

        {/* RIGHT PANEL: PROPERTIES */}
        <div className="w-80 bg-[#141414] border-l border-white/10 flex flex-col flex-shrink-0 overflow-y-auto">
          {activeClip ? (
            <div className="p-5 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="text-blue-500">⚙️</span>
                <h3 className="text-sm font-bold truncate">{activeClip.name} Properties</h3>
              </div>

              {/* Transform Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Transform</h4>
                
                <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                  <label className="text-xs text-white/70">Scale</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0.1" max="3" step="0.1" value={activeClip.scale} onChange={e => updateActiveClip({ scale: +e.target.value })} className="w-full accent-blue-500" />
                    <span className="text-[10px] w-8 font-mono">{(activeClip.scale * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                  <label className="text-xs text-white/70">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="1" step="0.05" value={activeClip.opacity} onChange={e => updateActiveClip({ opacity: +e.target.value })} className="w-full accent-blue-500" />
                    <span className="text-[10px] w-8 font-mono">{(activeClip.opacity * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                  <label className="text-xs text-white/70">Rotation</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="-180" max="180" step="1" value={activeClip.rotation} onChange={e => updateActiveClip({ rotation: +e.target.value })} className="w-full accent-blue-500" />
                    <span className="text-[10px] w-8 font-mono">{activeClip.rotation}°</span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr] gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/50">Pos X</label>
                    <input type="number" value={activeClip.posX} onChange={e => updateActiveClip({ posX: +e.target.value })} className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/50">Pos Y</label>
                    <input type="number" value={activeClip.posY} onChange={e => updateActiveClip({ posY: +e.target.value })} className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                  </div>
                </div>
              </div>

              {/* Text specific */}
              {activeClip.type === 'text' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Text Style</h4>
                  <textarea value={activeClip.text} onChange={e => updateActiveClip({ text: e.target.value })} className="w-full h-20 bg-black border border-white/10 rounded px-3 py-2 text-xs focus:border-blue-500 focus:outline-none resize-none" />
                  <div className="flex items-center gap-3">
                    <input type="color" value={activeClip.color} onChange={e => updateActiveClip({ color: e.target.value })} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <select value={activeClip.fontFamily} onChange={e => updateActiveClip({ fontFamily: e.target.value })} className="flex-1 bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white">
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Audio specific */}
              {(activeClip.type === 'audio' || activeClip.type === 'video') && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Audio</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                    <label className="text-xs text-white/70">Volume</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="2" step="0.1" value={activeClip.volume} onChange={e => updateActiveClip({ volume: +e.target.value })} className="w-full accent-blue-500" />
                      <span className="text-[10px] w-8 font-mono">{(activeClip.volume * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-white/30 text-xs flex flex-col items-center justify-center h-full">
              <span className="text-3xl mb-3">🛠️</span>
              Select a clip on the timeline to edit its properties, transforms, audio, and effects.
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: MULTI-TRACK TIMELINE */}
      <div className="h-64 bg-[#0a0a0a] border-t border-white/10 flex flex-col flex-shrink-0">
        
        {/* Timeline Toolbar */}
        <div className="h-8 bg-[#141414] border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="text-[10px] text-white/70 hover:text-white px-2 py-0.5 rounded hover:bg-white/10">✂️ Split</button>
            <button className="text-[10px] text-white/70 hover:text-white px-2 py-0.5 rounded hover:bg-white/10">🗑 Delete</button>
            <button className="text-[10px] text-white/70 hover:text-white px-2 py-0.5 rounded hover:bg-white/10">🎙 Voiceover</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50">Zoom</span>
            <input type="range" min="1" max="10" step="0.5" value={zoom} onChange={e => setZoom(+e.target.value)} className="w-24 h-1 accent-white" />
          </div>
        </div>

        {/* Tracks Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          
          {/* Time ruler */}
          <div className="h-6 border-b border-white/10 relative" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 49px, rgba(255,255,255,0.1) 49px, rgba(255,255,255,0.1) 50px)' }}>
            {/* Playhead indicator line */}
            <div className="absolute top-0 bottom-0 w-px bg-red-500 z-50 pointer-events-none" style={{ left: `${currentTime * 50 * zoom}px` }}>
              <div className="absolute top-0 -left-1.5 w-3 h-3 bg-red-500 rounded-sm" />
            </div>
          </div>

          <div className="p-2 space-y-1 relative">
            {tracks.map((track, i) => (
              <div key={track.id} className="h-14 bg-[#1a1a1a] rounded flex relative group">
                <div className="w-16 flex-shrink-0 bg-[#222] border-r border-white/5 flex items-center justify-center text-[10px] font-bold text-white/30 uppercase tracking-widest z-10">
                  {track.type}
                </div>
                <div className="flex-1 relative overflow-hidden bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]">
                  
                  {/* Clips */}
                  {track.clips.map(clip => (
                    <div key={clip.id} 
                      onClick={() => setActiveClipId(clip.id)}
                      className={`absolute top-1 bottom-1 rounded border overflow-hidden cursor-pointer ${activeClipId === clip.id ? 'border-white z-20 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-white/20 z-10'}`}
                      style={{ 
                        left: `${clip.startAt * 50 * zoom}px`, 
                        width: `${(clip.trimEnd - clip.trimStart) * 50 * zoom}px`,
                        backgroundColor: clip.type === 'video' ? '#2563eb' : clip.type === 'audio' ? '#16a34a' : '#9333ea'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      <div className="px-2 py-1 text-[9px] font-bold truncate text-white drop-shadow-md">{clip.name}</div>
                      {/* Drag handles */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-white cursor-ew-resize" />
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-white cursor-ew-resize" />
                    </div>
                  ))}

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
