import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { ImageState } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ImageUploaderProps {
  imageState: ImageState;
  onImageUpload: (state: ImageState) => void;
  onClear: () => void;
  label?: string;
  subLabel?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  imageState, 
  onImageUpload, 
  onClear,
  label = "Upload Source Image",
  subLabel = "Drag and drop your image here, or click to browse files."
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    try {
      const base64 = await fileToBase64(file);
      onImageUpload({ file, previewUrl, base64 });
    } catch (e) {
      console.error("Error processing file", e);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (imageState.previewUrl) {
    return (
      <div className="relative w-full h-full min-h-[300px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl group">
        <img 
          src={imageState.previewUrl} 
          alt="Uploaded" 
          className="w-full h-full object-contain bg-slate-950/50" 
        />
        <button 
          onClick={onClear}
          className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur text-white rounded-full hover:bg-red-500/90 transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur text-xs text-white rounded-full font-medium border border-white/10 max-w-[90%] truncate">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative w-full min-h-[300px] flex flex-col items-center justify-center 
        border-2 border-dashed rounded-xl transition-all duration-300
        ${isDragging 
          ? 'border-brand-500 bg-brand-500/5 scale-[0.99]' 
          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="flex flex-col items-center gap-4 p-6 text-center pointer-events-none">
        <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-400'}`}>
          {isDragging ? <ImageIcon className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">
            {isDragging ? 'Drop image here' : label}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {subLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;