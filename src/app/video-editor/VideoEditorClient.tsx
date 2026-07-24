'use client';

import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { FFmpeg } from '@ffmpeg/ffmpeg';

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
  duration: number;
  startAt: number;
  trimStart: number;
  trimEnd: number;
  scale: number;
  rotation: number;
  posX: number;
  posY: number;
  opacity: number;
  volume: number;
  speed?: number;
  text?: string;
  color?: string;
  fontFamily?: string;
  textShadow?: string;
  isImage?: boolean;
  filter?: string;
}

// Child component for frame-accurate HTML5 Video playback sync
interface PreviewVideoProps {
  src: string;
  isPlaying: boolean;
  timelineTime: number;
  startAt: number;
  trimStart: number;
  trimEnd: number;
  volume: number;
  speed: number;
}

function PreviewVideo({ src, isPlaying, timelineTime, startAt, trimStart, trimEnd, volume, speed }: PreviewVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const targetTime = Math.max(trimStart, Math.min(trimEnd, (timelineTime - startAt) * speed + trimStart));

    const syncPlayback = () => {
      try {
        if (Math.abs(video.currentTime - targetTime) > 0.25) {
          video.currentTime = targetTime;
        }
        video.volume = volume;
        video.playbackRate = speed;

        if (isPlaying) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      } catch (e) {
        console.warn('Video playback sync warning:', e);
      }
    };

    if (video.readyState >= 1) {
      syncPlayback();
    }
  }, [isPlaying, timelineTime, startAt, trimStart, trimEnd, volume, speed, isReady]);

  return (
    <video
      ref={ref}
      src={src}
      className="w-full h-full object-cover"
      muted={volume === 0}
      playsInline
      preload="auto"
      onLoadedMetadata={() => {
        setIsReady(true);
        if (ref.current) {
          try { ref.current.currentTime = trimStart; } catch (e) {}
        }
      }}
      onCanPlay={() => setIsReady(true)}
    />
  );
}

// Child component for frame-accurate background audio playback sync
interface PreviewAudioProps {
  src: string;
  isPlaying: boolean;
  timelineTime: number;
  startAt: number;
  trimStart: number;
  trimEnd: number;
  volume: number;
  speed: number;
}

function PreviewAudio({ src, isPlaying, timelineTime, startAt, trimStart, trimEnd, volume, speed }: PreviewAudioProps) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const clipTime = (timelineTime - startAt) * speed + trimStart;

    if (Math.abs(audio.currentTime - clipTime) > 0.25) {
      audio.currentTime = Math.max(trimStart, Math.min(trimEnd, clipTime));
    }

    audio.volume = volume;
    audio.playbackRate = speed;

    if (isPlaying) {
      if (audio.paused) {
        audio.play().catch(() => { });
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isPlaying, timelineTime, startAt, trimStart, trimEnd, volume, speed]);

  return (
    <audio
      ref={ref}
      src={src}
      muted={volume === 0}
    />
  );
}

