import React, { useState } from 'react';
import { Sliders, Server, Eye, FileText, CheckCircle2, Save, Database, Shield } from 'lucide-react';

const S = {
  card: {
    backgroundColor: 'var(--pg-surface)',
    border: '1px solid var(--pg-border)',
    borderRadius: '10px',
    boxShadow: 'var(--pg-shadow-sm)',
  },
  label: {
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--pg-text-muted)',
    marginBottom: '4px',
  },
};

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000/api/v1');
  const [enableSuperRes, setEnableSuperRes] = useState(true);
  const [enableRoiCrops, setEnableRoiCrops] = useState(true);
  const [strictnessLevel, setStrictnessLevel] = useState('Strict');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid var(--pg-border)', paddingBottom: '14px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--pg-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Sliders style={{ width: '20px', height: '20px', color: 'var(--pg-accent)' }} />
          <span>System Settings &amp; Configuration</span>
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--pg-text-muted)', marginTop: '4px', margin: 0 }}>
          Configure Python FastAPI endpoints, OpenCV image enhancement settings, OCR multi-pass parameters, and Legal Metrology rule strictness.
        </p>
      </div>

      {saved && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5', borderRadius: '6px', color: 'var(--pg-accent-text)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--pg-accent)' }} />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. FastAPI Server Connection */}
        <div style={{ ...S.card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--pg-border)', paddingBottom: '12px' }}>
            <Server style={{ width: '18px', height: '18px', color: 'var(--pg-accent)' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0 }}>
              Backend Microservice API Connection
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--pg-text-secondary)' }}>
              Python FastAPI Service Base Endpoint
            </label>
            <input
              type="text"
              className="pg-input"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="http://localhost:8000/api/v1"
            />
            <span style={{ fontSize: '11px', color: 'var(--pg-text-muted)' }}>
              Defines the host address for OpenCV, PaddleOCR, Rule Engine, and ReportLab PDF endpoints.
            </span>
          </div>
        </div>

        {/* 2. Computer Vision & Multi-Pass OCR Parameters */}
        <div style={{ ...S.card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--pg-border)', paddingBottom: '12px' }}>
            <Eye style={{ width: '18px', height: '18px', color: 'var(--pg-accent)' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0 }}>
              Computer Vision &amp; OCR Engine Parameters
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--pg-text-primary)' }}>
              <input
                type="checkbox"
                checked={enableSuperRes}
                onChange={(e) => setEnableSuperRes(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--pg-accent)' }}
              />
              <span><strong>Enable 2x Bicubic Super-Resolution &amp; Unsharp Mask Sharpening</strong> (Enhances Rule 7 small font legibility)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--pg-text-primary)' }}>
              <input
                type="checkbox"
                checked={enableRoiCrops}
                onChange={(e) => setEnableRoiCrops(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--pg-accent)' }}
              />
              <span><strong>Contour-Based High-Density ROI Text Cluster Cropping</strong> (Extracts Price &amp; Net Qty clusters)</span>
            </label>
          </div>
        </div>

        {/* 3. Legal Metrology Rule Engine Configuration */}
        <div style={{ ...S.card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--pg-border)', paddingBottom: '12px' }}>
            <Shield style={{ width: '18px', height: '18px', color: 'var(--pg-accent)' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0 }}>
              PCR 2011 Rule Engine Audit Strictness
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--pg-text-secondary)' }}>
              Rule Enforcement Strictness Level
            </label>
            <select
              value={strictnessLevel}
              onChange={(e) => setStrictnessLevel(e.target.value)}
              className="pg-input"
              style={{ cursor: 'pointer' }}
            >
              <option value="Strict">Strict — Require exact Rule 6 statutory phrasing (MRP, Net Qty, Mfg Date, Customer Care)</option>
              <option value="Moderate">Moderate — Allow minor abbreviation variations</option>
              <option value="Lenient">Lenient — Basic keyword presence check</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="pg-btn-primary" style={{ padding: '9px 22px', fontSize: '13px' }}>
            <Save style={{ width: '14px', height: '14px' }} />
            <span>Save System Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
