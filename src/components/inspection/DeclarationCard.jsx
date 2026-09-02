import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Edit2, Check, X, MinusCircle } from 'lucide-react';

/**
 * DeclarationCard — Legal Metrology Compliance Check Table.
 * All state, hooks, callbacks, and business logic are preserved exactly.
 * Visual redesign: light table, better status badges, readable confidence display.
 */
const DeclarationCard = ({ declarations = [], onUpdateDeclarations }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [items, setItems] = useState(declarations);

  // Sync state if prop changes — preserved exactly
  React.useEffect(() => {
    setItems(declarations);
  }, [declarations]);

  if (!items || items.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--pg-surface)',
        border: '1px solid var(--pg-border)',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12.5px',
        color: 'var(--pg-text-muted)',
      }}>
        No declaration metrics available.
      </div>
    );
  }

  // ── Preserved handlers (unchanged) ──────────────────────────────
  const handleStartEdit = (idx, currentValue) => {
    setEditingIndex(idx);
    setEditValue(currentValue.includes('Not detected') ? '' : currentValue);
  };

  const handleSaveEdit = (idx) => {
    const updated = [...items];
    const item = { ...updated[idx] };
    item.detectedValue = editValue.trim() || 'Not detected in uploaded image';
    item.status = editValue.trim() ? 'Detected' : 'Not Detected';
    item.isCompliant = editValue.trim().length > 0;
    item.confidence = 1.0;
    updated[idx] = item;
    setItems(updated);
    setEditingIndex(null);
    if (onUpdateDeclarations) onUpdateDeclarations(updated);
  };
  // ────────────────────────────────────────────────────────────────

  const renderStatusBadge = (item) => {
    const isNotDetected =
      item.status === 'Not Detected' ||
      item.detectedValue?.toLowerCase().includes('not detected');

    if (isNotDetected) {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 600, padding: '3px 8px',
          borderRadius: '4px', whiteSpace: 'nowrap',
          backgroundColor: '#F7F5F0', border: '1px solid #D4CFC8', color: '#6B6560',
        }}>
          <MinusCircle style={{ width: '10px', height: '10px' }} />
          NOT DETECTED
        </span>
      );
    }

    if (item.status === 'Detected' && item.isCompliant !== false) {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 600, padding: '3px 8px',
          borderRadius: '4px', whiteSpace: 'nowrap',
          backgroundColor: 'var(--pg-compliant-bg)', border: '1px solid var(--pg-compliant-border)', color: 'var(--pg-compliant-text)',
        }}>
          <CheckCircle2 style={{ width: '10px', height: '10px' }} />
          PASS
        </span>
      );
    }

    if (item.isCompliant === false && item.status !== 'Requires Review') {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 600, padding: '3px 8px',
          borderRadius: '4px', whiteSpace: 'nowrap',
          backgroundColor: 'var(--pg-fail-bg)', border: '1px solid var(--pg-fail-border)', color: 'var(--pg-fail-text)',
        }}>
          <XCircle style={{ width: '10px', height: '10px' }} />
          NON-COMPLIANT
        </span>
      );
    }

    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '11px', fontWeight: 600, padding: '3px 8px',
        borderRadius: '4px', whiteSpace: 'nowrap',
        backgroundColor: 'var(--pg-review-bg)', border: '1px solid var(--pg-review-border)', color: 'var(--pg-review-text)',
      }}>
        <AlertTriangle style={{ width: '10px', height: '10px' }} />
        REVIEW
      </span>
    );
  };

  const renderConfidence = (item) => {
    if (item.confidence === undefined || item.confidence === null || item.confidence <= 0) {
      return <span style={{ color: 'var(--pg-border-strong)', fontSize: '11px' }}>—</span>;
    }
    const pct = Math.round(item.confidence * 100);
    const barColor = pct >= 85 ? '#1B6B35' : pct >= 60 ? '#8A5C00' : '#9B2B1A';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
        <span style={{ fontSize: '11.5px', fontWeight: 700, color: barColor, fontVariantNumeric: 'tabular-nums' }}>
          {pct}%
        </span>
        <div style={{ width: '48px', height: '3px', borderRadius: '2px', backgroundColor: '#E2E0DC' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', backgroundColor: barColor }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'var(--pg-surface)',
      border: '1px solid var(--pg-border)',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: 'var(--pg-shadow-sm)',
    }}>
      {/* Table header bar */}
      <div style={{
        padding: '13px 18px',
        backgroundColor: 'var(--pg-navy)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText style={{ width: '14px', height: '14px', color: 'var(--pg-nav-text)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
            Compliance Check Table
          </h3>
        </div>
        <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
          PCR 2011 · Mandatory Rules
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr style={{
              backgroundColor: 'var(--pg-surface-subtle)',
              borderBottom: '1px solid var(--pg-border)',
            }}>
              {['Declaration Field', 'Extracted Value', 'Status', 'Rule Reference', 'Confidence'].map((col, i) => (
                <th key={col} style={{
                  padding: '10px 14px',
                  fontSize: '9.5px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--pg-text-muted)',
                  textAlign: i === 4 ? 'right' : 'left',
                  whiteSpace: 'nowrap',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const isNotDetected =
                item.status === 'Not Detected' ||
                item.detectedValue?.toLowerCase().includes('not detected');
              const displayValue = isNotDetected ? 'Not detected in uploaded image' : item.detectedValue;
              const isEditing = editingIndex === idx;
              const isEven = idx % 2 === 0;

              return (
                <tr key={idx} style={{
                  backgroundColor: isEven ? '#FFFFFF' : 'var(--pg-surface-subtle)',
                  borderBottom: '1px solid var(--pg-border)',
                  transition: 'background-color 0.1s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-muted)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = isEven ? '#FFFFFF' : 'var(--pg-surface-subtle)'; }}
                >
                  {/* Declaration Field */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    <span style={{
                      fontSize: '12.5px', fontWeight: 600,
                      color: 'var(--pg-text-primary)', lineHeight: 1.3,
                    }}>
                      {item.field}
                    </span>
                  </td>

                  {/* Extracted Value — editable */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{
                            flex: 1, minWidth: 0,
                            backgroundColor: 'var(--pg-surface)',
                            border: '1px solid var(--pg-accent)',
                            borderRadius: '4px',
                            padding: '5px 8px',
                            fontSize: '12px',
                            color: 'var(--pg-text-primary)',
                            outline: 'none',
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(idx)}
                          style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#2C6E49', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}
                          title="Save"
                        >
                          <Check style={{ width: '12px', height: '12px' }} />
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--pg-surface-subtle)', border: '1px solid var(--pg-border)', cursor: 'pointer', color: 'var(--pg-text-muted)', display: 'flex' }}
                          title="Cancel"
                        >
                          <X style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '12px', lineHeight: 1.4,
                          color: isNotDetected ? 'var(--pg-review-text)' : 'var(--pg-text-primary)',
                          fontStyle: isNotDetected ? 'italic' : 'normal',
                          fontFamily: !isNotDetected ? 'inherit' : 'inherit',
                        }}>
                          {displayValue}
                        </span>
                        <button
                          onClick={() => handleStartEdit(idx, item.detectedValue)}
                          style={{
                            padding: '2px', borderRadius: '3px',
                            backgroundColor: 'transparent', border: 'none',
                            cursor: 'pointer', color: 'var(--pg-border-strong)',
                            display: 'flex', opacity: 0.6,
                            transition: 'opacity 0.1s, color 0.1s',
                          }}
                          title="Edit extracted value"
                          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--pg-accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = 'var(--pg-border-strong)'; }}
                        >
                          <Edit2 style={{ width: '11px', height: '11px' }} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    {renderStatusBadge(item)}
                  </td>

                  {/* Rule Reference */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    <span style={{
                      fontSize: '11px', fontFamily: 'monospace', fontWeight: 600,
                      color: 'var(--pg-accent-text)',
                      backgroundColor: 'var(--pg-accent-muted)',
                      border: '1px solid #A8D5B5',
                      borderRadius: '3px', padding: '2px 6px',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.ruleRef || 'Rule 6'}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                    {renderConfidence(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeclarationCard;