export default function VideoEditorPage() {
  const { locale } = useAppStore();
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [ready, setReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after hydration to avoid SSR/client mismatch
  useEffect(() => { setMounted(true); }, []);

  const [activeLeftTab, setActiveLeftTab] = useState<'media' | 'audio' | 'text' | 'effects' | 'merger'>('media');

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const [tracks, setTracks] = useState<TimelineTrack[]>([
    { id: 'v1', type: 'video', clips: [] },
    { id: 'a1', type: 'audio', clips: [] },
    { id: 't1', type: 'text', clips: [] }
  ]);

  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<{ id: string, file?: File, url: string, type: 'video' | 'audio' | 'image', name: string, duration?: number }[]>([]);

  const rulerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const [mergeVideo1Id, setMergeVideo1Id] = useState<string>('');
  const [mergeVideo2Id, setMergeVideo2Id] = useState<string>('');
  const [mergeStart1, setMergeStart1] = useState<number>(0);
  const [mergeEnd1, setMergeEnd1] = useState<number>(5);
  const [mergeStart2, setMergeStart2] = useState<number>(0);
  const [mergeEnd2, setMergeEnd2] = useState<number>(5);
  const [mergeProgress, setMergeProgress] = useState<string>('');

  const mergeVideosByRange = async (
    file1: File, start1: number, end1: number,
    file2: File, start2: number, end2: number
  ) => {
    if (!ffmpeg || !ready) return;
    setIsProcessing(true);
    setMergeProgress("Initializing merger...");

    const inp1 = "merge_input1.mp4";
    const inp2 = "merge_input2.mp4";
    const out1 = "merge_out1.mp4";
    const out2 = "merge_out2.mp4";
    const listFile = "merge_list.txt";
    const finalOut = "merged_video.mp4";

    try {
      setMergeProgress("Reading Video 1...");
      const data1 = await new Promise<Uint8Array>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(new Uint8Array(r.result as ArrayBuffer));
        r.onerror = reject;
        r.readAsArrayBuffer(file1);
      });
      await ffmpeg.writeFile(inp1, data1);

      setMergeProgress("Reading Video 2...");
      const data2 = await new Promise<Uint8Array>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(new Uint8Array(r.result as ArrayBuffer));
        r.onerror = reject;
        r.readAsArrayBuffer(file2);
      });
      await ffmpeg.writeFile(inp2, data2);

      setMergeProgress("Trimming Video 1 segment...");
      const dur1 = end1 - start1;
      await ffmpeg.exec([
        '-ss', start1.toString(),
        '-t', dur1.toString(),
        '-i', inp1,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-c:a', 'aac',
        '-vf', 'scale=1280:720,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
        out1
      ]);

      setMergeProgress("Trimming Video 2 segment...");
      const dur2 = end2 - start2;
      await ffmpeg.exec([
        '-ss', start2.toString(),
        '-t', dur2.toString(),
        '-i', inp2,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-c:a', 'aac',
        '-vf', 'scale=1280:720,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
        out2
      ]);

      setMergeProgress("Stitching segments together...");
      const listContent = `file '${out1}'\nfile '${out2}'\n`;
      await ffmpeg.writeFile(listFile, listContent);

      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', listFile,
        '-c', 'copy',
        finalOut
      ]);

      setMergeProgress("Generating output file...");
      const finalData = await ffmpeg.readFile(finalOut);
      const url = URL.createObjectURL(new Blob([finalData as any], { type: 'video/mp4' }));

      const a = document.createElement('a');
      a.href = url;
      a.download = `merged_video_${Date.now()}.mp4`;
      a.click();

      alert("Videos successfully merged and downloaded!");
    } catch (err) {
      console.error(err);
      alert("Merge failed. Please ensure both selected videos are standard compatible MP4 files.");
    } finally {
      try { await ffmpeg.deleteFile(inp1); } catch (e) { }
      try { await ffmpeg.deleteFile(inp2); } catch (e) { }
      try { await ffmpeg.deleteFile(out1); } catch (e) { }
      try { await ffmpeg.deleteFile(out2); } catch (e) { }
      try { await ffmpeg.deleteFile(listFile); } catch (e) { }
      try { await ffmpeg.deleteFile(finalOut); } catch (e) { }
      setIsProcessing(false);
      setMergeProgress("");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Check SharedArrayBuffer is available (needed for FFmpeg WASM multi-threading)
        if (typeof SharedArrayBuffer === 'undefined') {
          setFfmpegError('SharedArrayBuffer is not available. This page requires COOP/COEP headers (already configured). Try a hard refresh (Cmd+Shift+R).');
          return;
        }
        const f = new FFmpeg();
        // Use locally hosted FFmpeg files (avoids CSP/CORS issues with external CDNs)
        // Files are at /public/ffmpeg/ → served as /ffmpeg/ by Next.js
        const baseURL = window.location.origin;
        await f.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setFFmpeg(f);
        setReady(true);
      } catch (e) {
        console.error('FFmpeg failed to load:', e);
        setFfmpegError('Video processing engine failed to load. Try a hard refresh (Cmd+Shift+R).');
      }
    })();
  }, []);


  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTime) / 1000;
        setCurrentTime(t => {
          let maxDuration = 10;
          tracks.forEach(track => {
            track.clips.forEach(clip => {
              const end = clip.startAt + (clip.trimEnd - clip.trimStart);
              if (end > maxDuration) maxDuration = end;
            });
          });
          if (t + delta >= maxDuration) {
            setIsPlaying(false);
            return 0;
          }
          return t + delta;
        });
      }
      lastTime = now;
      frameId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      lastTime = performance.now();
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, tracks]);

  const handleRulerTimeChange = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, clickX / (50 * zoom));
    setCurrentTime(newTime);
  };

  const handleRulerMouseDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    handleRulerTimeChange(e);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isScrubbing || !rulerRef.current) return;
      const rect = rulerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = Math.max(0, clickX / (50 * zoom));
      setCurrentTime(newTime);
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
    };

    if (isScrubbing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, zoom]);

  const splitActiveClip = () => {
    if (!activeClipId) {
      for (const track of tracks) {
        const clip = track.clips.find(c => currentTime > c.startAt && currentTime < (c.startAt + (c.trimEnd - c.trimStart)));
        if (clip) {
          performSplit(track.id, clip);
          return;
        }
      }
      alert("Please select a clip or position the playhead over a clip to split it.");
      return;
    }

    for (const track of tracks) {
      const clip = track.clips.find(c => c.id === activeClipId);
      if (clip) {
        if (currentTime > clip.startAt && currentTime < (clip.startAt + (clip.trimEnd - clip.trimStart))) {
          performSplit(track.id, clip);
        } else {
          alert("Move playhead to a point inside the selected clip to split it.");
        }
        return;
      }
    }
  };

  const performSplit = (trackId: string, clip: MediaClip) => {
    const splitPointInClip = currentTime - clip.startAt;
    const absoluteSplitTime = currentTime;

    const clip1: MediaClip = {
      ...clip,
      id: clip.id + '-split1',
      trimEnd: clip.trimStart + splitPointInClip,
      duration: splitPointInClip
    };

    const clip2: MediaClip = {
      ...clip,
      id: clip.id + '-split2',
      startAt: absoluteSplitTime,
      trimStart: clip.trimStart + splitPointInClip,
      duration: clip.duration - splitPointInClip
    };

    setTracks(p => p.map(t => {
      if (t.id === trackId) {
        const filteredClips = t.clips.filter(c => c.id !== clip.id);
        return {
          ...t,
          clips: [...filteredClips, clip1, clip2].sort((a, b) => a.startAt - b.startAt)
        };
      }
      return t;
    }));

    setActiveClipId(clip2.id);
  };

  const deleteActiveClip = () => {
    if (!activeClipId) {
      alert("Please select a clip on the timeline first to delete it.");
      return;
    }
    setTracks(p => p.map(t => ({
      ...t,
      clips: t.clips.filter(c => c.id !== activeClipId)
    })));
    setActiveClipId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    files.forEach(file => {
      let type: 'video' | 'audio' | 'image' = 'video';
      if (file.type.startsWith('audio')) {
        type = 'audio';
      } else if (file.type.startsWith('image')) {
        type = 'image';
      }

      const url = URL.createObjectURL(file);

      const addAssetAndClip = (duration: number) => {
        const item = {
          id: Date.now().toString() + Math.random().toString(),
          file,
          url,
          type,
          name: file.name,
          duration,
        };
        setMediaLibrary(p => [...p, item]);
        addClipToTimeline(item);
      };

      if (type === 'video' || type === 'audio') {
        const tempElement = document.createElement(type) as HTMLVideoElement | HTMLAudioElement;
        tempElement.preload = 'metadata';
        let handled = false;
        const onDone = () => {
          if (handled) return;
          handled = true;
          const duration = tempElement.duration && !isNaN(tempElement.duration) && isFinite(tempElement.duration) ? tempElement.duration : 10;
          addAssetAndClip(duration);
        };
        tempElement.onloadedmetadata = onDone;
        tempElement.onerror = () => onDone();
        tempElement.src = url;
        tempElement.load();
        setTimeout(onDone, 800);
      } else {
        addAssetAndClip(5);
      }
    });
  };

  const addClipToTimeline = (media: any) => {
    const isVisual = media.type === 'video' || media.type === 'image';
    const targetTrackType = isVisual ? 'video' : 'audio';
    const trackIdx = tracks.findIndex(t => t.type === targetTrackType);
    if (trackIdx === -1) return;

    const clipDuration = media.duration || 10;

    const newClip: MediaClip = {
      id: Date.now().toString(),
      type: targetTrackType,
      file: media.file,
      fileUrl: media.url,
      name: media.name,
      duration: clipDuration,
      startAt: currentTime,
      trimStart: 0,
      trimEnd: clipDuration,
      scale: 1, rotation: 0, posX: 0, posY: 0, opacity: 1, volume: media.type === 'image' ? 0 : 1, speed: 1,
      isImage: media.type === 'image',
      filter: 'none'
    };

    setTracks(p => p.map((t, i) => i === trackIdx ? { ...t, clips: [...t.clips, newClip] } : t));
    setActiveClipId(newClip.id);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunks.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const duration = 5;
        const newClip: MediaClip = {
          id: 'rec-' + Date.now(),
          type: 'audio',
          fileUrl: url,
          name: `Voiceover Recording`,
          duration: duration,
          startAt: currentTime,
          trimStart: 0,
          trimEnd: duration,
          scale: 1, rotation: 0, posX: 0, posY: 0, opacity: 1, volume: 1, speed: 1
        };
        const trackIdx = tracks.findIndex(t => t.type === 'audio');
        if (trackIdx !== -1) {
          setTracks(p => p.map((t, i) => i === trackIdx ? { ...t, clips: [...t.clips, newClip] } : t));
          setActiveClipId(newClip.id);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const presetAudioTracks = [
    { name: "Lo-Fi Dream Chill", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Synthwave Sunset", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Acoustic Corporate", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { name: "Cinematic Orchestral", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  ];

  const addPresetAudio = (name: string, url: string) => {
    const trackIdx = tracks.findIndex(t => t.type === 'audio');
    if (trackIdx === -1) return;
    const newClip: MediaClip = {
      id: Date.now().toString(),
      type: 'audio',
      fileUrl: url,
      name: name,
      duration: 30,
      startAt: currentTime,
      trimStart: 0,
      trimEnd: 30,
      scale: 1, rotation: 0, posX: 0, posY: 0, opacity: 1, volume: 0.8, speed: 1
    };
    setTracks(p => p.map((t, i) => i === trackIdx ? { ...t, clips: [...t.clips, newClip] } : t));
    setActiveClipId(newClip.id);
  };

  const textPresets = [
    { name: "Bold Heading", text: "HEADING TEXT", color: "#ffffff", fontFamily: "Inter", textShadow: "2px 2px 8px rgba(0,0,0,0.8)" },
    { name: "Modern Caption", text: "Caption text here", color: "#6366f1", fontFamily: "Inter", textShadow: "none" },
    { name: "Cyberpunk Neon", text: "NEON GLOW", color: "#f43f5e", fontFamily: "Arial", textShadow: "0 0 10px #f43f5e, 0 0 20px #f43f5e" },
    { name: "Retro Classic", text: "Vintage Style", color: "#eab308", fontFamily: "Times New Roman", textShadow: "2px 2px 2px #000000" },
  ];

  const addPresetText = (preset: typeof textPresets[0]) => {
    const trackIdx = tracks.findIndex(t => t.type === 'text');
    if (trackIdx === -1) return;
    const newClip: MediaClip = {
      id: Date.now().toString(),
      type: 'text',
      name: preset.name,
      duration: 5,
      startAt: currentTime,
      trimStart: 0,
      trimEnd: 5,
      scale: 1, rotation: 0, posX: 0, posY: 0, opacity: 1, volume: 0,
      text: preset.text,
      color: preset.color,
      fontFamily: preset.fontFamily,
      textShadow: preset.textShadow
    };
    setTracks(p => p.map((t, i) => i === trackIdx ? { ...t, clips: [...t.clips, newClip] } : t));
    setActiveClipId(newClip.id);
  };

  const effectFilters = [
    { name: "Original / Normal", filter: "none" },
    { name: "Cinematic Grayscale", filter: "grayscale(1) contrast(1.15)" },
    { name: "Warm Sepia", filter: "sepia(0.85) contrast(0.95) brightness(1.05)" },
    { name: "Vibrant Cyberpunk", filter: "hue-rotate(270deg) saturate(1.8) contrast(1.2)" },
    { name: "Moody Noir", filter: "grayscale(1) contrast(1.6) brightness(0.75)" },
    { name: "Soft Dreamy", filter: "blur(2.5px) brightness(1.1)" },
    { name: "High-contrast Invert", filter: "invert(1)" },
  ];

  const applyEffectToActive = (filter: string) => {
    if (!activeClipId) {
      alert("Please select a clip on the timeline first to apply this filter.");
      return;
    }
    updateActiveClip({ filter });
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

        const fileData = await new Promise<Uint8Array>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
          reader.onerror = reject;
          reader.readAsArrayBuffer(clip.file!);
        });
        await ffmpeg.writeFile(inp, fileData);
        createdFiles.push(inp);

        const dur = clip.trimEnd - clip.trimStart;
        const vFilters: string[] = [];

        if (clip.rotation === 90) vFilters.push('transpose=1');
        else if (clip.rotation === 180) vFilters.push('transpose=2,transpose=2');
        else if (clip.rotation === -90 || clip.rotation === 270) vFilters.push('transpose=2');

        vFilters.push(`scale=1280*${clip.scale}:720*${clip.scale}:force_original_aspect_ratio=decrease`);
        vFilters.push('pad=1280:720:(ow-iw)/2:(oh-ih)/2');

        const speed = clip.speed || 1;
        if (speed !== 1) {
          vFilters.push(`setpts=${1 / speed}*PTS`);
        }

        const args = ['-ss', clip.trimStart.toString(), '-t', dur.toString(), '-i', inp];
        const vf = `[0:v]${vFilters.join(',')}[v]`;

        const aFilters = [`volume=${clip.volume}`];
        if (speed !== 1) {
          aFilters.push(`atempo=${speed}`);
        }
        const af = `[0:a]${aFilters.join(',')}[a]`;

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

      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `exported_video_${sessionId}.mp4`;
      a.click();

    } catch (e) {
      console.error(e);
      alert('Export failed.');
    } finally {
      for (const f of createdFiles) {
        try { await ffmpeg.deleteFile(f); } catch (e) { }
      }
      setIsProcessing(false);
    }
  };

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
          {mounted && !ready && !ffmpegError && (
            <span className="text-[10px] text-yellow-500 uppercase tracking-widest font-bold animate-pulse">⏳ Loading Engine...</span>
          )}
          {mounted && ffmpegError && (
            <span className="text-[10px] text-red-400 font-bold max-w-[200px] truncate" title={ffmpegError}>
              ⚠️ Engine Error
            </span>
          )}
          {mounted && ready && (
            <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">✓ 1080p Ready</span>
          )}
          <button onClick={exportVideo} disabled={isProcessing || !ready} className="px-6 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors disabled:opacity-50">
            {isProcessing ? 'Rendering...' : 'Export Video'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL: MEDIA LIBRARY & TOOLS */}
        <div className="w-72 bg-[#141414] border-r border-white/10 flex flex-col flex-shrink-0">
          <div className="flex text-xs font-bold border-b border-white/10">
            <button onClick={() => setActiveLeftTab('media')} className={`flex-1 py-3 transition-colors ${activeLeftTab === 'media' ? 'text-blue-500 border-b-2 border-blue-500 bg-white/5' : 'text-white/50 hover:text-white'}`}>Media</button>
            <button onClick={() => setActiveLeftTab('audio')} className={`flex-1 py-3 transition-colors ${activeLeftTab === 'audio' ? 'text-blue-500 border-b-2 border-blue-500 bg-white/5' : 'text-white/50 hover:text-white'}`}>Audio</button>
            <button onClick={() => setActiveLeftTab('text')} className={`flex-1 py-3 transition-colors ${activeLeftTab === 'text' ? 'text-blue-500 border-b-2 border-blue-500 bg-white/5' : 'text-white/50 hover:text-white'}`}>Text</button>
            <button onClick={() => setActiveLeftTab('effects')} className={`flex-1 py-3 transition-colors ${activeLeftTab === 'effects' ? 'text-blue-500 border-b-2 border-blue-500 bg-white/5' : 'text-white/50 hover:text-white'}`}>Effects</button>
            <button onClick={() => setActiveLeftTab('merger')} className={`flex-1 py-3 transition-colors ${activeLeftTab === 'merger' ? 'text-blue-500 border-b-2 border-blue-500 bg-white/5' : 'text-white/50 hover:text-white'}`}>🔗 Merger</button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {activeLeftTab === 'media' && (
              <div className="space-y-4">
                <label className="w-full py-5 border border-dashed border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer flex flex-col items-center justify-center text-xs font-bold text-white/70">
                  <span className="text-2xl mb-2">📁</span>
                  <span>Import Media Files</span>
                  <span className="text-[10px] text-white/40 mt-1 font-normal">Supports Video, Audio, Images</span>
                  <input type="file" multiple accept="video/*,audio/*,image/*" className="hidden" onChange={handleFileUpload} />
                </label>

                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Project Assets</h4>
                  {mediaLibrary.length === 0 ? (
                    <p className="text-[11px] text-white/30 italic text-center py-4">No uploaded files yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {mediaLibrary.map(m => (
                        <div key={m.id} onClick={() => addClipToTimeline(m)} className="group relative aspect-video bg-black rounded border border-white/10 cursor-pointer overflow-hidden">
                          {m.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center relative bg-slate-800">
                              <span className="absolute top-1 left-1 text-[9px] bg-black/60 px-1 rounded">Vid</span>
                              <span className="text-xl">📹</span>
                            </div>
                          ) : m.type === 'image' ? (
                            <img src={m.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-blue-900/30 text-blue-500">🎵</div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <span className="text-white text-xs font-bold">Add to Timeline</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/70 text-[8px] truncate px-1">{m.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeLeftTab === 'audio' && (
              <div className="space-y-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                  <h5 className="text-[11px] font-bold text-white mb-2">🎙️ Record Voiceover</h5>
                  {!isRecording ? (
                    <button onClick={startRecording} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-bold transition flex items-center gap-2 mx-auto">
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                      Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded text-xs font-bold transition flex items-center gap-2 mx-auto animate-bounce">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      Stop & Save
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Royalty-Free Audio</h4>
                  {presetAudioTracks.map((track, idx) => (
                    <div key={idx} onClick={() => addPresetAudio(track.name, track.url)} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg flex items-center justify-between cursor-pointer transition">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎵</span>
                        <div className="text-left">
                          <p className="text-[11px] font-bold text-white">{track.name}</p>
                          <p className="text-[9px] text-white/40">Background Music Track</p>
                        </div>
                      </div>
                      <span className="text-xs text-white/40 group-hover:text-white">➕</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLeftTab === 'text' && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Text Presets</h4>
                {textPresets.map((preset, idx) => (
                  <div key={idx} onClick={() => addPresetText(preset)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg cursor-pointer transition text-left">
                    <p className="text-[12px] font-bold" style={{ color: preset.color, fontFamily: preset.fontFamily }}>{preset.text}</p>
                    <p className="text-[9px] text-white/40 mt-1 font-mono">Style: {preset.name}</p>
                  </div>
                ))}
              </div>
            )}

            {activeLeftTab === 'effects' && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Cinematic Filters</h4>
                <div className="grid grid-cols-1 gap-2">
                  {effectFilters.map((effect, idx) => (
                    <div key={idx} onClick={() => applyEffectToActive(effect.filter)} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg flex items-center justify-between cursor-pointer transition text-left">
                      <div>
                        <p className="text-[11px] font-bold text-white">{effect.name}</p>
                        <p className="text-[8px] text-white/40 truncate font-mono">CSS: {effect.filter}</p>
                      </div>
                      {activeClip && activeClip.filter === effect.filter && <span className="text-blue-500 text-xs">✓ Active</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLeftTab === 'merger' && (
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">🔗 Quick Video Merger</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Select any two uploaded videos from your assets, choose their specific time ranges, and stitch them together instantly!
                </p>

                {mediaLibrary.filter(m => m.type === 'video').length < 2 ? (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center space-y-2">
                    <p className="text-xs text-yellow-500 font-medium">⚠️ Import at least 2 videos first</p>
                    <p className="text-[10px] text-white/40">Go to the 'Media' tab to upload your MP4 videos from your local computer.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                      <label className="text-[10px] font-bold text-blue-400 uppercase">Video A (First Clip)</label>
                      <select value={mergeVideo1Id} onChange={e => {
                        const id = e.target.value;
                        setMergeVideo1Id(id);
                        const asset = mediaLibrary.find(v => v.id === id);
                        if (asset) {
                          setMergeStart1(0);
                          setMergeEnd1(asset.duration || 5);
                        }
                      }} className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white">
                        <option value="">Select first video...</option>
                        {mediaLibrary.filter(m => m.type === 'video').map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({(v.duration || 0).toFixed(1)}s)</option>
                        ))}
                      </select>

                      {mergeVideo1Id && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <div className="flex justify-between text-[10px] text-white/60">
                            <span>Range A: {mergeStart1.toFixed(1)}s - {mergeEnd1.toFixed(1)}s</span>
                            <span className="text-blue-400 font-bold">Dur: {(mergeEnd1 - mergeStart1).toFixed(1)}s</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] text-white/40 block">Start (s)</label>
                              <input type="number" step="0.1" min="0" max={mergeEnd1 - 0.1} value={mergeStart1} onChange={e => setMergeStart1(Math.max(0, +e.target.value))} className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                            </div>
                            <div>
                              <label className="text-[9px] text-white/40 block">End (s)</label>
                              <input type="number" step="0.1" min={mergeStart1 + 0.1} max={mediaLibrary.find(v => v.id === mergeVideo1Id)?.duration || 10} value={mergeEnd1} onChange={e => setMergeEnd1(+e.target.value)} className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                      <label className="text-[10px] font-bold text-purple-400 uppercase">Video B (Second Clip)</label>
                      <select value={mergeVideo2Id} onChange={e => {
                        const id = e.target.value;
                        setMergeVideo2Id(id);
                        const asset = mediaLibrary.find(v => v.id === id);
                        if (asset) {
                          setMergeStart2(0);
                          setMergeEnd2(asset.duration || 5);
                        }
                      }} className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white">
                        <option value="">Select second video...</option>
                        {mediaLibrary.filter(m => m.type === 'video').map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({(v.duration || 0).toFixed(1)}s)</option>
                        ))}
                      </select>

                      {mergeVideo2Id && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <div className="flex justify-between text-[10px] text-white/60">
                            <span>Range B: {mergeStart2.toFixed(1)}s - {mergeEnd2.toFixed(1)}s</span>
                            <span className="text-purple-400 font-bold">Dur: {(mergeEnd2 - mergeStart2).toFixed(1)}s</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] text-white/40 block">Start (s)</label>
                              <input type="number" step="0.1" min="0" max={mergeEnd2 - 0.1} value={mergeStart2} onChange={e => setMergeStart2(Math.max(0, +e.target.value))} className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                            </div>
                            <div>
                              <label className="text-[9px] text-white/40 block">End (s)</label>
                              <input type="number" step="0.1" min={mergeStart2 + 0.1} max={mediaLibrary.find(v => v.id === mergeVideo2Id)?.duration || 10} value={mergeEnd2} onChange={e => setMergeEnd2(+e.target.value)} className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      disabled={isProcessing || !ready || !mergeVideo1Id || !mergeVideo2Id}
                      onClick={() => {
                        const file1 = mediaLibrary.find(v => v.id === mergeVideo1Id);
                        const file2 = mediaLibrary.find(v => v.id === mergeVideo2Id);
                        if (file1?.file && file2?.file) {
                          mergeVideosByRange(file1.file, mergeStart1, mergeEnd1, file2.file, mergeStart2, mergeEnd2);
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-xs font-bold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                    >
                      <span>🔗</span>
                      {isProcessing ? 'Merging Videos...' : 'Stitch & Merge Videos'}
                    </button>

                    {mergeProgress && (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center space-y-2 animate-pulse">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-[10px] text-blue-400 font-bold tracking-wide uppercase">{mergeProgress}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: CANVAS PREVIEW */}
        <div className="flex-1 bg-[#0a0a0a] relative flex flex-col">
          <div className="h-10 bg-[#1a1a1a] flex items-center justify-center gap-4 text-xs font-mono text-white/70 border-b border-white/10">
            <span>{Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toFixed(1).padStart(4, '0')}</span>
          </div>
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>

            <div className="bg-black shadow-2xl relative border border-white/10 overflow-hidden" style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9' }}>
              {tracks.find(t => t.type === 'audio')?.clips.map(clip => {
                const isActive = currentTime >= clip.startAt && currentTime <= (clip.startAt + (clip.trimEnd - clip.trimStart));
                if (!isActive) return null;
                return (
                  <PreviewAudio
                    key={clip.id}
                    src={clip.fileUrl || ''}
                    isPlaying={isPlaying}
                    timelineTime={currentTime}
                    startAt={clip.startAt}
                    trimStart={clip.trimStart}
                    trimEnd={clip.trimEnd}
                    volume={clip.volume}
                    speed={clip.speed || 1}
                  />
                );
              })}

              {tracks.map(track => {
                if (track.type === 'audio') return null;
                return track.clips.map(clip => {
                  const isActive = currentTime >= clip.startAt && currentTime <= (clip.startAt + (clip.trimEnd - clip.trimStart));
                  if (!isActive) return null;

                  if (clip.type === 'video') {
                    return (
                      <div key={clip.id} className="absolute inset-0 flex items-center justify-center"
                        style={{
                          opacity: clip.opacity,
                          transform: `scale(${clip.scale}) rotate(${clip.rotation}deg) translate(${clip.posX}px, ${clip.posY}px)`,
                          filter: clip.filter || 'none',
                          transition: 'filter 0.15s ease'
                        }}>
                        {clip.isImage ? (
                          <img src={clip.fileUrl} className="w-full h-full object-cover" />
                        ) : (
                          <PreviewVideo
                            src={clip.fileUrl || ''}
                            isPlaying={isPlaying}
                            timelineTime={currentTime}
                            startAt={clip.startAt}
                            trimStart={clip.trimStart}
                            trimEnd={clip.trimEnd}
                            volume={clip.volume}
                            speed={clip.speed || 1}
                          />
                        )}
                      </div>
                    );
                  }
                  if (clip.type === 'text') {
                    return (
                      <div key={clip.id} className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                          opacity: clip.opacity,
                          transform: `scale(${clip.scale}) rotate(${clip.rotation}deg) translate(${clip.posX}px, ${clip.posY}px)`
                        }}>
                        <span style={{
                          color: clip.color,
                          fontFamily: clip.fontFamily,
                          fontSize: '3rem',
                          fontWeight: 'bold',
                          textShadow: clip.textShadow || '2px 2px 4px rgba(0,0,0,0.5)',
                          whiteSpace: 'pre-wrap',
                          textAlign: 'center'
                        }}>{clip.text}</span>
                      </div>
                    );
                  }
                  return null;
                });
              })}
            </div>

          </div>

          <div className="h-14 bg-[#141414] border-t border-white/10 flex items-center justify-center gap-6 px-4">
            <button onClick={() => setCurrentTime(0)} className="text-white/50 hover:text-white transition" title="Rewind to start">⏮</button>
            <button className="text-white/50 hover:text-white transition" onClick={() => setCurrentTime(p => Math.max(0, p - 1))}>⏪ 1s</button>
            <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-xl hover:scale-105 transition" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <button className="text-white/50 hover:text-white transition" onClick={() => setCurrentTime(p => p + 1)}>1s ⏩</button>
            <button onClick={() => {
              let maxDuration = 0;
              tracks.forEach(track => {
                track.clips.forEach(clip => {
                  const end = clip.startAt + (clip.trimEnd - clip.trimStart);
                  if (end > maxDuration) maxDuration = end;
                });
              });
              setCurrentTime(maxDuration);
            }} className="text-white/50 hover:text-white transition" title="Forward to end">⏭</button>
          </div>
        </div>

        {/* RIGHT PANEL: PROPERTIES */}
        <div className="w-80 bg-[#141414] border-l border-white/10 flex flex-col flex-shrink-0 overflow-y-auto">
          {activeClip ? (
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">⚙️</span>
                  <h3 className="text-sm font-bold truncate max-w-[150px]">{activeClip.name}</h3>
                </div>
                <button onClick={() => setActiveClipId(null)} className="text-xs text-white/40 hover:text-white">Deselect</button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Transform</h4>

                <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                  <label className="text-xs text-white/70">Scale</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0.1" max="3" step="0.05" value={activeClip.scale} onChange={e => updateActiveClip({ scale: +e.target.value })} className="w-full accent-blue-500" />
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
                    <input type="range" min="-180" max="180" step="5" value={activeClip.rotation} onChange={e => updateActiveClip({ rotation: +e.target.value })} className="w-full accent-blue-500" />
                    <span className="text-[10px] w-8 font-mono">{activeClip.rotation}°</span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr] gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/50">Pos X (px)</label>
                    <input type="number" value={activeClip.posX} onChange={e => updateActiveClip({ posX: +e.target.value })} className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/50">Pos Y (px)</label>
                    <input type="number" value={activeClip.posY} onChange={e => updateActiveClip({ posY: +e.target.value })} className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                  </div>
                </div>
              </div>

              {activeClip.type === 'text' && (
                <div className="space-y-4 pt-4 border-t border-white/10 text-left">
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Text Style</h4>
                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Text Content</label>
                    <textarea value={activeClip.text} onChange={e => updateActiveClip({ text: e.target.value })} className="w-full h-20 bg-black border border-white/10 rounded px-3 py-2 text-xs focus:border-blue-500 focus:outline-none resize-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[10px] text-white/50">Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={activeClip.color} onChange={e => updateActiveClip({ color: e.target.value })} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <input type="text" value={activeClip.color} onChange={e => updateActiveClip({ color: e.target.value })} className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Font Family</label>
                    <select value={activeClip.fontFamily} onChange={e => updateActiveClip({ fontFamily: e.target.value })} className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white">
                      <option value="Inter">Inter (Sans)</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman (Serif)</option>
                      <option value="Roboto Mono">Roboto Mono (Tech)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Text Shadow / Glow</label>
                    <input type="text" value={activeClip.textShadow || ''} onChange={e => updateActiveClip({ textShadow: e.target.value })} placeholder="e.g. 0 0 10px #f43f5e" className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white font-mono" />
                  </div>
                </div>
              )}

              {(activeClip.type === 'audio' || activeClip.type === 'video') && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Audio & Playback</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                    <label className="text-xs text-white/70">Volume</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="2" step="0.1" value={activeClip.volume} onChange={e => updateActiveClip({ volume: +e.target.value })} className="w-full accent-blue-500" />
                      <span className="text-[10px] w-8 font-mono">{(activeClip.volume * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                    <label className="text-xs text-white/70">Speed</label>
                    <div className="flex items-center gap-2">
                      <select value={activeClip.speed || 1} onChange={e => updateActiveClip({ speed: +e.target.value })} className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white">
                        <option value={0.5}>0.5x (Slow)</option>
                        <option value={1}>1.0x (Normal)</option>
                        <option value={1.5}>1.5x (Fast)</option>
                        <option value={2}>2.0x (Very Fast)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                    <label className="text-xs text-white/70">Duration</label>
                    <span className="text-xs text-white/50 text-left font-mono">{activeClip.trimEnd - activeClip.trimStart}s</span>
                  </div>
                </div>
              )}

              {activeClip.type === 'video' && (
                <div className="space-y-4 pt-4 border-t border-white/10 text-left">
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Applied Filter</h4>
                  <p className="text-xs text-white/70 capitalize">Active: {effectFilters.find(f => f.filter === activeClip.filter)?.name || "Custom"}</p>
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

      {/* TIMELINE SECTION */}
      <div className="h-64 bg-[#0a0a0a] border-t border-white/10 flex flex-col flex-shrink-0">
        <div className="h-8 bg-[#141414] border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={splitActiveClip} className="text-[10px] text-white/75 bg-blue-900/40 hover:bg-blue-950/70 border border-blue-800/40 px-3 py-1 rounded transition-colors flex items-center gap-1 font-bold">
              ✂️ Split Clip
            </button>
            <button onClick={deleteActiveClip} className="text-[10px] text-white/75 bg-red-950/40 hover:bg-red-950/70 border border-red-900/40 px-3 py-1 rounded transition-colors flex items-center gap-1 font-bold">
              🗑️ Delete Selected
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50">Timeline Zoom</span>
            <input type="range" min="0.5" max="3" step="0.25" value={zoom} onChange={e => setZoom(+e.target.value)} className="w-24 h-1 accent-white" />
            <span className="text-[9px] font-mono text-white/40 w-8">{zoom}x</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar">
          <div
            ref={rulerRef}
            onMouseDown={handleRulerMouseDown}
            className="h-6 border-b border-white/10 relative cursor-ew-resize bg-[#111]"
            style={{
              width: '2000px',
              backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 49px, rgba(255,255,255,0.06) 49px, rgba(255,255,255,0.06) 50px)'
            }}
          >
            {Array.from({ length: 40 }).map((_, idx) => (
              <span key={idx} className="absolute text-[8px] font-mono text-white/30 top-1 pointer-events-none" style={{ left: `${idx * 50 * zoom}px` }}>
                {idx}s
              </span>
            ))}
            <div className="absolute top-0 bottom-0 w-px bg-red-500 z-50 pointer-events-none" style={{ left: `${currentTime * 50 * zoom}px` }}>
              <div className="absolute top-0 -left-1.5 w-3 h-3 bg-red-500 rounded-sm" />
            </div>
          </div>

          <div className="p-2 space-y-1 relative w-[2000px]">
            {tracks.map((track) => (
              <div key={track.id} className="h-14 bg-[#1a1a1a] rounded flex relative group">
                <div className="w-16 flex-shrink-0 bg-[#222] border-r border-white/5 flex items-center justify-center text-[9px] font-bold text-white/40 uppercase tracking-widest z-10 select-none">
                  {track.type}
                </div>
                <div className="flex-1 relative overflow-hidden bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)]">
                  {track.clips.map(clip => (
                    <div key={clip.id}
                      onClick={(e) => { e.stopPropagation(); setActiveClipId(clip.id); }}
                      className={`absolute top-1 bottom-1 rounded border overflow-hidden cursor-pointer ${activeClipId === clip.id ? 'border-white z-20 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-white/20 z-10'}`}
                      style={{
                        left: `${clip.startAt * 50 * zoom}px`,
                        width: `${(clip.trimEnd - clip.trimStart) * 50 * zoom}px`,
                        backgroundColor: clip.type === 'video' ? (clip.isImage ? '#1e3a8a' : '#2563eb') : clip.type === 'audio' ? '#16a34a' : '#9333ea'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                      <div className="px-2 py-1 text-[9px] font-bold truncate text-white drop-shadow-md flex items-center gap-1 select-none">
                        <span>{clip.type === 'video' ? (clip.isImage ? '🖼️' : '📹') : clip.type === 'audio' ? '🎵' : '✍️'}</span>
                        <span className="truncate">{clip.name}</span>
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 hover:bg-white cursor-ew-resize" title="Trim Start" />
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 hover:bg-white cursor-ew-resize" title="Trim End" />
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