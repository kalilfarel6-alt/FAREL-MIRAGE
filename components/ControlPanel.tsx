import React from 'react';
import { Wand2, Type, Layers, Loader2, Scan, User } from 'lucide-react';
import { AspectRatio, GenerationMode } from '../types';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (p: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  mode: GenerationMode;
  setMode: (m: GenerationMode) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  mode,
  setMode,
  onGenerate,
  isGenerating,
  disabled
}) => {
  const ratios: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];

  return (
    <div className="w-full space-y-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
      
      {/* Mode Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Scan className="w-4 h-4 text-brand-400" />
          Mode of Operation
        </label>
        <div className="p-1 bg-slate-900/50 rounded-lg flex border border-slate-700">
          <button 
            onClick={() => setMode('standard')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${mode === 'standard' ? 'bg-slate-700 text-white shadow-sm border border-slate-600' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'}`}
          >
            <Wand2 className="w-4 h-4" />
            Standard Edit
          </button>
          <button 
            onClick={() => setMode('gesture')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${mode === 'gesture' ? 'bg-brand-600 text-white shadow-sm border border-brand-500' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'}`}
          >
            <User className="w-4 h-4" />
            Gesture Match
          </button>
        </div>
        {mode === 'gesture' && (
          <p className="text-xs text-brand-300 bg-brand-900/20 p-2 rounded border border-brand-500/20">
             Recopier les gestes: The AI will strictly copy the body pose from your image to the new subject.
          </p>
        )}
      </div>

      {/* Prompt Input */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Type className="w-4 h-4 text-brand-400" />
          {mode === 'gesture' ? 'Target Subject (Person/Character)' : 'Edit Instruction'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'gesture' 
            ? "E.g., A futuristic robot, A samurai warrior, A marble statue..." 
            : "Describe how you want to transform the image..."
          }
          className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none resize-none transition-all"
        />
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
           {mode === 'standard' ? (
             <>
              <button 
                onClick={() => setPrompt("Change the background to a futuristic cyberpunk city.")}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 whitespace-nowrap transition-colors"
              >
                Cyberpunk City
              </button>
              <button 
                onClick={() => setPrompt("Turn this into a pencil sketch drawing.")}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 whitespace-nowrap transition-colors"
              >
                Pencil Sketch
              </button>
             </>
           ) : (
             <>
               <button 
                 onClick={() => setPrompt("A golden robot")}
                 className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 whitespace-nowrap transition-colors"
               >
                 Golden Robot
               </button>
               <button 
                 onClick={() => setPrompt("A superhero in a red suit")}
                 className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 whitespace-nowrap transition-colors"
               >
                 Superhero
               </button>
             </>
           )}
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Layers className="w-4 h-4 text-brand-400" />
          Output Aspect Ratio
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ratios.map((r) => (
            <button
              key={r}
              onClick={() => setAspectRatio(r)}
              className={`
                px-2 py-2 text-xs font-medium rounded-md border transition-all
                ${aspectRatio === r 
                  ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/50' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }
              `}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating || !prompt.trim()}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-white shadow-xl flex items-center justify-center gap-3 transition-all
          ${disabled || !prompt.trim() 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
            : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 border border-transparent hover:shadow-brand-500/25 active:scale-[0.98]'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            <span>{mode === 'gesture' ? 'Copy Gesture & Generate' : 'Generate Transformation'}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;