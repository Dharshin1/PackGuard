import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/inspection/ImageUploader';
import LoadingState from '../components/common/LoadingState';
import { PRODUCT_CATEGORIES } from '../data/mockData';
import { uploadInspection, analyzeInspection } from '../services/api';
import { useInspections } from '../context/InspectionContext';
import { Scan, MapPin, Hash, Package, AlertCircle } from 'lucide-react';

const NewInspection = () => {
  const navigate = useNavigate();
  const { addInspection } = useInspections();

  // Form State (unfilled by default)
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [location, setLocation] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState(null);

  // Processing State Sequence
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState([
    { label: 'Images received', status: 'Pending', active: false, completed: false },
    { label: 'Image preprocessing', status: 'Pending', active: false, completed: false },
    { label: 'Text regions detected', status: 'Pending', active: false, completed: false },
    { label: 'Extracting declarations', status: 'Pending', active: false, completed: false },
    { label: 'Running compliance assessment', status: 'Pending', active: false, completed: false },
  ]);

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
      // Step 1: Images received
      setAnalysisSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, active: true, status: 'Processing...' } : s))
      );
      await uploadInspection({ images, category });
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Image preprocessing
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

      // Step 3: Text regions detected
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

      // Step 4 & 5: Extracting declarations & Running compliance assessment
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
        demoSampleId: selectedDemoId
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

      // Add to global state store
      addInspection(result);

      // Navigate to Analysis Result Screen
      navigate(`/analysis-result/${result.id}`);
    } catch (err) {
      console.error('Analysis error:', err);
      alert('An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <LoadingState
          message="ANALYZING PACKAGE"
          subtext="Simulating AI declaration extraction & rule assessment."
          steps={analysisSteps}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Screen Title */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Scan className="w-5 h-5 text-indigo-400" />
          <span>New Product Inspection</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload package images to perform an AI-assisted compliance assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Component (Step 1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            onSelectDemoSample={handleSelectDemoSample}
          />
        </div>

        {/* Inspection Metadata Inputs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Package className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Inspection Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Category */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Product Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {PRODUCT_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Inspection Reference */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Inspection Reference
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. REF-2026-8801"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Inspection Location */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Inspection Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Facility, warehouse, or retail depot location"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Note */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            This AI-assisted assessment is intended to support inspector review and does not constitute a final legal determination.
          </span>
        </div>

        {/* Primary CTA Button */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow-md transition-colors"
          >
            <Scan className="w-4 h-4" />
            <span>Analyze Product</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInspection;
