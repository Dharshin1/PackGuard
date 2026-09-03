import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import StatusBadge from '../components/common/StatusBadge';
import { Calendar, Download, Eye, FileText, Plus } from 'lucide-react';

/**
 * ReportsList — Statutory Reports page.
 * All data access, routing, and business logic preserved exactly.
 * Duplicate page header removed (shell Header renders page title).
 * Fixed: missing FileCheck + ArrowRight imports that caused crash.
 */
const ReportsList = () => {
  const navigate = useNavigate();
  const { inspections } = useInspections();

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch { return iso; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── EMPTY STATE ──────────────────────────────────────────────── */}
      {inspections.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px', textAlign: 'center',
          backgroundColor: 'var(--pg-surface)',
          border: '1px solid var(--pg-border)',
          borderRadius: '8px',
          gap: '12px',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            backgroundColor: 'var(--pg-pending-bg)',
            border: '1px solid var(--pg-pending-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText style={{ width: '20px', height: '20px', color: 'var(--pg-pending-text)' }} />
          </div>
          <div>
            <p style={{
              fontSize: '14px', fontWeight: 600,
              color: 'var(--pg-text-primary)', margin: '0 0 4px',
            }}>
              No reports generated yet
            </p>
            <p style={{
              fontSize: '12.5px', color: 'var(--pg-text-muted)',
              margin: 0, maxWidth: '320px', lineHeight: 1.55,
            }}>
              Reports are generated automatically when an inspection is completed.
            </p>
          </div>
          <button
            onClick={() => navigate('/new-inspection')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              marginTop: '4px',
              backgroundColor: 'var(--pg-accent)', color: '#ffffff',
              fontSize: '12.5px', fontWeight: 600,
              padding: '8px 18px', borderRadius: '6px',
              border: 'none', cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; }}
          >
            <Plus style={{ width: '13px', height: '13px' }} />
            <span>Start an Inspection</span>
          </button>
        </div>
      ) : (

        /* ── REPORTS TABLE ───────────────────────────────────────── */
        <div style={{
          backgroundColor: 'var(--pg-surface)',
          border: '1px solid var(--pg-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 'var(--pg-shadow-sm)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '20%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '24%' }} />
                <col style={{ width: '14%' }} />
              </colgroup>

              {/* Dark navy header */}
              <thead>
                <tr style={{ backgroundColor: 'var(--pg-navy)', borderBottom: '1px solid var(--pg-navy-border)' }}>
                  {[
                    { label: 'Report ID',          align: 'left' },
                    { label: 'Product / Category', align: 'left' },
                    { label: 'Generated Date',     align: 'left' },
                    { label: 'Assessment Status',  align: 'left' },
                    { label: 'Actions',            align: 'right' },
                  ].map((col) => (
                    <th key={col.label} style={{
                      padding: '11px 16px',
                      fontSize: '9.5px', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.55)',
                      textAlign: col.align,
                      whiteSpace: 'nowrap',
                    }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Light body */}
              <tbody>
                {inspections.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: isEven ? 'var(--pg-surface)' : 'var(--pg-surface-subtle)',
                        borderBottom: '1px solid var(--pg-border)',
                        transition: 'background-color 0.1s ease',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/report/${item.id}`)}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-muted)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = isEven ? 'var(--pg-surface)' : 'var(--pg-surface-subtle)'; }}
                    >
                      {/* Report ID */}
                      <td style={{ padding: '13px 16px', verticalAlign: 'middle' }}>
                        <span style={{
                          display: 'inline-block',
                          fontFamily: 'monospace', fontSize: '11px', fontWeight: 700,
                          color: 'var(--pg-pending-text)',
                          backgroundColor: 'var(--pg-pending-bg)',
                          border: '1px solid var(--pg-pending-border)',
                          borderRadius: '3px', padding: '2px 7px',
                        }}>
                          REP-{item.id}
                        </span>
                      </td>

                      {/* Product */}
                      <td style={{ padding: '13px 16px', verticalAlign: 'middle' }}>
                        <div style={{
                          fontSize: '13px', fontWeight: 600,
                          color: 'var(--pg-text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          marginBottom: '2px',
                        }}>
                          {item.productName}
                        </div>
                        <div style={{
                          fontSize: '11px', color: 'var(--pg-text-muted)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {item.category}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '13px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar style={{ width: '11px', height: '11px', color: 'var(--pg-text-muted)', flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: 'var(--pg-text-secondary)', whiteSpace: 'nowrap' }}>
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '13px 16px', verticalAlign: 'middle' }}>
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Actions */}
                      <td
                        style={{ padding: '13px 16px', verticalAlign: 'middle', textAlign: 'right' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          {/* View */}
                          <button
                            onClick={() => navigate(`/report/${item.id}`)}
                            title="View Report"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '5px 11px', borderRadius: '5px',
                              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                              backgroundColor: 'var(--pg-surface)',
                              border: '1px solid var(--pg-border-strong)',
                              color: 'var(--pg-text-secondary)',
                              transition: 'border-color 0.12s, color 0.12s',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pg-accent)'; e.currentTarget.style.color = 'var(--pg-accent)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pg-border-strong)'; e.currentTarget.style.color = 'var(--pg-text-secondary)'; }}
                          >
                            <Eye style={{ width: '12px', height: '12px' }} />
                            <span>View</span>
                          </button>

                          {/* Download */}
                          <button
                            onClick={() => navigate(`/report/${item.id}`)}
                            title="Download Report"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '5px 11px', borderRadius: '5px',
                              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                              backgroundColor: '#F5F3FF',
                              border: '1px solid #C4B5FD',
                              color: '#6D28D9',
                              transition: 'background-color 0.12s, border-color 0.12s',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EDE9FE'; e.currentTarget.style.borderColor = '#A78BFA'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F5F3FF'; e.currentTarget.style.borderColor = '#C4B5FD'; }}
                          >
                            <Download style={{ width: '12px', height: '12px' }} />
                            <span>Download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}
    </div>
  );
};

export default ReportsList;
