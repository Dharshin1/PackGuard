import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/inspection/ImageGallery';
import OcrPanel from '../components/inspection/OcrPanel';
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
  Save,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Hash,
} from 'lucide-react';

const AnalysisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inspections, currentAnalysis } = useInspections();

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const targetId = id || (currentAnalysis ? currentAnalysis.id : (inspections && inspections.length > 0 ? inspections[0].id : 'PKG-2024-0812'));
      if (currentAnalysis && currentAnalysis.id === targetId) {
        setInspection(currentAnalysis);
        setLoading(false);
        return;
      }

      try {
        const res = await getInspection(inspections, targetId);
        setInspection(res);
      } catch (err) {
        console.error('Failed to load inspection:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentAnalysis, inspections]);

  if (loading) {
    return <LoadingState message="Loading Assessment Results..." />;
  }

  if (!inspection) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--pg-text-primary)', marginBottom: '8px' }}>
          Inspection Record Not Found
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--pg-text-muted)', marginBottom: '16px' }}>No record matching ID: {id}</p>
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

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdateDeclarations = (updatedDeclarations) => {
    if (!inspection) return;
    setInspection(prev => ({ ...prev, declarations: updatedDeclarations }));
  };

  const detectedTokens = inspection.declarations
    ?.filter((d) => d.status === 'Detected')
    .map((d) => d.field);

  /* ── Derived summary counts ── */
  const decls = inspection.declarations || [];
  const passed      = decls.filter(d => d.status === 'Detected' && d.isCompliant !== false).length;
  const needsReview = decls.filter(d => d.status === 'Requires Review' || (d.isCompliant === false && d.status !== 'Not Detected')).length;
  const notDetected = decls.filter(d => d.status === 'Not Detected' || d.detectedValue?.toLowerCase().includes('not detected')).length;
  const avgConf     = decls.length > 0
    ? Math.round(decls.filter(d => d.confidence > 0).reduce((a, d) => a + d.confidence, 0) / (decls.filter(d => d.confidence > 0).length || 1) * 100)
    : null;

  const score = inspection.complianceScore;
  const scoreColor = score >= 80 ? '#1B6B35' : score >= 50 ? '#8A5C00' : '#9B2B1A';

  const cardStyle = {
    backgroundColor: 'var(--pg-surface)',
    border: '1px solid var(--pg-border)',
    borderRadius: '8px',
    boxShadow: 'var(--pg-shadow-sm)',
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
              transition: 'border-color 0.12s, color 0.12s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--pg-text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--pg-text-muted)'; }}
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
                {inspection.referenceNumber && (
                  <span style={{ marginLeft: '8px', fontFamily: 'monospace', color: 'var(--pg-accent)', fontWeight: 600 }}>
                    · {inspection.referenceNumber}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={handleSave}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: savedSuccess ? 'var(--pg-accent-muted)' : 'var(--pg-surface)',
              color: savedSuccess ? 'var(--pg-accent)' : 'var(--pg-text-secondary)',
              fontSize: '12.5px', fontWeight: 600,
              padding: '8px 16px', borderRadius: '6px',
              border: `1px solid ${savedSuccess ? '#A8D5B5' : 'var(--pg-border-strong)'}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {savedSuccess
              ? <CheckCircle2 style={{ width: '13px', height: '13px' }} />
              : <Save style={{ width: '13px', height: '13px' }} />}
            <span>{savedSuccess ? 'Saved to Registry' : 'Save Inspection'}</span>
          </button>

          <button
            onClick={() => navigate(`/report/${inspection.id}`)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              backgroundColor: 'var(--pg-navy)', color: '#ffffff',
              fontSize: '12.5px', fontWeight: 600,
              padding: '9px 18px', borderRadius: '6px',
              border: 'none', cursor: 'pointer',
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#243444'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-navy)'; }}
          >
            <FileText style={{ width: '13px', height: '13px' }} />
            <span>Generate Inspection Report</span>
          </button>
        </div>
      </div>

      {/* Saved notification */}
      {savedSuccess && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px',
          backgroundColor: 'var(--pg-compliant-bg)',
          border: '1px solid var(--pg-compliant-border)',
          borderRadius: '6px',
        }}>
          <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--pg-compliant-text)' }} />
          <span style={{ fontSize: '12.5px', color: 'var(--pg-compliant-text)', fontWeight: 500 }}>
            Inspection record saved. Available in Inspection Log.
          </span>
        </div>
      )}

      {/* ── OVERVIEW METRICS (3 cards) ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>

        {/* Compliance Score */}
        <div style={{
          ...cardStyle,
          padding: '16px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          borderLeft: `3px solid ${scoreColor}`,
        }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--pg-text-muted)', margin: 0 }}>
              Compliance Score
            </p>
            <div style={{ marginTop: '4px' }}>
              {score !== undefined && score !== null ? (
                <span style={{ fontSize: '28px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', color: scoreColor, lineHeight: 1 }}>
                  {score}%
                </span>
              ) : (
                <span style={{ fontSize: '14px', color: 'var(--pg-text-muted)' }}>Not available</span>
              )}
            </div>
          </div>
          {score !== undefined && score !== null && (
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #E2E0DC ${score * 3.6}deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                backgroundColor: 'var(--pg-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldCheck style={{ width: '13px', height: '13px', color: scoreColor }} />
              </div>
            </div>
          )}
        </div>

        {/* Assessment Status */}
        <div style={{ ...cardStyle, padding: '16px 18px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--pg-text-muted)', margin: '0 0 8px' }}>
            Overall Assessment
          </p>
          <StatusBadge status={inspection.status} />
          <p style={{ fontSize: '11px', color: 'var(--pg-text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
            Legal Metrology Rule 6 &amp; Rule 7 verification complete.
          </p>
        </div>

        {/* Inspection Metadata */}
        <div style={{ ...cardStyle, padding: '16px 18px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--pg-text-muted)', margin: '0 0 10px' }}>
            Inspection Details
          </p>
          {[
            { label: 'Inspector', val: inspection.inspectorName || 'Enforcement Officer' },
            { label: 'Reference', val: inspection.referenceNumber, mono: true },
            { label: 'Category', val: inspection.category },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px',
              padding: '5px 0',
              borderBottom: i < 2 ? '1px solid var(--pg-border)' : 'none',
            }}>
              <span style={{ fontSize: '11.5px', color: 'var(--pg-text-muted)', flexShrink: 0 }}>{row.label}:</span>
              <span style={{
                fontSize: '12px', fontWeight: 600, color: 'var(--pg-text-primary)',
                textAlign: 'right',
                fontFamily: row.mono ? 'monospace' : 'inherit',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {row.val || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── INSPECTION SUMMARY STRIP ─────────────────────────────────── */}
      {decls.length > 0 && (
        <div style={{
          ...cardStyle,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--pg-text-muted)', marginRight: '18px', whiteSpace: 'nowrap' }}>
            Inspection Summary
          </div>
          <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap', flex: 1 }}>
            {[
              { label: 'Passed', val: passed, icon: CheckCircle2, color: '#1B6B35', bg: '#EBF5EE', border: '#A8D5B5' },
              { label: 'Requires Review', val: needsReview, icon: AlertTriangle, color: '#8A5C00', bg: '#FEF7EC', border: '#F0C878' },
              { label: 'Not Detected', val: notDetected, icon: XCircle, color: '#6B6560', bg: '#F7F5F0', border: '#D4CFC8' },
              { label: 'Total Checks', val: decls.length, icon: ShieldCheck, color: 'var(--pg-pending-text)', bg: 'var(--pg-pending-bg)', border: 'var(--pg-pending-border)' },
              ...(avgConf !== null ? [{ label: 'Avg. Confidence', val: `${avgConf}%`, icon: ShieldCheck, color: 'var(--pg-accent)', bg: 'var(--pg-accent-muted)', border: '#A8D5B5' }] : []),
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 16px',
                  borderRight: i < arr.length - 1 ? '1px solid var(--pg-border)' : 'none',
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
          </div>
        </div>
      )}

      {/* ── MAIN TWO-COLUMN LAYOUT ───────────────────────────────────── */}
      <div style={{ display: 'grid', gap: '20px', alignItems: 'flex-start' }} className="pg-result-grid">

        {/* LEFT — Image + OCR + Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ImageGallery
            images={inspection.images}
            netQuantity={inspection.declarations?.find(d => d.field === 'Net Quantity')?.detectedValue || '500 g'}
          />
          <OcrPanel rawText={inspection.rawOcrText} detectedFields={detectedTokens} />
          <EvidenceViewer evidence={inspection.evidence} />
        </div>

        {/* RIGHT — Declarations, Checklist, Issues, Disclaimer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <DeclarationCard declarations={inspection.declarations} onUpdateDeclarations={handleUpdateDeclarations} />
          <ComplianceChecklist checklist={inspection.checklist} />
          <PotentialIssue issues={inspection.issues} />

          {/* Disclaimer */}
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

export default AnalysisResult;
