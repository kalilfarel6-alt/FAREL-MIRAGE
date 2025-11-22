import React from 'react';
import { Download, Share2, Maximize2 } from 'lucide-react';
import { GeneratedResult } from '../types';

interface ResultViewerProps {
  result: GeneratedResult | null;
  isGenerating: boolean;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ result, isGenerating }) => {
  
  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `mirage-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isGenerating) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-brand-400 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="text-slate-400 font-medium">Crafting your image...</p>
        <p className="text-xs text-slate-600">This may take up to 30 seconds</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 p-8">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
           <Maximize2 className="w-6 h-6 opacity-50" />
        </div>
        <p>Generated image will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="relative w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl group">
        <img 
          src={result.imageUrl || ''} 
          alt="Generated Result" 
          className="w-full h-auto object-contain max-h-[600px] mx-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
          <div className="flex gap-2">
             <button 
               onClick={handleDownload}
               className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors border border-white/20"
               title="Download Image"
             >
               <Download className="w-5 h-5" />
             </button>
             {/* Placeholder for share functionality if we had a backend */}
             <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors border border-white/20">
               <Share2 className="w-5 h-5" />
             </button>
          </div>
          <span className="px-3 py-1 bg-brand-500/80 backdrop-blur text-white text-xs rounded-full font-medium">
            AI Generated
          </span>
        </div>
      </div>
      
      {result.text && (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p className="text-sm text-slate-300 italic">
            <span className="text-brand-400 font-semibold not-italic mr-2">AI Note:</span>
            {result.text}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultViewer;