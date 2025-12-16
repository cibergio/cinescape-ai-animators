import React, { useState, useRef } from 'react';
import { Layers, Image as ImageIcon, Wand2, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { AppMode, RESOLUTION_OPTIONS, ResolutionOption } from './types';
import ResolutionSelector from './components/ResolutionSelector';
import ImageDisplay from './components/ImageDisplay';
import { generateBackground, expandBackground } from './services/geminiService';

const App: React.FC = () => {
  // App State
  const [mode, setMode] = useState<AppMode>(AppMode.CREATE);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>(RESOLUTION_OPTIONS[0]);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // File Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        // If we upload a file, switch to expand mode automatically if not already
        if (mode === AppMode.CREATE) setMode(AppMode.EXPAND);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUpload = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your background.");
      return;
    }
    if (mode === AppMode.EXPAND && !uploadedImage) {
      setError("Please upload a reference image to expand.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let resultUrl: string;
      if (mode === AppMode.CREATE) {
        resultUrl = await generateBackground(prompt, selectedResolution.width, selectedResolution.height);
      } else {
        // Expand Mode
        if (!uploadedImage) throw new Error("No image uploaded");
        resultUrl = await expandBackground(uploadedImage, prompt, selectedResolution.width, selectedResolution.height);
      }
      setGeneratedImage(resultUrl);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30">
      
      {/* LEFT SIDEBAR - CONTROLS */}
      <div className="w-[450px] flex flex-col border-r border-gray-800 bg-gray-900 z-10 shadow-2xl overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Layers className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">CineScape</h1>
          </div>
          <p className="text-gray-400 text-sm">Background Creator & Expander</p>
        </div>

        <div className="px-8 space-y-8 pb-10">
          
          {/* Mode Selection */}
          <div className="bg-gray-800/50 p-1.5 rounded-xl flex gap-1 border border-gray-700/50">
            <button
              onClick={() => setMode(AppMode.CREATE)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === AppMode.CREATE 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Wand2 size={16} />
              Create New
            </button>
            <button
              onClick={() => setMode(AppMode.EXPAND)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === AppMode.EXPAND 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <ImageIcon size={16} />
              Expand Existing
            </button>
          </div>

          {/* Reference Image Upload (Expand Mode Only) */}
          {mode === AppMode.EXPAND && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Reference Image</label>
              
              {!uploadedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-indigo-900/50 transition-colors">
                    <Upload className="text-gray-400 group-hover:text-indigo-400" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-300">Click to upload base background</p>
                  <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG (Max 5100x3000 recommended)</p>
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-700">
                  <img src={uploadedImage} alt="Reference" className="w-full h-40 object-cover opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-xs text-white font-medium">Reference Loaded</div>
                  <button 
                    onClick={clearUpload}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg shadow-lg backdrop-blur-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          )}

          {/* Resolution Selector */}
          <ResolutionSelector 
            selected={selectedResolution} 
            onSelect={setSelectedResolution} 
          />

          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {mode === AppMode.CREATE ? 'Scene Description' : 'Expansion Details'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === AppMode.CREATE 
                ? "Describe the animation background (e.g., A magical forest clearing at sunset with ancient ruins...)"
                : "Describe how to expand the scene (e.g., Extend the forest to the sides, adding more pine trees and a distant mountain range...)"
              }
              className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-red-200">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform
              ${isLoading 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:scale-[1.02] shadow-indigo-500/25'
              }
            `}
          >
            {isLoading ? (
              <>Generating...</>
            ) : (
              <>
                <Wand2 size={20} />
                {mode === AppMode.CREATE ? 'Generate Background' : 'Expand Scene'}
              </>
            )}
          </button>

        </div>
      </div>

      {/* RIGHT MAIN AREA - PREVIEW */}
      <div className="flex-1 p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-950 flex flex-col h-full overflow-hidden relative">
        {/* Background Mesh Gradient */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />
        
        <header className="flex justify-between items-center mb-6 z-10">
          <div>
            <h2 className="text-2xl font-semibold text-white">Canvas Preview</h2>
            <p className="text-gray-500 text-sm">Review your high-fidelity animation assets</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/60 rounded-full border border-gray-800">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
            <span className="text-xs font-medium text-gray-300">System Ready</span>
          </div>
        </header>

        <div className="flex-1 relative z-10">
          <ImageDisplay 
            imageUrl={generatedImage} 
            isLoading={isLoading} 
            selectedResolution={selectedResolution}
          />
        </div>
      </div>

    </div>
  );
};

export default App;