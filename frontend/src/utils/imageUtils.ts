/**
 * Image processing utilities for client-side file reading,
 * compression, and resizing before saving to local state/storage.
 */

export interface ProcessedImage {
  dataUrl: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

/**
 * Reads a File object and optimizes it to a Data URL (base64).
 * Downscales large images to max dimensions while preserving aspect ratio,
 * compressing to JPEG/WebP so it fits easily within localStorage quotas.
 */
export const processImageFile = (
  file: File,
  maxDimension = 600,
  quality = 0.85
): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image. Please select a JPG, PNG, or WebP image.'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read the image file.'));
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Invalid or corrupted image file.'));
      };

      img.onload = () => {
        let { width, height } = img;

        // Resize if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data url if canvas 2D context is unavailable
          resolve({
            dataUrl: event.target?.result as string,
            name: file.name,
            size: file.size,
            width: img.width,
            height: img.height
          });
          return;
        }

        // Draw image cleanly with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        resolve({
          dataUrl,
          name: file.name,
          size: Math.round((dataUrl.length * 3) / 4), // Approximate byte size from base64
          width,
          height
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format bytes to readable size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
