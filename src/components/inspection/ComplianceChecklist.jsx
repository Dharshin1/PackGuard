import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

/**
 * ComplianceChecklist — Rule compliance checklist.
 * All props and business logic preserved exactly.
 * Visual redesign: light cards, proper contrast.
 */
const ComplianceChecklist = ({ checklist = [] }) => {
  if (!checklist || checklist.length === 0) return null;

  const passed = checklist.filter((c) => c.compliant === true).length;
  const total  = checklist.length;

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
        backgroundColor: 'var(--pg-surface-subtle)',
        borderBottom: '1px solid var(--pg-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--pg-accent)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
            Rule Compliance Checklist
          </h3>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
          padding: '3px 10px', borderRadius: '4px',
          backgroundColor: passed === total ? 'var(--pg-compliant-bg)' : 'var(--pg-review-bg)',
          border: `1px solid ${passed === total ? 'var(--pg-compliant-border)' : 'var(--pg-review-border)'}`,
          color: passed === total ? 'var(--pg-compliant-text)' : 'var(--pg-review-text)',
        }}>
          {passed}/{total} Passed
        </span>
      </div>

      {/* Checklist rows */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {checklist.map((check, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '6px',
              border: `1px solid ${check.compliant ? 'var(--pg-compliant-border)' : 'var(--pg-fail-border)'}`,
              backgroundColor: check.compliant ? 'var(--pg-compliant-bg)' : 'var(--pg-fail-bg)',
            }}
          >
            {check.compliant ? (
              <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--pg-compliant-text)', flexShrink: 0, marginTop: '1px' }} />
            ) : (
              <XCircle style={{ width: '14px', height: '14px', color: 'var(--pg-fail-text)', flexShrink: 0, marginTop: '1px' }} />
            )}
            <p style={{
              flex: 1, margin: 0,
              fontSize: '12.5px', lineHeight: 1.5,
              color: check.compliant ? 'var(--pg-compliant-text)' : 'var(--pg-fail-text)',
              fontWeight: 500,
            }}>
              {check.item}
            </p>
            <span style={{
              fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '2px 7px', borderRadius: '3px', whiteSpace: 'nowrap', flexShrink: 0,
              backgroundColor: check.compliant ? 'rgba(27,107,53,0.12)' : 'rgba(155,43,26,0.10)',
              color: check.compliant ? 'var(--pg-compliant-text)' : 'var(--pg-fail-text)',
              border: `1px solid ${check.compliant ? 'var(--pg-compliant-border)' : 'var(--pg-fail-border)'}`,
            }}>
              {check.compliant ? 'PASSED' : 'FAILED'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceChecklist;
