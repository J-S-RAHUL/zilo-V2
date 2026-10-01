import React, { useRef, useState } from 'react';
import { Upload, Camera, X, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { processImageFile, formatFileSize } from '../utils/imageUtils';

interface ImageFileUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  helperText?: string;
  variant?: 'circle' | 'card' | 'banner';
  presets?: string[];
  maxDimension?: number;
}

export const ImageFileUpload: React.FC<ImageFileUploadProps> = ({
  value,
  onChange,
  label = 'Upload Image',
  helperText = 'Select an image from your files or device (JPG, PNG, WebP up to 10MB)',
  variant = 'circle',
  presets = [],
  maxDimension = 600
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const processed = await processImageFile(file, maxDimension, 0.85);
      onChange(processed.dataUrl);
      setFileDetails({
        name: processed.name,
        size: processed.size
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading image file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileDetails(null);
    if (presets.length > 0) {
      onChange(presets[0]);
    } else {
      onChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-file-upload-component" style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: variant === 'circle' ? 'row' : 'column',
          alignItems: variant === 'circle' ? 'center' : 'stretch',
          gap: '16px',
          padding: '14px',
          background: isDragging ? '#eff6ff' : '#f8fafc',
          border: isDragging ? '2px dashed #2563eb' : '1px dashed #cbd5e1',
          borderRadius: '16px',
          transition: 'all 0.2s ease'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Preview image */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {variant === 'circle' ? (
            <div
              onClick={triggerFileSelect}
              title="Click to choose image from files"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #2563eb',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.18)',
                cursor: 'pointer',
                position: 'relative',
                background: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {value ? (
                <img
                  src={value}
                  alt="Selected avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Camera size={30} color="#64748b" />
              )}
              {/* Overlay hover effect */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.45)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.15s ease'
                }}
                className="avatar-overlay-hover"
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <Camera size={20} />
                <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: 600 }}>Change</span>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileSelect}
              style={{
                width: '100%',
                maxHeight: '180px',
                height: '140px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
            >
              {value ? (
                <img
                  src={value}
                  alt="Site preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <ImageIcon size={32} style={{ margin: '0 auto 6px' }} />
                  <span style={{ fontSize: '0.85rem' }}>No image chosen</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={15} className="spin-animate" /> Processing...
                </>
              ) : (
                <>
                  <Upload size={15} /> Add from Files
                </>
              )}
            </button>

            {fileDetails && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#dcfce7',
                  color: '#166534',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                <Check size={14} /> File loaded ({formatFileSize(fileDetails.size)})
              </span>
            )}

            {value && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <X size={14} /> Reset
              </button>
            )}
          </div>

          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
            {helperText}
          </p>

          {errorMessage && (
            <p style={{ fontSize: '0.82rem', color: '#dc2626', marginTop: '4px', marginBottom: 0 }}>
              ⚠️ {errorMessage}
            </p>
          )}

          {/* Quick Preset Avatars if provided */}
          {presets.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '6px', fontWeight: 500 }}>
                Or choose from sample avatars:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presets.map((presetUrl, idx) => (
                  <img
                    key={idx}
                    src={presetUrl}
                    alt={`Sample avatar ${idx + 1}`}
                    onClick={() => {
                      setFileDetails(null);
                      setErrorMessage(null);
                      onChange(presetUrl);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: value === presetUrl ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      transform: value === presetUrl ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: value === presetUrl ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
