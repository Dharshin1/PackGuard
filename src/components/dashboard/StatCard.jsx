import React from 'react';

/**
 * StatCard — STYLING ONLY.
 * Props: title, value, icon, color — data contract unchanged.
 * displayValue logic unchanged.
 */
const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  // Icon accent colors — restrained, no neon
  const iconStyleMap = {
    indigo: { bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE' },
    emerald: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
    amber: { bg: '#FFFBEB', color: '#B45309', border: '#FCD34D' },
    rose: { bg: '#FFF1F2', color: '#BE123C', border: '#FECDD3' },
  };

  const iconStyle = iconStyleMap[color] || iconStyleMap.indigo;

  // Preserve existing displayValue logic exactly
  const displayValue =
    value !== undefined && value !== null && value !== 0 && value !== '0'
      ? value
      : '—';

  return (
    <div
      style={{
        backgroundColor: 'var(--pg-surface)',
        border: '1px solid var(--pg-border)',
        borderRadius: '8px',
        padding: '20px 22px',
        boxShadow: 'var(--pg-shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--pg-shadow)';
        e.currentTarget.style.borderColor = 'var(--pg-border-strong)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--pg-shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--pg-border)';
      }}
    >
      {/* Label + Value */}
      <div>
        <p style={{
          fontSize: '10.5px',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--pg-text-muted)',
          margin: 0,
        }}>
          {title}
        </p>
        <p style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--pg-text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginTop: '6px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {displayValue}
        </p>
      </div>

      {/* Icon */}
      {Icon && (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: iconStyle.bg,
          border: `1px solid ${iconStyle.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon style={{ width: '18px', height: '18px', color: iconStyle.color }} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
