import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingState from '../components/common/LoadingState';
import StatusBadge from '../components/common/StatusBadge';
import { generateReport } from '../services/api';
import { useInspections } from '../context/InspectionContext';
import {
  Printer,
  ArrowLeft,
  Scale,
  Download,
  FileCheck,
  Building2,
  Calendar,
  UserCheck,
  MapPin,
  Hash,
  ShieldCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';

const S = {
  card: {
    backgroundColor: 'var(--pg-surface)',
    border: '1px solid var(--pg-border)',
    borderRadius: '10px',
    boxShadow: 'var(--pg-shadow)',
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
    marginBottom: '4px',
  },
  value: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--pg-text-primary)',
  },
};

const ReportPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inspections, getInspectionById } = useInspections();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const fromContext = getInspectionById(id);
      if (fromContext) {
        setReportData({
          reportId: `REP-${fromContext.id}`,
          generatedAt: new Date().toISOString(),
          inspection: fromContext,
          pdfDownloadUrl: `http://localhost:8000/api/v1/inspections/${fromContext.id}/pdf`,
          disclaimer:
            'This statutory compliance assessment is issued under Legal Metrology (Packaged Commodities) Rules 2011 to assist enforcement officers in rule verification.',
        });
        setLoading(false);
        return;
      }

      try {
        const res = await generateReport(inspections, id);
        setReportData(res);
      } catch (err) {
        console.error('Failed to generate report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, inspections, getInspectionById]);

  if (loading) {
    return <LoadingState message="Generating Statutory Compliance Report..." />;
  }

  if (!reportData || !reportData.inspection) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--pg-text-primary)', marginBottom: '8px' }}>
          Compliance Report Not Found
        </h2>
        <button
          onClick={() => navigate('/history')}
          className="pg-btn-primary"
        >
          Back to Inspection History
        </button>
      </div>
    );
  }

  const { inspection } = reportData;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPythonPdf = () => {
    const pdfUrl = reportData.pdfDownloadUrl || `http://localhost:8000/api/v1/inspections/${id}/pdf`;
    window.open(pdfUrl, '_blank');
  };

  const formatDate = (isoDate) => {
    try {
      return new Date(isoDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      
      {/* ── TOP CONTROL BAR (Hidden on print) ────────────────────────── */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--pg-border)' }}>
        <button
          onClick={() => navigate(-1)}
          className="pg-btn-secondary"
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleDownloadPythonPdf}
            className="pg-btn-primary"
          >
            <Download style={{ width: '14px', height: '14px' }} />
            <span>Download Official PDF Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="pg-btn-secondary"
          >
            <Printer style={{ width: '14px', height: '14px' }} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ── OFFICIAL REPORT CERTIFICATE CARD ───────────────────────────── */}
      <div
        className="print-container"
        style={{
          ...S.card,
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Official Government / Legal Metrology Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '2px solid var(--pg-border-strong)', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '8px',
              backgroundColor: 'var(--pg-accent)', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Scale style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--pg-text-primary)', letterSpacing: '-0.02em' }}>
                  Pack<span style={{ color: 'var(--pg-accent)' }}>Guard</span>
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', backgroundColor: 'var(--pg-accent-muted)',
                  color: 'var(--pg-accent-text)', border: '1px solid #A8D5B5',
                  padding: '2px 8px', borderRadius: '4px'
                }}>
                  Legal Metrology Portal
                </span>
              </div>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pg-text-secondary)', marginTop: '2px' }}>
                Statutory PCR 2011 Compliance Verification Report
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--pg-text-muted)', margin: 0 }}>
                Ministry of Consumer Affairs, Food &amp; Public Distribution | Department of Legal Metrology
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '11.5px', fontFamily: 'monospace' }}>
            <div style={{ color: 'var(--pg-text-muted)' }}>REPORT CODE: <strong style={{ color: 'var(--pg-accent)' }}>{reportData.reportId}</strong></div>
            <div style={{ color: 'var(--pg-text-muted)' }}>INSPECTION ID: <strong style={{ color: 'var(--pg-text-primary)' }}>{inspection.id}</strong></div>
            <div style={{ color: 'var(--pg-text-muted)' }}>ISSUE DATE: <strong style={{ color: 'var(--pg-text-primary)' }}>{formatDate(inspection.date)}</strong></div>
          </div>
        </div>

        {/* 1. Product & Enforcement Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ ...S.card, padding: '16px', backgroundColor: 'var(--pg-surface-subtle)' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pg-text-primary)', borderBottom: '1px solid var(--pg-border)', paddingBottom: '8px', marginBottom: '12px' }}>
              1. Product &amp; Packaging Identity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: 'var(--pg-text-muted)', fontWeight: 500 }}>Commodity Name:</span> <strong style={{ color: 'var(--pg-text-primary)' }}>{inspection.productName}</strong></div>
              <div><span style={{ color: 'var(--pg-text-muted)', fontWeight: 500 }}>Brand / Manufacturer:</span> <span style={{ color: 'var(--pg-text-primary)', fontWeight: 600 }}>{inspection.brand || 'Standard Packer Pvt Ltd'}</span></div>
              <div><span style={{ color: 'var(--pg-text-muted)', fontWeight: 500 }}>Product Category:</span> <span style={{ color: 'var(--pg-text-secondary)' }}>{inspection.category || 'Beverages & Liquids'}</span></div>
            </div>
          </div>

          <div style={{ ...S.card, padding: '16px', backgroundColor: 'var(--pg-surface-subtle)' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pg-text-primary)', borderBottom: '1px solid var(--pg-border)', paddingBottom: '8px', marginBottom: '12px' }}>
              2. Enforcement Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: 'var(--pg-text-muted)', fontWeight: 500 }}>Inspector Officer:</span> <strong style={{ color: 'var(--pg-text-primary)' }}>{inspection.inspectorName || 'Enforcement Inspector'}</strong></div>
              <div><span style={{ color: 'var(--pg-text-muted)', fontWeight: 500 }}>Facility Location:</span> <span style={{ color: 'var(--pg-text-secondary)' }}>{inspection.location || 'Inspection Facility'}</span></div>
              <div><span style={{ color: 'var(--pg-text-muted)', fontWeight: 500 }}>Reference Memo:</span> <span style={{ fontFamily: 'monospace', color: 'var(--pg-text-primary)' }}>{inspection.referenceNumber || `REF-${inspection.id}`}</span></div>
            </div>
          </div>
        </div>

        {/* 2. Assessment Status Banner */}
        <div style={{ ...S.navy, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pg-navy-text)' }}>
              Overall Legal Metrology Status
            </div>
            <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <StatusBadge status={inspection.status} />
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{inspection.status}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', borderLeft: '1px solid var(--pg-navy-border)', paddingLeft: '24px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pg-navy-text)' }}>
              Rule 6 Compliance Score
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'monospace', color: '#ffffff', marginTop: '2px' }}>
              {inspection.complianceScore !== undefined ? `${inspection.complianceScore}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* 3. Mandatory Declarations Table */}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pg-text-primary)', borderBottom: '1px solid var(--pg-border)', paddingBottom: '8px', marginBottom: '14px' }}>
            3. Mandatory Declarations Audit (Rule 6, PCR 2011)
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--pg-surface-subtle)', borderBottom: '1px solid var(--pg-border-strong)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--pg-text-primary)', fontWeight: 700 }}>Declaration Field</th>
                <th style={{ padding: '10px 12px', color: 'var(--pg-text-primary)', fontWeight: 700 }}>Detected Package Value</th>
                <th style={{ padding: '10px 12px', color: 'var(--pg-text-primary)', fontWeight: 700 }}>Rule Reference</th>
                <th style={{ padding: '10px 12px', color: 'var(--pg-text-primary)', fontWeight: 700, textAlign: 'center' }}>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {inspection.declarations?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--pg-border)', backgroundColor: idx % 2 === 0 ? 'var(--pg-surface)' : 'var(--pg-surface-subtle)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--pg-text-primary)' }}>{item.field}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--pg-text-primary)' }}>{item.detectedValue}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--pg-text-muted)' }}>{item.ruleRef}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span className={`pg-badge ${item.status === 'Detected' && item.isCompliant !== false ? 'pg-badge-compliant' : 'pg-badge-review'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Identified Offence / Non-Compliance Flags */}
        {inspection.issues && inspection.issues.length > 0 && (
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pg-text-primary)', borderBottom: '1px solid var(--pg-border)', paddingBottom: '8px', marginBottom: '14px' }}>
              4. Identified Non-Compliance Flags &amp; Offence References
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inspection.issues.map((iss, idx) => (
                <div key={idx} style={{ padding: '14px', backgroundColor: 'var(--pg-review-bg)', border: '1px solid var(--pg-review-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pg-review-text)' }}>{iss.title}</span>
                    <span className="pg-badge pg-badge-review">{iss.severity} Priority</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--pg-text-primary)', margin: 0, lineHeight: 1.5 }}>
                    {iss.reason || iss.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Package Image Evidence */}
        {inspection.images && inspection.images[0] && (
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pg-text-primary)', borderBottom: '1px solid var(--pg-border)', paddingBottom: '8px', marginBottom: '14px' }}>
              5. Principal Display Panel Evidence Image
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', backgroundColor: 'var(--pg-surface-subtle)', border: '1px solid var(--pg-border)', borderRadius: '8px' }}>
              <img
                src={inspection.images[0].url}
                alt="Principal Display Panel"
                style={{ maxHeight: '220px', borderRadius: '6px', border: '1px solid var(--pg-border-strong)', objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        {/* Official Statutory Disclaimer & Signatures */}
        <div style={{ paddingTop: '20px', borderTop: '2px solid var(--pg-border-strong)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '14px', backgroundColor: 'var(--pg-surface-subtle)', border: '1px solid var(--pg-border)', borderRadius: '6px', fontSize: '11.5px', color: 'var(--pg-text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--pg-text-primary)', display: 'block', marginBottom: '2px' }}>Statutory Disclaimer &amp; Notice:</strong>
            {reportData.disclaimer}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px', paddingTop: '16px' }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0 }}>Department of Legal Metrology</p>
              <p style={{ fontSize: '11px', color: 'var(--pg-text-muted)', margin: 0 }}>Ministry of Consumer Affairs, Govt. of India</p>
            </div>
            <div style={{ textAlign: 'right', borderTop: '1px solid var(--pg-border-strong)', paddingTop: '6px', width: '200px' }}>
              <p style={{ fontWeight: 700, color: 'var(--pg-text-primary)', margin: 0 }}>Enforcement Inspector Signature</p>
              <p style={{ fontSize: '11px', color: 'var(--pg-text-muted)', margin: 0 }}>{inspection.inspectorName || 'Enforcement Inspector'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
