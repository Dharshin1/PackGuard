import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

/**
 * OcrPanel — Raw OCR text stream panel.
 * All state, handlers, and logic preserved exactly.
 * Visual redesign: light outer container, dark pre block kept for readability.
 */
const OcrPanel = ({ rawText, detectedFields = [] }) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const sampleRawText = rawText || `
[PRINCIPAL DISPLAY PANEL OCR STREAM]
BRAND: NUTRIPURE FOODS INDIA PVT LTD
PRODUCT: ORGANIC ALMOND MILK
NET QUANTITY: 1 Litre (1000 ml)
MAXIMUM RETAIL PRICE (MRP): RS. 240.00 INCL. OF ALL TAXES
MFG DATE: 07/2026
BATCH NO: NP-8801-A
ADDRESS: PLOT 45, FOOD PARK, PHASE-3, RAI, HARYANA - 131029
CONSUMER CARE: 1800-11-9988 | CARE@NUTRIPURE.IN
COUNTRY OF ORIGIN: INDIA
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleRawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      backgroundColor: 'var(--pg-surface)',
      border: '1px solid var(--pg-border)',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: 'var(--pg-shadow-sm)',
    }}>
      {/* Clickable header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '11px 14px',
          backgroundColor: 'var(--pg-surface-subtle)',
          borderBottom: expanded ? '1px solid var(--pg-border)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <FileText style={{ width: '13px', height: '13px', color: 'var(--pg-text-muted)' }} />
          <h3 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
            Raw OCR Text Stream
          </h3>
          <span style={{
            fontSize: '9.5px', fontWeight: 600, fontFamily: 'monospace',
            padding: '2px 7px', borderRadius: '3px',
            backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5',
            color: 'var(--pg-accent-text)',
          }}>
            Tesseract OCR
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '4px 9px', borderRadius: '4px',
              backgroundColor: 'var(--pg-surface)', border: '1px solid var(--pg-border)',
              fontSize: '11px', color: 'var(--pg-text-muted)', cursor: 'pointer',
              transition: 'border-color 0.12s, color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pg-border-strong)'; e.currentTarget.style.color = 'var(--pg-text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pg-border)'; e.currentTarget.style.color = 'var(--pg-text-muted)'; }}
            title="Copy OCR text"
          >
            {copied
              ? <Check style={{ width: '11px', height: '11px', color: 'var(--pg-compliant-text)' }} />
              : <Copy style={{ width: '11px', height: '11px' }} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {expanded
            ? <ChevronUp style={{ width: '14px', height: '14px', color: 'var(--pg-text-muted)' }} />
            : <ChevronDown style={{ width: '14px', height: '14px', color: 'var(--pg-text-muted)' }} />}
        </div>
      </div>

      {/* Body — dark pre block kept intentionally for readability */}
      {expanded && (
        <div style={{ padding: '12px', backgroundColor: 'var(--pg-surface-subtle)' }}>
          <pre style={{
            fontSize: '10.5px', fontFamily: 'monospace',
            color: '#E2E8F0', lineHeight: 1.7,
            overflowX: 'auto', whiteSpace: 'pre-wrap',
            margin: 0,
            padding: '12px 14px',
            backgroundColor: 'var(--pg-navy)',
            border: '1px solid var(--pg-navy-border)',
            borderRadius: '5px',
          }}>
            {sampleRawText}
          </pre>

          {detectedFields.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', paddingTop: '10px', alignItems: 'center' }}>
              <span style={{
                fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                color: 'var(--pg-text-muted)', marginRight: '4px',
              }}>
                Detected:
              </span>
              {detectedFields.map((field, idx) => (
                <span key={idx} style={{
                  padding: '2px 8px', borderRadius: '3px',
                  fontSize: '10px', fontFamily: 'monospace', fontWeight: 600,
                  backgroundColor: 'var(--pg-accent-muted)',
                  border: '1px solid #A8D5B5',
                  color: 'var(--pg-accent-text)',
                }}>
                  {field}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OcrPanel;
