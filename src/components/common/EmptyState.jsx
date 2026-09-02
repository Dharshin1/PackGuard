import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState — STYLING ONLY.
 * All props (title, description, icon, actionButton) are preserved exactly.
 * No new CTAs added. Existing actionButton prop is preserved.
 */
const EmptyState = ({
  title = 'No inspections recorded yet',
  description = 'Start your first inspection by uploading a packaged commodity image.',
  icon: Icon = Inbox,
  actionButton
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '28px 24px',
      textAlign: 'center',
      backgroundColor: 'var(--pg-surface)',
      border: '1px dashed var(--pg-border-strong)',
      borderRadius: '8px',
      margin: '4px 0',
    }}>
      {/* Icon container — proportional, not decorative */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: 'var(--pg-surface-subtle)',
        border: '1px solid var(--pg-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
      }}>
        <Icon style={{ width: '18px', height: '18px', color: 'var(--pg-text-muted)' }} />
      </div>

      <h4 style={{
        fontSize: '13.5px',
        fontWeight: 600,
        color: 'var(--pg-text-primary)',
        marginBottom: '4px',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h4>
      <p style={{
        fontSize: '12px',
        color: 'var(--pg-text-muted)',
        maxWidth: '360px',
        marginBottom: actionButton ? '14px' : '0',
        lineHeight: 1.6,
      }}>
        {description}
      </p>

      {/* Existing actionButton — rendered as-is, no duplication */}
      {actionButton && actionButton}
    </div>
  );
};

export default EmptyState;
