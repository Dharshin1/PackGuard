import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/inspection/ImageUploader';
import LoadingState from '../components/common/LoadingState';
import { PRODUCT_CATEGORIES } from '../data/mockData';
import { uploadInspection, analyzeInspection } from '../services/api';
import { useInspections } from '../context/InspectionContext';
import { Scan, MapPin, Hash, Package, AlertCircle, CheckCircle2 } from 'lucide-react';

const NewInspection = () => {
  const navigate = useNavigate();
  const { addInspection } = useInspections();

  // ── Form State — preserved exactly ──────────────────────────────
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [location, setLocation] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState(null);

  // ── Processing State Sequence — preserved exactly ────────────────
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState([
    { label: 'Images received', status: 'Pending', active: false, completed: false },
    { label: 'Image preprocessing', status: 'Pending', active: false, completed: false },
    { label: 'Text regions detected', status: 'Pending', active: false, completed: false },
    { label: 'Extracting declarations', status: 'Pending', active: false, completed: false },
    { label: 'Running compliance assessment', status: 'Pending', active: false, completed: false },
  ]);

  // ── Handlers — preserved exactly ────────────────────────────────
  const handleSelectDemoSample = (demo) => {
    setImages(demo.images);
    setProductName(demo.productName);
    setCategory(demo.category);
    setLocation(demo.location);
    setReferenceNumber(demo.referenceNumber);
    setSelectedDemoId(demo.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload or select at least one package image.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Step 1
      setAnalysisSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, active: true, status: 'Processing...' } : s))
      );
      await uploadInspection({ images, category });
      await new Promise((r) => setTimeout(r, 400));

      // Step 2
      setAnalysisSteps((prev) =>
        prev.map((s, i) =>
          i === 0
            ? { ...s, active: false, completed: true, status: '✓' }
            : i === 1
            ? { ...s, active: true, status: 'Processing...' }
            : s
        )
      );
      await new Promise((r) => setTimeout(r, 400));

      // Step 3
      setAnalysisSteps((prev) =>
        prev.map((s, i) =>
          i === 1
            ? { ...s, active: false, completed: true, status: '✓' }
            : i === 2
            ? { ...s, active: true, status: 'Processing...' }
            : s
        )
      );
      await new Promise((r) => setTimeout(r, 400));

      // Step 4 & 5
      setAnalysisSteps((prev) =>
        prev.map((s, i) =>
          i === 2
            ? { ...s, active: false, completed: true, status: '✓' }
            : i === 3
            ? { ...s, active: true, status: 'Extracting OCR...' }
            : s
        )
      );

      const result = await analyzeInspection({
        productName: productName || 'Uploaded Packaged Commodity',
        category,
        location: location || 'Inspection Facility',
        referenceNumber: referenceNumber || `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        images,
        demoSampleId: selectedDemoId,
      });

      setAnalysisSteps((prev) =>
        prev.map((s, i) =>
          i === 3
            ? { ...s, active: false, completed: true, status: '✓' }
            : i === 4
            ? { ...s, active: true, status: 'Evaluating Rules...' }
            : s
        )
      );

      await new Promise((r) => setTimeout(r, 400));

      setAnalysisSteps((prev) =>
        prev.map((s, i) => (i === 4 ? { ...s, active: false, completed: true, status: '✓' } : s))
      );

      addInspection(result);
      navigate(`/analysis-result/${result.id}`);
    } catch (err) {
      console.error('Analysis error:', err);
      alert('An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  // ────────────────────────────────────────────────────────────────

  // Loading view — preserved exactly
  if (isAnalyzing) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 0' }}>
        <LoadingState
          message="Analyzing Package"
          subtext="Simulating AI declaration extraction & rule assessment."
          steps={analysisSteps}
        />
      </div>
    );
  }

  // ── Shared styles ─────────────────────────────────────────────
  const inputBase = {
    width: '100%',
    backgroundColor: 'var(--pg-surface)',
    border: '1px solid var(--pg-border)',
    borderRadius: '6px',
    fontSize: '12.5px',
    color: 'var(--pg-text-primary)',
    padding: '8px 10px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    boxSizing: 'border-box',
  };

  const inputWithIcon = { ...inputBase, paddingLeft: '32px' };

  const fieldLabel = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--pg-text-secondary)',
    marginBottom: '5px',
  };

  const sectionCard = {
    backgroundColor: 'var(--pg-surface)',
    border: '1px solid var(--pg-border)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: 'var(--pg-shadow-sm)',
  };

  const sectionHead = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '13px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--pg-border)',
  };

  // Right-panel data (purely presentational)
  const guideSteps = [
    {
      num: '01',
      title: 'Capture the package clearly',
      desc: 'Upload readable images of the front, back, and relevant declaration panels.',
    },
    {
      num: '02',
      title: 'Add inspection details',
      desc: 'Select the product category and provide the reference and location.',
    },
    {
      num: '03',
      title: 'Review findings',
      desc: 'Assessment output supports inspector review — it does not replace a legal determination.',
    },
  ];

  // Checklist items map to upload order (purely presentational)
  const uploadChecklist = [
    'Front panel',
    'Declaration panel',
    'MRP / quantity information',
    'Manufacturer details',
  ];

  const declarationChecks = [
    'Manufacturer / packer details',
    'Net quantity declaration',
    'MRP declaration',
    'Date-related declarations',
    'Required package information',
  ];

  return (
    <div className="pg-inspection-layout">

      {/* ═══ LEFT COLUMN — main inspection form ══════════════════════ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>


        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[
            { num: '1', label: 'Upload Images',     active: true },
            { num: '2', label: 'Inspection Details', active: false },
            { num: '3', label: 'Analyze',            active: false },
          ].map((step, i, arr) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: step.active ? 'var(--pg-accent)' : 'var(--pg-surface)',
                  border: step.active ? '1px solid var(--pg-accent)' : '1px solid var(--pg-border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: step.active ? '#fff' : 'var(--pg-text-muted)' }}>
                    {step.num}
                  </span>
                </div>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: step.active ? 600 : 400,
                  color: step.active ? 'var(--pg-text-primary)' : 'var(--pg-text-muted)',
                }}>
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--pg-border)', margin: '0 12px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* ── Upload Section ─────────────────────────────────────── */}
          <div style={sectionCard}>
            <div style={sectionHead}>
              <UploadIcon />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--pg-text-primary)' }}>
                Package Images
              </span>
              {images.length > 0 && (
                <span style={{
                  fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px',
                  backgroundColor: 'var(--pg-accent-muted)', color: 'var(--pg-accent-text)',
                  border: '1px solid #A8D5B5', marginLeft: 'auto',
                }}>
                  {images.length} {images.length === 1 ? 'image' : 'images'} ready
                </span>
              )}
            </div>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              onSelectDemoSample={handleSelectDemoSample}
            />
          </div>

          {/* ── Inspection Details ──────────────────────────────────── */}
          <div style={sectionCard}>
            <div style={sectionHead}>
              <Package style={{ width: '14px', height: '14px', color: 'var(--pg-text-muted)', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--pg-text-primary)' }}>
                Inspection Details
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>

              {/* Product Category */}
              <div>
                <label style={fieldLabel}>
                  Product Category <span style={{ color: 'var(--pg-accent)', fontStyle: 'normal' }}>*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={inputBase}
                  onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--pg-border)'; }}
                >
                  {PRODUCT_CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Inspection Reference */}
              <div>
                <label style={fieldLabel}>Inspection Reference</label>
                <div style={{ position: 'relative' }}>
                  <Hash style={{
                    width: '12px', height: '12px', color: 'var(--pg-text-muted)',
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }} />
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. REF-2026-8801"
                    style={{ ...inputWithIcon, fontFamily: 'monospace' }}
                    onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--pg-border)'; }}
                  />
                </div>
              </div>

              {/* Inspection Location — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={fieldLabel}>Inspection Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin style={{
                    width: '12px', height: '12px', color: 'var(--pg-text-muted)',
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Facility, warehouse, or retail depot"
                    style={inputWithIcon}
                    onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--pg-border)'; }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ── Disclaimer ─────────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--pg-surface-subtle)',
            border: '1px solid var(--pg-border)',
            borderRadius: '6px',
          }}>
            <AlertCircle style={{ width: '13px', height: '13px', color: 'var(--pg-text-muted)', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '11.5px', color: 'var(--pg-text-muted)', lineHeight: 1.55 }}>
              AI-assisted assessment supports inspector review and does not constitute a final legal determination.
            </span>
          </div>

          {/* ── Actions — ONE Cancel + ONE Analyze Product ──────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/hub')}
              style={{
                padding: '8px 18px', borderRadius: '6px',
                border: '1px solid var(--pg-border-strong)',
                backgroundColor: 'var(--pg-surface)',
                fontSize: '12.5px', fontWeight: 600,
                color: 'var(--pg-text-secondary)',
                cursor: 'pointer', transition: 'background-color 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-surface-subtle)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-surface)'; }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'var(--pg-accent)', color: '#ffffff',
                fontSize: '12.5px', fontWeight: 600,
                padding: '8px 20px', borderRadius: '6px',
                border: 'none', cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; }}
            >
              <Scan style={{ width: '13px', height: '13px' }} />
              <span>Analyze Product</span>
            </button>
          </div>

        </form>
      </div>

      {/* ═══ RIGHT COLUMN — Inspection Guide ═════════════════════════ */}
      <aside className="pg-inspection-sidebar">

        {/* Inspection Guide */}
        <div style={{
          backgroundColor: 'var(--pg-surface)',
          border: '1px solid var(--pg-border)',
          borderRadius: '8px',
          padding: '18px',
          boxShadow: 'var(--pg-shadow-sm)',
        }}>
          <h3 style={{
            fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--pg-accent)', margin: '0 0 16px',
          }}>
            Inspection Guide
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {guideSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  fontSize: '10px', fontWeight: 800, color: 'var(--pg-accent)',
                  fontFamily: 'monospace', minWidth: '22px', paddingTop: '2px',
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--pg-text-primary)', marginBottom: '3px', lineHeight: 1.3 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--pg-text-muted)', lineHeight: 1.55 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Checklist — visually tracks images.length (read-only state) */}
        <div style={{
          backgroundColor: 'var(--pg-surface)',
          border: '1px solid var(--pg-border)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: 'var(--pg-shadow-sm)',
        }}>
          <div style={{
            fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--pg-text-muted)', marginBottom: '12px',
          }}>
            Upload Checklist
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {uploadChecklist.map((item, i) => {
              const done = i < images.length;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
                    backgroundColor: done ? 'var(--pg-accent)' : 'var(--pg-surface-subtle)',
                    border: done ? '1px solid var(--pg-accent)' : '1px solid var(--pg-border-strong)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done && (
                      <CheckCircle2 style={{ width: '10px', height: '10px', color: '#fff' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: done ? 'var(--pg-text-primary)' : 'var(--pg-text-muted)',
                    fontWeight: done ? 500 : 400,
                  }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
          {images.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--pg-border)', fontSize: '11.5px', color: 'var(--pg-accent)', fontWeight: 600 }}>
              {images.length} of 4 panels ready for analysis
            </div>
          )}
        </div>

        {/* What the assessment looks for */}
        <div style={{
          backgroundColor: 'var(--pg-surface-subtle)',
          border: '1px solid var(--pg-border)',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--pg-text-muted)', marginBottom: '12px',
          }}>
            What the Assessment Looks For
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {declarationChecks.map((check, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  backgroundColor: 'var(--pg-text-muted)', flexShrink: 0, marginTop: '7px',
                }} />
                <span style={{ fontSize: '12px', color: 'var(--pg-text-muted)', lineHeight: 1.55 }}>{check}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '10.5px', color: 'var(--pg-text-muted)', marginTop: '12px', lineHeight: 1.55, borderTop: '1px solid var(--pg-border)', paddingTop: '10px' }}>
            Findings are presented for inspector review. AI output does not constitute a legal determination.
          </p>
        </div>

      </aside>
    </div>
  );
};

// Upload icon — small SVG helper
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--pg-text-muted)', flexShrink: 0 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default NewInspection;
