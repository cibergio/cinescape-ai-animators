import React, { useRef, useState, useEffect } from 'react';
import { Download, Maximize2, Loader2, Info } from 'lucide-react';
import { ResolutionOption } from '../types';

interface Props {
  imageUrl: string | null;
  isLoading: boolean;
  selectedResolution: ResolutionOption;
}

const ImageDisplay: React.FC<Props> = ({ imageUrl, isLoading, selectedResolution }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl animate-pulse">
        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
        <p className="text-xl font-light text-gray-300">Rendering Scene...</p>
        <p className="text-sm text-gray-500 mt-2">Using Gemini 2.5 Flash</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500">
        <div className="w-24 h-16 border-2 border-gray-600 rounded-md mb-4 relative overflow-hidden flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
        </div>
        <p className="text-lg">No Background Generated</p>
        <p className="text-sm mt-2 max-w-xs text-center">Select a mode and generate to see your animation background here.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col space-y-4">
       {/* Preview Area */}
       <div 
        className={`
          relative flex-1 bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group
          transition-all duration-500
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="Generated Background" 
            className={`
              object-contain transition-transform duration-500
              ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}
            `}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Overlay Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
          <div>
            <h3 className="text-white font-medium text-lg shadow-black drop-shadow-md">Output Preview</h3>
            <p className="text-indigo-300 text-sm">{selectedResolution.width}x{selectedResolution.height} Target</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg backdrop-blur-sm transition-colors"
            >
              <Maximize2 size={20} />
            </button>
            <a 
              href={imageUrl} 
              download={`cinescape-${selectedResolution.width}x${selectedResolution.height}.png`}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
            >
              <Download size={20} />
              Export
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl flex items-start gap-3 border border-gray-700/50">
        <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-400">
            <span className="text-gray-200 font-medium">Resolution Note:</span> Gemini generates high-quality images. 
            For exact production workflows, scale this output to your target {selectedResolution.width}x{selectedResolution.height} canvas in post-production.
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;