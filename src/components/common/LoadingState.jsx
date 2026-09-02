import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

/**
 * LoadingState — STYLING ONLY.
 * All props (message, subtext, steps) and step rendering logic are preserved.
 */
const LoadingState = ({
  message = 'Assessment in Progress',
  subtext = 'Processing packaged commodity panel images.',
  steps = []
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 24px',
      textAlign: 'center',
    }}>
      {/* Spinner */}
      <div style={{ marginBottom: '20px' }}>
        <Loader2 style={{
          width: '28px',
          height: '28px',
          color: 'var(--pg-accent)',
          animation: 'spin 1s linear infinite',
        }} />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <h3 style={{
        fontSize: '15px',
        fontWeight: 700,
        color: 'var(--pg-text-primary)',
        marginBottom: '6px',
        letterSpacing: '-0.01em',
      }}>
        {message}
      </h3>
      <p style={{
        fontSize: '12.5px',
        color: 'var(--pg-text-muted)',
        maxWidth: '360px',
        marginBottom: steps.length > 0 ? '24px' : '0',
        lineHeight: 1.6,
      }}>
        {subtext}
      </p>

      {/* Step list — preserved logic, updated presentation */}
      {steps.length > 0 && (
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--pg-surface)',
          border: '1px solid var(--pg-border)',
          borderRadius: '8px',
          padding: '4px 0',
          textAlign: 'left',
        }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: idx < steps.length - 1 ? '1px solid var(--pg-border)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Step indicator — logic unchanged */}
                {step.completed ? (
                  <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--pg-compliant-text)', flexShrink: 0 }} />
                ) : step.active ? (
                  <Loader2 style={{ width: '14px', height: '14px', color: 'var(--pg-accent)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--pg-border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: 'var(--pg-text-muted)',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                )}
                <span style={{
                  fontSize: '12.5px',
                  fontWeight: step.active ? 600 : step.completed ? 500 : 400,
                  color: step.active
                    ? 'var(--pg-text-primary)'
                    : step.completed
                    ? 'var(--pg-text-secondary)'
                    : 'var(--pg-text-muted)',
                }}>
                  {step.label}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--pg-text-muted)', fontFamily: 'monospace' }}>
                {step.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingState;
