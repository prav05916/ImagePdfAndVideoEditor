export function applyBrightness(ctx: CanvasRenderingContext2D, value: number) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const factor = value / 100;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + 255 * factor));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + 255 * factor));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + 255 * factor));
  }
  ctx.putImageData(imageData, 0, 0);
}

export function applyContrast(ctx: CanvasRenderingContext2D, value: number) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const factor = (259 * (value + 255)) / (255 * (259 - value));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
  }
  ctx.putImageData(imageData, 0, 0);
}

export function applySaturation(ctx: CanvasRenderingContext2D, value: number) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const factor = 1 + value / 100;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = Math.min(255, Math.max(0, gray + factor * (data[i] - gray)));
    data[i + 1] = Math.min(255, Math.max(0, gray + factor * (data[i + 1] - gray)));
    data[i + 2] = Math.min(255, Math.max(0, gray + factor * (data[i + 2] - gray)));
  }
  ctx.putImageData(imageData, 0, 0);
}

export function applyEnhance(ctx: CanvasRenderingContext2D) {
  // Sharpen kernel
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);
  
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * w + (x + kx)) * 4 + c;
            val += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        data[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, val));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  
  // Auto-levels
  const levelsData = ctx.getImageData(0, 0, w, h);
  const ld = levelsData.data;
  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
  for (let i = 0; i < ld.length; i += 4) {
    minR = Math.min(minR, ld[i]);
    maxR = Math.max(maxR, ld[i]);
    minG = Math.min(minG, ld[i+1]);
    maxG = Math.max(maxG, ld[i+1]);
    minB = Math.min(minB, ld[i+2]);
    maxB = Math.max(maxB, ld[i+2]);
  }
  for (let i = 0; i < ld.length; i += 4) {
    ld[i] = maxR !== minR ? ((ld[i] - minR) / (maxR - minR)) * 255 : ld[i];
    ld[i+1] = maxG !== minG ? ((ld[i+1] - minG) / (maxG - minG)) * 255 : ld[i+1];
    ld[i+2] = maxB !== minB ? ((ld[i+2] - minB) / (maxB - minB)) * 255 : ld[i+2];
  }
  ctx.putImageData(levelsData, 0, 0);
}

export function removeBackground(ctx: CanvasRenderingContext2D, threshold: number = 30) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  
  // Sample corners to estimate background color
  const samples = [
    [0, 0], [w-1, 0], [0, h-1], [w-1, h-1],
    [Math.floor(w/4), 0], [Math.floor(3*w/4), 0],
    [0, Math.floor(h/4)], [0, Math.floor(3*h/4)],
  ];
  
  let bgR = 0, bgG = 0, bgB = 0;
  for (const [sx, sy] of samples) {
    const idx = (sy * w + sx) * 4;
    bgR += data[idx];
    bgG += data[idx + 1];
    bgB += data[idx + 2];
  }
  bgR = Math.round(bgR / samples.length);
  bgG = Math.round(bgG / samples.length);
  bgB = Math.round(bgB / samples.length);
  
  for (let i = 0; i < data.length; i += 4) {
    const diff = Math.abs(data[i] - bgR) + Math.abs(data[i+1] - bgG) + Math.abs(data[i+2] - bgB);
    if (diff < threshold * 3) {
      data[i + 3] = 0; // Make transparent
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
