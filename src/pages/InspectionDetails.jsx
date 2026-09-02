import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/inspection/ImageGallery';
import DeclarationCard from '../components/inspection/DeclarationCard';
import ComplianceChecklist from '../components/inspection/ComplianceChecklist';
import PotentialIssue from '../components/inspection/PotentialIssue';
import EvidenceViewer from '../components/inspection/EvidenceViewer';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import { getInspection } from '../services/api';
import { useInspections } from '../context/InspectionContext';
import {
  FileText,
  ArrowLeft,
  MapPin,
  UserCheck,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hash,
} from 'lucide-react';

/* ─── Shared inline-style tokens for this page ─── */
const S = {
  card: {
    backgroundColor: 'var(--pg-surface)',
    border: '1px solid var(--pg-border)',
    borderRadius: '8px',
    boxShadow: 'var(--pg-shadow-sm)',
  },
  navy: {
    backgroundColor: 'var(--pg-navy)',
    border: '1px solid var(--pg-navy-border)',
    borderRadius: '8px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: 'var(--pg-text-muted)',
    marginBottom: '3px',
  },
  value: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--pg-text-primary)',
    lineHeight: 1.3,
  },
};

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inspections, getInspectionById, updateInspectionStatus } = useInspections();

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overrideStatus, setOverrideStatus] = useState('');
  const [overrideNotes, setOverrideNotes] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      const fromContext = getInspectionById(id);
      if (fromContext) {
        setInspection(fromContext);
        setOverrideStatus(fromContext.status);
        setOverrideNotes(fromContext.summaryNotes || '');
        setLoading(false);
        return;
      }

      try {
        const res = await getInspection(inspections, id);
        setInspection(res);
        setOverrideStatus(res.status);
        setOverrideNotes(res.summaryNotes || '');
      } catch (err) {
        console.error('Failed to fetch inspection details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, inspections, getInspectionById]);

  const handleStatusUpdate = () => {
    if (overrideStatus && inspection) {
      updateInspectionStatus(inspection.id, overrideStatus, overrideNotes);
      setInspection((prev) => ({
        ...prev,
        status: overrideStatus,
        summaryNotes: overrideNotes,
      }));
      alert('Inspector enforcement decision updated successfully.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading Inspection Record..." />;
  }

  if (!inspection) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--pg-text-primary)', marginBottom: '8px' }}>
          Inspection Case Not Found
        </h2>
        <button
          onClick={() => navigate('/history')}
          style={{
            padding: '8px 18px', borderRadius: '6px',
            backgroundColor: 'var(--pg-accent)', color: '#fff',
            border: 'none', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Back to History
        </button>
      </div>
    );
  }

  /* ── Derived summary counts ── */
  const decls = inspection.declarations || [];
  const passed     = decls.filter(d => d.status === 'Detected' && d.isCompliant !== false).length;
  const needsReview= decls.filter(d => d.status === 'Requires Review' || (d.isCompliant === false && d.status !== 'Not Detected')).length;
  const notDetected= decls.filter(d => d.status === 'Not Detected' || d.detectedValue?.toLowerCase().includes('not detected')).length;
  const avgConf    = decls.length > 0
    ? Math.round(decls.filter(d => d.confidence > 0).reduce((a, d) => a + d.confidence, 0) / (decls.filter(d => d.confidence > 0).length || 1) * 100)
    : null;

  const score = inspection.complianceScore;
  const scoreColor = score >= 80 ? '#1B6B35' : score >= 50 ? '#8A5C00' : '#9B2B1A';
  const scoreBg    = score >= 80 ? '#EBF5EE' : score >= 50 ? '#FEF7EC' : '#FBF0EE';

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1280px' }}>

      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        paddingBottom: '18px',
        borderBottom: '1px solid var(--pg-border)',
      }}>
        {/* Left: back + ID + status + title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <button
            onClick={() => navigate('/history')}
            style={{
              marginTop: '2px',
              width: '34px', height: '34px', borderRadius: '6px',
              backgroundColor: 'var(--pg-surface)',
              border: '1px solid var(--pg-border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--pg-text-muted)', cursor: 'pointer',
              transition: 'border-color 0.12s ease, color 0.12s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pg-border-strong)'; e.currentTarget.style.color = 'var(--pg-text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pg-border-strong)'; e.currentTarget.style.color = 'var(--pg-text-muted)'; }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontFamily: 'monospace', fontSize: '11.5px', fontWeight: 700,
                color: 'var(--pg-accent)', backgroundColor: 'var(--pg-accent-muted)',
                border: '1px solid #A8D5B5', borderRadius: '4px', padding: '2px 8px',
              }}>
                <Hash style={{ width: '10px', height: '10px' }} />
                {inspection.id}
              </span>
              <StatusBadge status={inspection.status} />
            </div>
            <h1 style={{
              fontSize: '20px', fontWeight: 700,
              color: 'var(--pg-text-primary)',
              letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0,
            }}>
              {inspection.productName}
            </h1>
            {inspection.category && (
              <p style={{ fontSize: '12px', color: 'var(--pg-text-muted)', marginTop: '3px' }}>
                {inspection.category}
              </p>
            )}
          </div>
        </div>

        {/* Right: primary action */}
        <button
          onClick={() => navigate(`/report/${inspection.id}`)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            backgroundColor: 'var(--pg-navy)', color: '#ffffff',
            fontSize: '12.5px', fontWeight: 600,
            padding: '9px 18px', borderRadius: '6px',
            border: 'none', cursor: 'pointer',
            transition: 'background-color 0.12s ease',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#243444'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-navy)'; }}
        >
          <FileText style={{ width: '14px', height: '14px' }} />
          <span>Generate Official Report</span>
        </button>
      </div>

      {/* ── METADATA STRIP (4 cards) ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>

        {/* Inspector */}
        <div style={{ ...S.card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            backgroundColor: 'var(--pg-pending-bg)', border: '1px solid var(--pg-pending-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <UserCheck style={{ width: '16px', height: '16px', color: 'var(--pg-pending-text)' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={S.label}>Inspector Officer</div>
            <div style={{ ...S.value, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {inspection.inspectorName || 'Enforcement Officer'}
            </div>
          </div>
        </div>

        {/* Date */}
        <div style={{ ...S.card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clock style={{ width: '16px', height: '16px', color: 'var(--pg-accent)' }} />
          </div>
          <div>
            <div style={S.label}>Inspection Date</div>
            <div style={S.value}>{formatDate(inspection.date)}</div>
          </div>
        </div>

        {/* Location */}
        <div style={{ ...S.card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            backgroundColor: '#FEF7EC', border: '1px solid #F0C878',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin style={{ width: '16px', height: '16px', color: 'var(--pg-review-text)' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={S.label}>Facility Location</div>
            <div style={{ ...S.value, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {inspection.location || '—'}
            </div>
          </div>
        </div>

        {/* Compliance Score — visually distinct */}
        <div style={{
          ...S.card,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px',
          borderLeft: `3px solid ${scoreColor}`,
        }}>
          <div>
            <div style={S.label}>Compliance Score</div>
            <div style={{
              fontSize: '26px', fontWeight: 800, fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.03em', lineHeight: 1.1,
              color: scoreColor,
              marginTop: '2px',
            }}>
              {score !== undefined && score !== null ? `${score}%` : '—'}
            </div>
          </div>
          {score !== undefined && score !== null && (
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #E2E0DC ${score * 3.6}deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: 'var(--pg-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldCheck style={{ width: '13px', height: '13px', color: scoreColor }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── INSPECTION SUMMARY STRIP ─────────────────────────────────── */}
      {decls.length > 0 && (
        <div style={{
          backgroundColor: 'var(--pg-surface)',
          border: '1px solid var(--pg-border)',
          borderRadius: '8px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          flexWrap: 'wrap',
          boxShadow: 'var(--pg-shadow-sm)',
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--pg-text-muted)', marginRight: '18px', whiteSpace: 'nowrap' }}>
            Inspection Summary
          </div>
          <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap', flex: 1 }}>
            {[
              { label: 'Checks Passed', val: passed, icon: CheckCircle2, color: '#1B6B35', bg: '#EBF5EE', border: '#A8D5B5' },
              { label: 'Requires Review', val: needsReview, icon: AlertTriangle, color: '#8A5C00', bg: '#FEF7EC', border: '#F0C878' },
              { label: 'Not Detected', val: notDetected, icon: XCircle, color: '#6B6560', bg: '#F7F5F0', border: '#D4CFC8' },
              { label: 'Total Checks', val: decls.length, icon: ShieldCheck, color: 'var(--pg-pending-text)', bg: 'var(--pg-pending-bg)', border: 'var(--pg-pending-border)' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 16px',
                  borderRight: i < 3 ? '1px solid var(--pg-border)' : 'none',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '6px',
                    backgroundColor: item.bg, border: `1px solid ${item.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon style={{ width: '12px', height: '12px', color: item.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: item.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{item.val}</div>
                    <div style={{ fontSize: '10px', color: 'var(--pg-text-muted)', marginTop: '1px' }}>{item.label}</div>
                  </div>
                </div>
              );
            })}
            {avgConf !== null && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', flexShrink: 0,
              }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '6px',
                  backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ShieldCheck style={{ width: '12px', height: '12px', color: 'var(--pg-accent)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--pg-accent)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{avgConf}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--pg-text-muted)', marginTop: '1px' }}>Avg. Confidence</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MAIN TWO-COLUMN LAYOUT ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'flex-start' }}
        className="pg-result-grid">

        {/* LEFT — Image + Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ImageGallery images={inspection.images} />
          <EvidenceViewer evidence={inspection.evidence} />
        </div>

        {/* RIGHT — Table + Checklist + Issues + Review Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <DeclarationCard declarations={inspection.declarations} />
          <ComplianceChecklist checklist={inspection.checklist} />
          <PotentialIssue issues={inspection.issues} />

          {/* ── Inspector Review & Decision Override ── */}
          <div style={{
            ...S.card,
            padding: '18px 20px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              paddingBottom: '14px', marginBottom: '16px',
              borderBottom: '1px solid var(--pg-border)',
            }}>
              <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--pg-accent)', flexShrink: 0 }} />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0 }}>
                Inspector Review &amp; Decision Override
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px', fontWeight: 600,
                  color: 'var(--pg-text-secondary)',
                  marginBottom: '5px',
                }}>
                  Enforcement Status Decision
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--pg-surface)',
                    border: '1px solid var(--pg-border)',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    fontSize: '12.5px',
                    color: 'var(--pg-text-primary)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--pg-border)'; }}
                >
                  <option value="Compliant">Compliant</option>
                  <option value="Requires Inspector Review">Requires Inspector Review</option>
                  <option value="Potential Non-Compliance">Potential Non-Compliance</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px', fontWeight: 600,
                  color: 'var(--pg-text-secondary)',
                  marginBottom: '5px',
                }}>
                  Officer Remarks / Action Notes
                </label>
                <input
                  type="text"
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Enter remarks or legal notice reference…"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--pg-surface)',
                    border: '1px solid var(--pg-border)',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    fontSize: '12.5px',
                    color: 'var(--pg-text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--pg-border)'; }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                type="button"
                onClick={handleStatusUpdate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: 'var(--pg-accent)', color: '#ffffff',
                  fontSize: '12.5px', fontWeight: 600,
                  padding: '8px 18px', borderRadius: '6px',
                  border: 'none', cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; }}
              >
                Update Official Status
              </button>
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--pg-surface-subtle)',
            border: '1px solid var(--pg-border)',
            borderRadius: '6px',
          }}>
            <AlertCircle style={{ width: '13px', height: '13px', color: 'var(--pg-text-muted)', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '11.5px', color: 'var(--pg-text-muted)', lineHeight: 1.55, margin: 0 }}>
              <strong style={{ color: 'var(--pg-text-secondary)' }}>Statutory Notice: </strong>
              This AI-assisted assessment supports inspector review and does not constitute a final legal determination under the Legal Metrology Act 2009.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
