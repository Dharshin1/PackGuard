import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import InspectionTable from '../components/inspection/InspectionTable';
import EmptyState from '../components/common/EmptyState';
import { useInspections } from '../context/InspectionContext';
import {
  FileCheck2,
  AlertTriangle,
  FileText,
  Plus,
  History
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { inspections, loadDemoPresets } = useInspections();

  // Dynamic metrics from real data — unchanged
  const totalInspections = inspections.length;
  const requiresReviewCount = inspections.filter(
    (i) => i.status === 'Requires Inspector Review' || i.status === 'Requires Review'
  ).length;
  const reportsGeneratedCount = inspections.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Primary action row ─────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--pg-border)',
      }}>
        <button
          onClick={() => navigate('/new-inspection')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'var(--pg-accent)', color: '#ffffff',
            fontSize: '12.5px', fontWeight: 600,
            padding: '8px 16px', borderRadius: '6px',
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; }}
        >
          <Plus style={{ width: '14px', height: '14px' }} />
          <span>New Product Inspection</span>
        </button>
      </div>


      {/* ── Overview Metrics ─────────────────────────────────────── */}
      <div>
        <p style={{
          fontSize: '10.5px',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--pg-text-muted)',
          marginBottom: '10px',
        }}>
          Overview
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
        }}>
          <StatCard
            title="Total Inspections"
            value={totalInspections || '—'}
            icon={FileCheck2}
            color="indigo"
          />
          <StatCard
            title="Requires Review"
            value={requiresReviewCount || '—'}
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Reports Generated"
            value={reportsGeneratedCount || '—'}
            icon={FileText}
            color="emerald"
          />
        </div>
      </div>

      {/* ── Quick Actions (secondary, no duplicates) ─────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '10.5px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--pg-text-muted)',
          marginRight: '4px',
        }}>
          Navigate:
        </span>

        {/* Inspection History — secondary ghost link */}
        <button
          onClick={() => navigate('/history')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'var(--pg-surface)',
            color: 'var(--pg-text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
            padding: '5px 12px',
            borderRadius: '5px',
            border: '1px solid var(--pg-border)',
            cursor: 'pointer',
            transition: 'border-color 0.12s ease, color 0.12s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--pg-border-strong)';
            e.currentTarget.style.color = 'var(--pg-text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--pg-border)';
            e.currentTarget.style.color = 'var(--pg-text-secondary)';
          }}
        >
          <History style={{ width: '12px', height: '12px' }} />
          <span>Inspection Log</span>
        </button>

        {/* Reports — secondary ghost link */}
        <button
          onClick={() => navigate('/reports')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'var(--pg-surface)',
            color: 'var(--pg-text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
            padding: '5px 12px',
            borderRadius: '5px',
            border: '1px solid var(--pg-border)',
            cursor: 'pointer',
            transition: 'border-color 0.12s ease, color 0.12s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--pg-border-strong)';
            e.currentTarget.style.color = 'var(--pg-text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--pg-border)';
            e.currentTarget.style.color = 'var(--pg-text-secondary)';
          }}
        >
          <FileText style={{ width: '12px', height: '12px' }} />
          <span>Statutory Reports</span>
        </button>
      </div>

      {/* ── Recent Inspections ───────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--pg-text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Recent Inspections
          </h2>
          {totalInspections > 0 && (
            <button
              onClick={() => navigate('/history')}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--pg-accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--pg-accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--pg-accent)'; }}
            >
              View all →
            </button>
          )}
        </div>

        {totalInspections > 0 ? (
          <InspectionTable inspections={inspections.slice(0, 5)} />
        ) : (
          <EmptyState
            title="No inspections have been recorded yet."
            description="Start your first inspection by uploading a packaged commodity image."
            actionButton={
              <button
                onClick={() => navigate('/new-inspection')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
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
                <span>Start Inspection</span>
              </button>
            }
          />
        )}
      </div>

    </div>
  );
};

export default Dashboard;
