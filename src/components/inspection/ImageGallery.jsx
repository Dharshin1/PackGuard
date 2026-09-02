import React, { useState } from 'react';
import { Eye, Layers, Cpu } from 'lucide-react';
import LabelProcessor from './LabelProcessor';

/**
 * ImageGallery — Package image viewer.
 * All state, handlers, and feature logic preserved exactly.
 * Visual redesign: light container, clean badge treatment.
 */
const ImageGallery = ({ images = [], netQuantity = '500 g' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [openCvMode, setOpenCvMode] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--pg-surface)',
        border: '1px dashed var(--pg-border-strong)',
        borderRadius: '8px',
        padding: '32px 16px',
        textAlign: 'center',
        fontSize: '12.5px',
        color: 'var(--pg-text-muted)',
      }}>
        No product images available
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{
        backgroundColor: 'var(--pg-surface)',
        border: '1px solid var(--pg-border)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'var(--pg-shadow-sm)',
      }}>
        {/* Header */}
        <div style={{
          padding: '10px 14px',
          backgroundColor: 'var(--pg-surface-subtle)',
          borderBottom: '1px solid var(--pg-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Eye style={{ width: '13px', height: '13px', color: 'var(--pg-text-muted)' }} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--pg-text-primary)' }}>
              {currentImage.title || `Panel ${selectedIndex + 1}`}
            </span>
            <span style={{
              fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '2px 7px', borderRadius: '3px',
              backgroundColor: 'var(--pg-pending-bg)', border: '1px solid var(--pg-pending-border)',
              color: 'var(--pg-pending-text)',
            }}>
              {currentImage.type || 'Panel View'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* OpenCV Toggle */}
            <button
              type="button"
              onClick={() => setOpenCvMode(!openCvMode)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px', borderRadius: '4px',
                fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                border: '1px solid',
                transition: 'all 0.12s ease',
                ...(openCvMode
                  ? { backgroundColor: 'var(--pg-navy)', color: '#ffffff', borderColor: 'var(--pg-navy)' }
                  : { backgroundColor: 'var(--pg-surface)', color: 'var(--pg-text-muted)', borderColor: 'var(--pg-border-strong)' }
                ),
              }}
              onMouseEnter={e => { if (!openCvMode) { e.currentTarget.style.borderColor = 'var(--pg-accent)'; e.currentTarget.style.color = 'var(--pg-accent)'; } }}
              onMouseLeave={e => { if (!openCvMode) { e.currentTarget.style.borderColor = 'var(--pg-border-strong)'; e.currentTarget.style.color = 'var(--pg-text-muted)'; } }}
            >
              <Cpu style={{ width: '11px', height: '11px' }} />
              <span>{openCvMode ? 'Exit OpenCV View' : 'OpenCV Vision Mode'}</span>
            </button>

            {currentImage.annotations && currentImage.annotations.length > 0 && !openCvMode && (
              <button
                type="button"
                onClick={() => setShowAnnotations(!showAnnotations)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '4px',
                  fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  border: '1px solid',
                  transition: 'all 0.12s ease',
                  ...(showAnnotations
                    ? { backgroundColor: 'var(--pg-accent-muted)', color: 'var(--pg-accent)', borderColor: '#A8D5B5' }
                    : { backgroundColor: 'var(--pg-surface)', color: 'var(--pg-text-muted)', borderColor: 'var(--pg-border-strong)' }
                  ),
                }}
              >
                <Layers style={{ width: '11px', height: '11px' }} />
                <span>{showAnnotations ? 'Hide Boxes' : 'Show Boxes'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Image Viewer */}
        {openCvMode ? (
          <div style={{ padding: '12px', backgroundColor: 'var(--pg-surface-subtle)' }}>
            <LabelProcessor imageSource={currentImage} netQuantity={netQuantity} />
          </div>
        ) : (
          <div style={{
            position: 'relative',
            backgroundColor: '#F8F7F4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '280px', maxHeight: '400px',
            overflow: 'hidden', padding: '16px',
          }}>
            <img
              src={currentImage.url}
              alt={currentImage.title || 'Product Image'}
              style={{
                maxHeight: '360px',
                maxWidth: '100%',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '4px',
                boxShadow: 'var(--pg-shadow)',
              }}
            />

            {/* Bounding box annotations — logic unchanged */}
            {showAnnotations && currentImage.annotations?.map((anno, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: `${anno.y}%`, left: `${anno.x}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(44, 110, 73, 0.90)',
                  border: '1px solid rgba(74, 222, 128, 0.6)',
                  color: '#ffffff',
                  fontSize: '9.5px', fontWeight: 700,
                  padding: '2px 7px', borderRadius: '3px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                {anno.label}
              </div>
            ))}
          </div>
        )}

        {/* Thumbnails — logic unchanged */}
        {images.length > 1 && (
          <div style={{
            padding: '10px 12px',
            backgroundColor: 'var(--pg-surface-subtle)',
            borderTop: '1px solid var(--pg-border)',
            display: 'flex', gap: '8px', overflowX: 'auto',
          }}>
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  width: '56px', height: '56px',
                  borderRadius: '5px', overflow: 'hidden',
                  border: `2px solid ${selectedIndex === idx ? 'var(--pg-accent)' : 'var(--pg-border)'}`,
                  padding: 0, cursor: 'pointer', flexShrink: 0,
                  opacity: selectedIndex === idx ? 1 : 0.65,
                  transition: 'border-color 0.12s, opacity 0.12s',
                  boxShadow: selectedIndex === idx ? '0 0 0 2px var(--pg-accent-muted)' : 'none',
                }}
                onMouseEnter={e => { if (selectedIndex !== idx) e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { if (selectedIndex !== idx) e.currentTarget.style.opacity = '0.65'; }}
              >
                <img
                  src={img.url}
                  alt={img.title || `Panel ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
