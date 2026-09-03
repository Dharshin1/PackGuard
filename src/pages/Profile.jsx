import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, LogOut, CheckCircle2, Shield, Building2, UserCheck, Hash } from 'lucide-react';

const S = {
  card: {
    backgroundColor: 'var(--pg-surface)',
    border: '1px solid var(--pg-border)',
    borderRadius: '10px',
    boxShadow: 'var(--pg-shadow-sm)',
  },
  navy: {
    backgroundColor: 'var(--pg-navy)',
    color: '#ffffff',
    border: '1px solid var(--pg-navy-border)',
    borderRadius: '8px',
  },
  label: {
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--pg-text-muted)',
    marginBottom: '3px',
  },
  value: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--pg-text-primary)',
  },
};

const Profile = () => {
  const navigate = useNavigate();

  // Role state for prototype demonstration (INSPECTOR / ADMIN)
  const [role, setRole] = useState('INSPECTOR');
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    setLoggedOut(true);
    setTimeout(() => {
      setLoggedOut(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid var(--pg-border)', paddingBottom: '14px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--pg-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <User style={{ width: '20px', height: '20px', color: 'var(--pg-accent)' }} />
          <span>Officer Credentials &amp; Account Profile</span>
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--pg-text-muted)', marginTop: '4px', margin: 0 }}>
          Authorized enforcement officer identity, role permissions, and active inspection portal session.
        </p>
      </div>

      {loggedOut && (
        <div style={{ padding: '12px', backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5', borderRadius: '6px', color: 'var(--pg-accent-text)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--pg-accent)' }} />
          <span>Officer session ended. Redirecting to portal home...</span>
        </div>
      )}

      {/* Main Account Card */}
      <div style={{ ...S.card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Officer Identity Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--pg-border)', paddingBottom: '18px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '10px',
              backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--pg-accent)', flexShrink: 0
            }}>
              <Shield style={{ width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0 }}>
                  Enforcement Inspector
                </h2>
                <span className="pg-badge pg-badge-compliant">
                  {role} ROLE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--pg-text-muted)', marginTop: '2px', margin: 0 }}>
                Department of Consumer Affairs | Legal Metrology Cell
              </p>
            </div>
          </div>

          {/* Role Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--pg-surface-subtle)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--pg-border)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--pg-text-muted)' }}>Role Context:</span>
            <button
              type="button"
              onClick={() => setRole('INSPECTOR')}
              className={role === 'INSPECTOR' ? 'pg-btn-primary' : 'pg-btn-ghost'}
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              Inspector
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={role === 'ADMIN' ? 'pg-btn-primary' : 'pg-btn-ghost'}
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Credentials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ ...S.card, padding: '12px 14px', backgroundColor: 'var(--pg-surface-subtle)' }}>
            <div style={S.label}>Officer ID</div>
            <div style={S.value}>LM-OFF-409</div>
          </div>

          <div style={{ ...S.card, padding: '12px 14px', backgroundColor: 'var(--pg-surface-subtle)' }}>
            <div style={S.label}>Jurisdiction / Zone</div>
            <div style={S.value}>Northern Enforcement Circle</div>
          </div>

          <div style={{ ...S.card, padding: '12px 14px', backgroundColor: 'var(--pg-surface-subtle)' }}>
            <div style={S.label}>Assigned Facility</div>
            <div style={S.value}>Central Inspection Wing</div>
          </div>
        </div>

        {/* Authorized Capabilities List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--pg-text-muted)', margin: 0 }}>
            {role} Statutory Capabilities (PCR 2011)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              'Create & record statutory packaged commodity inspections',
              'Upload Principal Display Panel (PDP) high-res images',
              'Execute OpenCV pre-processing & multi-pass OCR scans',
              'Run Rule 6 statutory declaration compliance engine',
              'Issue Official Legal Metrology Certificate PDF reports',
              'Override enforcement decision status & record legal notes'
            ].map((cap, i) => (
              <div key={i} style={{ padding: '10px 12px', backgroundColor: 'var(--pg-surface-subtle)', border: '1px solid var(--pg-border)', borderRadius: '6px', fontSize: '12px', color: 'var(--pg-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--pg-accent)', flexShrink: 0 }} />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--pg-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '12px', color: 'var(--pg-text-muted)' }}>
            Platform Version: <strong style={{ color: 'var(--pg-text-primary)' }}>PackGuard v1.0 (Legal Metrology Portal)</strong>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '8px 16px', backgroundColor: '#FBF0EE',
              border: '1px solid #EDADA3', color: '#9B2B1A',
              borderRadius: '6px', fontSize: '12px', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}
          >
            <LogOut style={{ width: '14px', height: '14px' }} />
            <span>End Session / Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
