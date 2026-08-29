import React, { useState } from 'react';
import { Eye, Layers, ZoomIn } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);

  if (!images || images.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center text-slate-500 text-xs">
        No product images available
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Main View Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">
            {currentImage.title || `Panel ${selectedIndex + 1}`}
          </span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {currentImage.type || 'Panel View'}
          </span>
        </div>

        {currentImage.annotations && currentImage.annotations.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showAnnotations
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{showAnnotations ? 'Hide OCR Bounding Boxes' : 'Show OCR Boxes'}</span>
          </button>
        )}
      </div>

      {/* Main Enlarged Image */}
      <div className="relative bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[420px] overflow-hidden p-4 group">
        <img
          src={currentImage.url}
          alt={currentImage.title || 'Product Image'}
          className="max-h-[380px] w-auto object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Bounding box annotations */}
        {showAnnotations &&
          currentImage.annotations?.map((anno, idx) => (
            <div
              key={idx}
              style={{ top: `${anno.y}%`, left: `${anno.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-indigo-600/90 border border-indigo-400 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg animate-pulse"
            >
              {anno.label}
            </div>
          ))}
      </div>

      {/* Thumbnails Footer */}
      {images.length > 1 && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex space-x-3 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all shrink-0 w-16 h-16 ${
                selectedIndex === idx
                  ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105'
                  : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
              }`}
            >
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
