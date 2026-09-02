import React from 'react';
import { Camera } from 'lucide-react';

/**
 * EvidenceViewer — Visual evidence artifacts panel.
 * All props and logic preserved exactly.
 * Visual redesign: light theme, clean evidence cards.
 */
const EvidenceViewer = ({ evidence = [], title = 'Visual Evidence Artifacts' }) => {
  if (!evidence || evidence.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--pg-surface-subtle)',
        border: '1px dashed var(--pg-border-strong)',
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Camera style={{ width: '13px', height: '13px', color: 'var(--pg-text-muted)', flexShrink: 0 }} />
        <p style={{ fontSize: '12px', color: 'var(--pg-text-muted)', margin: 0, fontStyle: 'italic' }}>
          No specific visual evidence artifacts uploaded.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--pg-surface)',
      border: '1px solid var(--pg-border)',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: 'var(--pg-shadow-sm)',
    }}>
      {/* Header */}
      <div style={{
        padding: '11px 16px',
        backgroundColor: 'var(--pg-surface-subtle)',
        borderBottom: '1px solid var(--pg-border)',
        display: 'flex', alignItems: 'center', gap: '7px',
      }}>
        <Camera style={{ width: '13px', height: '13px', color: 'var(--pg-text-muted)' }} />
        <h3 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
          {title}
        </h3>
      </div>

      <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {evidence.map((item, idx) => (
          <div key={item.id || idx} style={{
            backgroundColor: 'var(--pg-surface)',
            border: '1px solid var(--pg-border)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: 'var(--pg-surface-subtle)' }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '4px 8px',
                background: 'linear-gradient(to top, rgba(27,42,59,0.85), transparent)',
              }}>
                <p style={{ fontSize: '10.5px', fontWeight: 600, color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </p>
              </div>
            </div>
            {item.description && (
              <div style={{ padding: '8px 10px' }}>
                <p style={{ fontSize: '11px', color: 'var(--pg-text-muted)', lineHeight: 1.5, margin: 0 }}>{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceViewer;
