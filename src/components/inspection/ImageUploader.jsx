import React, { useState, useRef } from 'react';
import { UploadCloud, X, Sparkles } from 'lucide-react';
import { DEMO_PRODUCTS } from '../../data/mockData';

const ImageUploader = ({ images = [], onImagesChange, onSelectDemoSample }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (files) => {
    const newFiles = Array.from(files);
    const updatedImages = [...images];

    newFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const typeLabel =
            updatedImages.length === 0
              ? 'Front'
              : updatedImages.length === 1
              ? 'Back'
              : updatedImages.length === 2
              ? 'Side'
              : 'Label/detail';

          updatedImages.push({
            id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file,
            title: file.name,
            type: typeLabel,
            url: e.target.result,
          });
          onImagesChange([...updatedImages]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id) => {
    const filtered = images.filter((img) => img.id !== id);
    onImagesChange(filtered);
  };

  const changePanelType = (id, newType) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, type: newType } : img
    );
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Upload Box Header & Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-950 hover:border-slate-500 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">UPLOAD PACKAGE IMAGES</h4>
        <p className="text-[11px] text-slate-500">
          Drag & drop files here or <span className="text-indigo-400 underline font-semibold">browse computer</span>
        </p>
      </div>



      {/* Upload Previews */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-slate-300">
            Selected Images ({images.length})
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={img.id || index}
                className="relative group bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md"
              >
                <img
                  src={img.url}
                  alt={img.title || `Package Panel ${index + 1}`}
                  className="w-full h-28 object-cover"
                />

                {/* Panel Type Selector Dropdown */}
                <div className="absolute top-1.5 left-1.5">
                  <select
                    value={img.type || 'Front'}
                    onChange={(e) => changePanelType(img.id, e.target.value)}
                    className="bg-slate-950/90 text-indigo-300 border border-slate-800 text-[10px] font-bold rounded px-1.5 py-0.5 focus:outline-none capitalize"
                  >
                    <option value="Front">Front</option>
                    <option value="Back">Back</option>
                    <option value="Side">Side</option>
                    <option value="Label/detail">Label/detail</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="p-1.5 text-[11px] bg-slate-950 border-t border-slate-800 text-slate-300 truncate">
                  {img.title || `Panel ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
