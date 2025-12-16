import React from 'react';
import { ResolutionOption, RESOLUTION_OPTIONS } from '../types';
import { Monitor, MoveHorizontal } from 'lucide-react';

interface Props {
  selected: ResolutionOption;
  onSelect: (option: ResolutionOption) => void;
}

const ResolutionSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        Target Format
      </label>
      <div className="grid grid-cols-1 gap-3">
        {RESOLUTION_OPTIONS.map((option) => {
          const isSelected = selected.id === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={`
                relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-900/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
                }
              `}
            >
              <div className={`
                p-3 rounded-lg mr-4
                ${isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400'}
              `}>
                {option.width > 5100 ? <MoveHorizontal size={24} /> : <Monitor size={24} />}
              </div>
              
              <div className="flex-1">
                <div className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  {option.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {option.width}px × {option.height}px
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {option.description}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,1)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResolutionSelector;