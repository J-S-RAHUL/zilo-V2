import React, { useRef, useState } from 'react';
import { Upload, Plus, X, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { processImageFile, formatFileSize } from '../utils/imageUtils';

interface MultiImageFileUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const MultiImageFileUpload: React.FC<MultiImageFileUploadProps> = ({
  images,
  onChange,
  maxImages = 4,
  label = 'Work Photos / Portfolio (Optional)',
  helperText = 'Upload photos of your previous work, finished projects, or certificates from your files.'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length >= maxImages) {
      setErrorMessage(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const remainingSlots = maxImages - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      const newUrls: string[] = [];
      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue;
        const res = await processImageFile(file, 800, 0.85);
        newUrls.push(res.dataUrl);
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing some image files.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="multi-image-upload-component" style={{ marginBottom: '1.25rem' }}>
      <label className="form-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
        {label}
      </label>
      <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 0, marginBottom: '10px' }}>
        {helperText}
      </p>

      {/* Hidden file input supporting multiple selection */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Render uploaded image cards */}
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              width: '90px',
              height: '90px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          >
            <img
              src={imgUrl}
              alt={`Work sample ${idx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              title="Remove image"
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {/* Add photo trigger button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '12px',
              border: '2px dashed #93c5fd',
              background: '#f8fafc',
              color: '#2563eb',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#93c5fd';
              e.currentTarget.style.background = '#f8fafc';
            }}
          >
            {isProcessing ? (
              <RefreshCw size={20} className="spin-animate" />
            ) : (
              <>
                <Plus size={22} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Add from Files</span>
              </>
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <div style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '6px' }}>
          ⚠️ {errorMessage}
        </div>
      )}
    </div>
  );
};
