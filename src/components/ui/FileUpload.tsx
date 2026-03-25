'use client';

import { useRef, useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export default function FileUpload({ onFileSelect, accept = 'image/*', className = '' }: FileUploadProps) {
  const { locale } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onDragOver={handleDragIn}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 ${
        isDragging
          ? 'border-primary bg-primary/10 glow'
          : 'border-border hover:border-primary/50 hover:bg-surface-light/30'
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-colors ${
          isDragging ? 'bg-primary/20' : 'bg-surface-lighter'
        }`}>
          📤
        </div>
        <div>
          <p className="text-text-primary font-semibold text-lg">{t(locale, 'common.dragDrop')}</p>
          <p className="text-text-muted mt-1">
            {t(locale, 'common.or')}{' '}
            <span className="text-primary-light underline">{t(locale, 'common.browseFiles')}</span>
          </p>
        </div>
        <p className="text-text-muted text-xs">{t(locale, 'common.supportedFormats')}</p>
      </div>
    </motion.div>
  );
}
