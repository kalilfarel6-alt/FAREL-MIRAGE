import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import ResultViewer from './components/ResultViewer';
import { ImageState, AspectRatio, GeneratedResult, GenerationMode } from './types';
import { generateEditedImage } from './services/geminiService';
import { AlertCircle, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // Pose / Primary Image
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null
  });

  // Character / Subject Image (Used in Gesture Mode)
  const [characterImageState, setCharacterImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null
  });
  
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [mode, setMode] = useState<GenerationMode>('standard');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (newState: ImageState) => {
    setImageState(newState);
    setResult(null);
    setError(null);
  };

  const handleCharacterUpload = (newState: ImageState) => {
    setCharacterImageState(newState);
    setResult(null);
    setError(null);
  };

  const handleClearImage = () => {
    setImageState({ file: null, previewUrl: null, base64: null });
    setResult(null);
  };

  const handleClearCharacterImage = () => {
    setCharacterImageState({ file: null, previewUrl: null, base64: null });
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!imageState.base64 || !imageState.file) return;
    if (mode === 'gesture' && (!characterImageState.base64 || !characterImageState.file)) {
      setError("Please upload the subject photo (who performs the gesture).");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setResult(null);

    // Construct the prompt based on the selected mode
    let finalPrompt = prompt;
    
    // Pass character image if in gesture mode
    let secondaryBase64 = null;
    let secondaryMime = null;

    if (mode === 'gesture') {
      finalPrompt = `Context: You are provided with two images. 
      Image 1: A reference image showing a specific BODY POSE and GESTURE.
      Image 2: A reference image of a CHARACTER/PERSON (Subject).
      
      Task: Generate a new image of the CHARACTER from Image 2 performing the EXACT POSE from Image 1. 
      
      Instructions:
      - The face, clothes, and physical appearance must match the Subject (Image 2).
      - The body position, arm/leg angles, and hand gestures must strictly match the Pose Reference (Image 1).
      - Additional context: ${prompt}`;
      
      secondaryBase64 = characterImageState.base64;
      secondaryMime = characterImageState.file?.type;
    }

    try {
      const response = await generateEditedImage(
        imageState.base64,
        imageState.file.type,
        finalPrompt,
        aspectRatio,
        secondaryBase64,
        secondaryMime
      );
      setResult(response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while generating the image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-100 font-sans selection:bg-brand-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-4 tracking-tight">
            Transform Reality
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Upload images and describe your vision. Use "Gesture Match" to transfer poses between photos.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-200 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls & Input */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Step 1: Mode Selection (Implicitly inside Config but affects layout) */}
            
            <section>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-white">1. Uploads</h3>
                 {mode === 'gesture' && <span className="text-xs bg-brand-900/50 text-brand-300 px-2 py-1 rounded border border-brand-700/50">Dual Input Active</span>}
               </div>

               <div className="space-y-4">
                 {/* Primary Image (Pose/Source) */}
                 <ImageUploader 
                   imageState={imageState} 
                   onImageUpload={handleImageUpload}
                   onClear={handleClearImage}
                   label={mode === 'gesture' ? "Upload Gesture (Pose)" : "Upload Source Image"}
                   subLabel={mode === 'gesture' ? "The photo containing the movement/pose to copy." : "The image you want to edit or transform."}
                 />

                 {/* Secondary Image (Subject - Only in Gesture Mode) */}
                 {mode === 'gesture' && (
                   <div className="relative animate-in fade-in slide-in-from-top-4">
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-slate-800 p-1 rounded-full border border-slate-700">
                        <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                     </div>
                     <ImageUploader 
                       imageState={characterImageState} 
                       onImageUpload={handleCharacterUpload}
                       onClear={handleClearCharacterImage}
                       label="Upload Subject (Person)"
                       subLabel="The photo of the person who must perform the gesture."
                     />
                   </div>
                 )}
               </div>
            </section>

            <section>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-white">2. Configure</h3>
               </div>
               <ControlPanel 
                 prompt={prompt}
                 setPrompt={setPrompt}
                 aspectRatio={aspectRatio}
                 setAspectRatio={setAspectRatio}
                 mode={mode}
                 setMode={setMode}
                 onGenerate={handleGenerate}
                 isGenerating={isGenerating}
                 disabled={!imageState.file || (mode === 'gesture' && !characterImageState.file)}
               />
            </section>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">3. Result</h3>
            </div>
            <div className="bg-slate-800/20 p-1 rounded-2xl border border-slate-800/50 min-h-[500px]">
               <ResultViewer 
                 result={result} 
                 isGenerating={isGenerating} 
               />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;