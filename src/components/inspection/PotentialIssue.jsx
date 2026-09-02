import React from 'react';
import { AlertTriangle, Image as ImageIcon, HelpCircle, ShieldAlert } from 'lucide-react';

/**
 * PotentialIssue — Identified non-compliance & flagged issues.
 * All props and business logic preserved exactly.
 * Visual redesign: light theme, clear issue hierarchy.
 */
const PotentialIssue = ({ issues = [], onSelectEvidence }) => {
  if (!issues || issues.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--pg-compliant-bg)',
        border: '1px solid var(--pg-compliant-border)',
        borderRadius: '8px',
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <ShieldAlert style={{ width: '16px', height: '16px', color: 'var(--pg-compliant-text)', flexShrink: 0 }} />
        <p style={{ fontSize: '12.5px', color: 'var(--pg-compliant-text)', margin: 0, fontWeight: 500 }}>
          No non-compliance flags identified. Package meets detected Legal Metrology rule checks.
        </p>
      </div>
    );
  }

  const severityStyle = (sev) => {
    if (sev === 'High') return { bg: 'var(--pg-fail-bg)', border: 'var(--pg-fail-border)', color: 'var(--pg-fail-text)' };
    return { bg: 'var(--pg-review-bg)', border: 'var(--pg-review-border)', color: 'var(--pg-review-text)' };
  };

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
        padding: '13px 18px',
        backgroundColor: 'var(--pg-review-bg)',
        borderBottom: '1px solid var(--pg-review-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert style={{ width: '14px', height: '14px', color: 'var(--pg-review-text)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pg-review-text)', margin: 0, letterSpacing: '-0.01em' }}>
            Flagged Issues &amp; Non-Compliance
          </h3>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
          padding: '3px 10px', borderRadius: '4px',
          backgroundColor: 'var(--pg-review-bg)',
          border: '1px solid var(--pg-review-border)',
          color: 'var(--pg-review-text)',
        }}>
          {issues.length} Issue{issues.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Issue cards */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {issues.map((issue, idx) => {
          const sevStyle = severityStyle(issue.severity);
          return (
            <div
              key={issue.id || idx}
              style={{
                border: `1px solid ${sevStyle.border}`,
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: sevStyle.bg,
              }}
            >
              {/* Issue header */}
              <div style={{
                padding: '10px 14px',
                borderBottom: `1px solid ${sevStyle.border}`,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
              }}>
                <div style={{ flex: 1 }}>
                  <span style={{
                    display: 'block',
                    fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                    color: sevStyle.color, marginBottom: '3px', opacity: 0.8,
                  }}>
                    POTENTIAL ISSUE
                  </span>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: sevStyle.color, margin: 0, lineHeight: 1.3 }}>
                    {issue.title}
                  </h4>
                  {issue.ruleReference && (
                    <p style={{
                      fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 600,
                      color: 'var(--pg-accent-text)', marginTop: '4px',
                      backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5',
                      borderRadius: '3px', display: 'inline-block', padding: '1px 6px',
                    }}>
                      {issue.ruleReference}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {issue.confidence && (
                    <span style={{
                      fontSize: '11px', fontFamily: 'monospace', fontWeight: 700,
                      padding: '2px 7px', borderRadius: '3px',
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      border: `1px solid ${sevStyle.border}`,
                      color: sevStyle.color,
                    }}>
                      {(issue.confidence * 100).toFixed(0)}% conf.
                    </span>
                  )}
                  <span style={{
                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                    padding: '3px 8px', borderRadius: '3px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    border: `1px solid ${sevStyle.border}`,
                    color: sevStyle.color,
                  }}>
                    {issue.severity || 'Medium'} Flag
                  </span>
                </div>
              </div>

              {/* Issue body */}
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Why flagged */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                    color: sevStyle.color, opacity: 0.8, marginBottom: '5px',
                  }}>
                    <HelpCircle style={{ width: '11px', height: '11px' }} />
                    Why Flagged
                  </div>
                  <p style={{
                    fontSize: '12.5px', lineHeight: 1.6, margin: 0,
                    color: 'var(--pg-text-secondary)',
                    backgroundColor: 'rgba(255,255,255,0.55)',
                    border: `1px solid ${sevStyle.border}`,
                    borderRadius: '5px', padding: '8px 12px',
                  }}>
                    {issue.reason || issue.explanation || 'Rule requirement evaluation pending.'}
                  </p>
                </div>

                {/* Image Evidence */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                    color: sevStyle.color, opacity: 0.8, marginBottom: '5px',
                  }}>
                    <ImageIcon style={{ width: '11px', height: '11px' }} />
                    Image Evidence
                  </div>

                  {issue.evidenceImageUrl ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                      backgroundColor: 'rgba(255,255,255,0.55)',
                      border: `1px solid ${sevStyle.border}`,
                      borderRadius: '5px', padding: '8px 10px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '5px',
                          overflow: 'hidden', backgroundColor: 'var(--pg-surface-subtle)',
                          border: '1px solid var(--pg-border)', flexShrink: 0,
                        }}>
                          <img
                            src={issue.evidenceImageUrl}
                            alt="Evidence"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--pg-text-primary)', margin: '0 0 2px' }}>
                            {issue.cropRegion || 'Package Label Region'}
                          </p>
                          <p style={{ fontSize: '10.5px', color: 'var(--pg-text-muted)', margin: 0 }}>OCR bounding box region</p>
                        </div>
                      </div>
                      {onSelectEvidence && (
                        <button
                          type="button"
                          onClick={() => onSelectEvidence(issue)}
                          style={{
                            padding: '5px 12px', borderRadius: '5px', cursor: 'pointer',
                            fontSize: '11.5px', fontWeight: 600,
                            backgroundColor: 'var(--pg-surface)',
                            border: '1px solid var(--pg-border-strong)',
                            color: 'var(--pg-text-secondary)',
                            transition: 'border-color 0.12s',
                            flexShrink: 0,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pg-accent)'; e.currentTarget.style.color = 'var(--pg-accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pg-border-strong)'; e.currentTarget.style.color = 'var(--pg-text-secondary)'; }}
                        >
                          View Evidence
                        </button>
                      )}
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '11.5px', fontStyle: 'italic', color: 'var(--pg-text-muted)',
                      padding: '8px 12px', margin: 0,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      border: `1px solid ${sevStyle.border}`,
                      borderRadius: '5px',
                    }}>
                      Evidence not available for this issue.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PotentialIssue;
