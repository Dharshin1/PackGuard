import React, { useState, useEffect } from 'react';
import { processImageFilters, verifyRule7FontHeight } from '../../services/vision/openCvEngine';
import { Eye, Layers, Ruler, CheckCircle2, AlertTriangle, Cpu, RefreshCw } from 'lucide-react';

const LabelProcessor = ({ imageSource, netQuantity = '500 g' }) => {
  const [activeFilter, setActiveFilter] = useState('contours');
  const [filterUrls, setFilterUrls] = useState(null);
  const [loading, setLoading] = useState(true);

  // Run OpenCV image processing pipeline
  useEffect(() => {
    let isMounted = true;
    const runVisionPipeline = async () => {
      setLoading(true);
      try {
        const res = await processImageFilters(imageSource);
        if (isMounted) {
          setFilterUrls(res);
        }
      } catch (err) {
        console.warn('Vision processing error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (imageSource) {
      runVisionPipeline();
    }
    return () => {
      isMounted = false;
    };
  }, [imageSource]);

  const fontAssessment = verifyRule7FontHeight(netQuantity);

  const filterOptions = [
    { id: 'contours', label: 'Bounding Contours', desc: 'Detected declaration regions' },
    { id: 'threshold', label: 'Adaptive Threshold', desc: 'Binarized text contrast' },
    { id: 'canny', label: 'Canny Edges', desc: 'Edge boundary analysis' },
    { id: 'original', label: 'Original RGB', desc: 'Unfiltered package photo' }
  ];

  const getActiveImage = () => {
    if (!filterUrls) return typeof imageSource === 'string' ? imageSource : imageSource?.url;
    return filterUrls[activeFilter] || filterUrls.original;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-0">
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">OpenCV Computer Vision Label Analysis</h3>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center space-x-1">
          <Cpu className="w-3 h-3 mr-1" /> OpenCV.js Engine
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Interactive Filter Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                activeFilter === opt.id
                  ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{opt.label}</span>
                <Layers className={`w-3.5 h-3.5 ${activeFilter === opt.id ? 'text-indigo-400' : 'text-slate-600'}`} />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">{opt.desc}</p>
            </button>
          ))}
        </div>

        {/* Viewport Image Area */}
        <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-2 text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
              <span>Applying OpenCV Vision Filter Matrix...</span>
            </div>
          ) : (
            <img
              src={getActiveImage()}
              alt="OpenCV Filter Viewport"
              className="w-full h-full object-contain"
            />
          )}

          {/* Active Filter Badge */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
            Filter: {activeFilter}
          </div>
        </div>

        {/* Rule 7 Numeral Height Inspection Card */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${fontAssessment.isCompliant ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">Rule 7 Numeral Height Measurement</span>
                {fontAssessment.isCompliant ? (
                  <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> PASS
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> FAIL
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {fontAssessment.summary}
              </p>
            </div>
          </div>

          {/* Measurement Badges */}
          <div className="flex items-center space-x-4 text-xs font-mono shrink-0 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Measured</span>
              <span className="font-bold text-indigo-400">{fontAssessment.measuredMm} mm</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-500 text-[10px] block uppercase">Mandated Min</span>
              <span className="font-bold text-slate-200">{fontAssessment.mandatedMm} mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelProcessor;
