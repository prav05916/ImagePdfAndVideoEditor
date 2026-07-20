'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function PassportMakerClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle successful payment redirect
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      alert('Payment successful! You can now download your image.');
    }
    if (query.get('canceled')) {
      alert('Payment was canceled.');
    }
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setProcessedImage(null);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleProcessImage = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    try {
      // 1. Crop Image First
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      // 2. Remove Background using AI (dynamic import - same pattern as BackgroundRemoverClient)
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(croppedImage, {
        progress: (key: string, current: number, total: number) =>
          console.log(`Loading AI model ${key}: ${current}/${total}`),
      });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImage) return;

    const query = new URLSearchParams(window.location.search);
    if (!query.get('success')) {
      // If not paid, initiate Stripe checkout
      setIsPaying(true);
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: 'Passport Size Photo Download',
            amount: 5000, // 50 INR
            redirectUrl: window.location.pathname,
          }),
        });
        const { id, error } = await res.json();
        if (error) throw new Error(error);

        const stripe: any = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: id });
      } catch (err) {
        console.error('Payment initiation failed', err);
        alert('Failed to start payment process.');
      } finally {
        setIsPaying(false);
      }
      return;
    }

    // Merge background color with processed transparent image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = processedImage;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.download = 'passport-photo.jpg';
        link.href = dataUrl;
        link.click();
      }
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Passport Photo Maker</h1>
        <p className="text-text-muted">AI-powered background removal and cropping for perfect passport photos.</p>
      </motion.div>

      {!imageSrc ? (
        <div 
          className="border-2 border-dashed border-gray-400 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50/5 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
          <div className="text-4xl mb-4">📸</div>
          <p className="text-lg font-medium">Click to upload a photo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Side */}
          <div className="space-y-6">
            {!processedImage ? (
              <div className="relative h-96 w-full bg-gray-900 rounded-xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={3.5 / 4.5} // Standard passport ratio
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            ) : (
              <div 
                className="relative h-96 w-full rounded-xl overflow-hidden flex items-center justify-center border"
                style={{ backgroundColor: bgColor }}
              >
                <img src={processedImage} alt="Processed" className="max-h-full object-contain" />
              </div>
            )}

            <div className="glass p-6 rounded-xl space-y-4">
              {!processedImage ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zoom</label>
                    <input 
                      type="range" 
                      min={1} max={3} step={0.1} 
                      value={zoom} 
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button 
                    onClick={handleProcessImage}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'AI Processing...' : 'Remove Background & Crop'}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Color</label>
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-12 rounded cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={isPaying}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {isPaying ? 'Redirecting to Payment...' : 'Download (₹50)'}
                  </button>
                  <button 
                    onClick={() => {
                      setImageSrc(null);
                      setProcessedImage(null);
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Start Over
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Instructions Side */}
          <div className="glass p-6 rounded-xl h-fit">
            <h3 className="text-xl font-bold mb-4">Instructions</h3>
            <ul className="space-y-3 text-text-muted">
              <li>1. Upload a clear, front-facing photo.</li>
              <li>2. Adjust the crop to frame your face properly.</li>
              <li>3. Click "Remove Background & Crop" to let our AI do the work.</li>
              <li>4. Choose a background color (white or light blue is standard).</li>
              <li>5. Download your final passport photo!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to create the cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve('');
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
}
