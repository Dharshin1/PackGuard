import React, { useState, useRef } from 'react';
import { UploadCloud, X, Sparkles } from 'lucide-react';
import { DEMO_PRODUCTS } from '../../data/mockData';

/**
 * ImageUploader — STYLING ONLY.
 * All state, hooks, callbacks, file handling, validation,
 * upload logic, processFiles, changePanelType, removeImage,
 * and imports are preserved exactly.
 */
const ImageUploader = ({ images = [], onImagesChange, onSelectDemoSample }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // ── Preserved handlers (unchanged) ──────────────────────────────
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (files) => {
    const newFiles = Array.from(files);
    const updatedImages = [...images];

    newFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const typeLabel =
            updatedImages.length === 0
              ? 'Front'
              : updatedImages.length === 1
              ? 'Back'
              : updatedImages.length === 2
              ? 'Side'
              : 'Label/detail';

          updatedImages.push({
            id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file,
            title: file.name,
            type: typeLabel,
            url: e.target.result,
          });
          onImagesChange([...updatedImages]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id) => {
    const filtered = images.filter((img) => img.id !== id);
    onImagesChange(filtered);
  };

  const changePanelType = (id, newType) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, type: newType } : img
    );
    onImagesChange(updated);
  };
  // ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: dragActive
            ? '2px dashed var(--pg-accent)'
            : '2px dashed var(--pg-border-strong)',
          borderRadius: '8px',
          padding: '36px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragActive ? 'var(--pg-accent-muted)' : 'var(--pg-surface-subtle)',
          transition: 'border-color 0.15s ease, background-color 0.15s ease',
        }}
        onMouseEnter={e => {
          if (!dragActive) {
            e.currentTarget.style.borderColor = 'var(--pg-border-strong)';
            e.currentTarget.style.backgroundColor = '#ECEAE6';
          }
        }}
        onMouseLeave={e => {
          if (!dragActive) {
            e.currentTarget.style.borderColor = 'var(--pg-border-strong)';
            e.currentTarget.style.backgroundColor = 'var(--pg-surface-subtle)';
          }
        }}
      >
        {/* Hidden file input — preserved exactly */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        {/* Upload icon */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          backgroundColor: 'var(--pg-surface)',
          border: '1px solid var(--pg-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <UploadCloud style={{
            width: '20px',
            height: '20px',
            color: dragActive ? 'var(--pg-accent)' : 'var(--pg-text-muted)',
          }} />
        </div>

        <h4 style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--pg-text-primary)',
          margin: '0 0 4px',
          letterSpacing: '-0.01em',
        }}>
          Drop package images here
        </h4>
        <p style={{
          fontSize: '12px',
          color: 'var(--pg-text-muted)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          or{' '}
          <span style={{
            color: 'var(--pg-accent)',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}>
            browse your computer
          </span>
        </p>
        {/* Format pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['JPG', 'PNG', 'WEBP'].map(fmt => (
            <span key={fmt} style={{
              fontSize: '9.5px', fontWeight: 600, padding: '2px 7px',
              borderRadius: '4px', letterSpacing: '0.05em',
              backgroundColor: 'var(--pg-surface)',
              border: '1px solid var(--pg-border)',
              color: 'var(--pg-text-muted)',
            }}>{fmt}</span>
          ))}
          <span style={{ fontSize: '9.5px', color: 'var(--pg-text-muted)', marginLeft: '2px' }}>· Up to 4 panels</span>
        </div>
      </div>

      {/* Image previews — preserved: map, changePanelType, removeImage */}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--pg-text-muted)',
          }}>
            Selected Images ({images.length})
          </span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '10px',
          }}>
            {images.map((img, index) => (
              <div
                key={img.id || index}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--pg-surface)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--pg-border)',
                  boxShadow: 'var(--pg-shadow-sm)',
                }}
              >
                <img
                  src={img.url}
                  alt={img.title || `Package Panel ${index + 1}`}
                  style={{ width: '100%', height: '112px', objectFit: 'cover', display: 'block' }}
                />

                {/* Panel type selector — preserved exactly */}
                <div style={{ position: 'absolute', top: '6px', left: '6px' }}>
                  <select
                    value={img.type || 'Front'}
                    onChange={(e) => changePanelType(img.id, e.target.value)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      color: 'var(--pg-text-primary)',
                      border: '1px solid var(--pg-border)',
                      fontSize: '10px',
                      fontWeight: 600,
                      borderRadius: '4px',
                      padding: '2px 5px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Front">Front</option>
                    <option value="Back">Back</option>
                    <option value="Side">Side</option>
                    <option value="Label/detail">Label/detail</option>
                  </select>
                </div>

                {/* Remove button — preserved exactly */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  title="Remove image"
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    backgroundColor: '#DC2626',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ffffff',
                  }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>

                {/* Filename */}
                <div style={{
                  padding: '5px 8px',
                  fontSize: '10.5px',
                  color: 'var(--pg-text-secondary)',
                  backgroundColor: 'var(--pg-surface)',
                  borderTop: '1px solid var(--pg-border)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {img.title || `Panel ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
