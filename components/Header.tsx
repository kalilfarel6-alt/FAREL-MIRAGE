import React from 'react';
import { Sparkles, Aperture } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-600 rounded-lg shadow-lg shadow-brand-500/20">
          <Aperture className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">FAREL MIRAGE</h1>
          <p className="text-xs text-slate-400 font-medium">AI Image Editor</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-brand-400 bg-brand-950/50 px-4 py-1.5 rounded-full border border-brand-800/50">
        <Sparkles className="w-4 h-4" />
        <span>Powered by Gemini 2.5</span>
      </div>
    </header>
  );
};

export default Header;