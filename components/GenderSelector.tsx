import React from 'react';
import { Gender } from '../types';

interface GenderSelectorProps {
  selectedGender: Gender;
  onGenderChange: (gender: Gender) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onGenderChange }) => {
  // Style for the "silver particle" noise effect to match the app theme
  const noiseStyle = { 
    backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
    backgroundSize: '4px 4px' 
  };

  const containerBaseStyle = "border border-black/50 rounded-2xl";
  const container3DEffectStyle = "shadow-[8px_8px_20px_rgba(0,0,0,0.6),-8px_-8px_20px_rgba(255,255,255,0.06)]";
  const containerInsetStyle = "shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.03)]";

  const buttonBaseStyle = `
    relative px-4 py-2 text-sm font-medium transition-all duration-200 
    ${containerBaseStyle} overflow-hidden cursor-pointer
    transform-gpu active:scale-95 active:translate-y-[1px]
  `;

  const getButtonStyles = (gender: Gender) => {
    const isSelected = selectedGender === gender;
    
    if (isSelected) {
      return `
        ${buttonBaseStyle}
        ${containerInsetStyle}
        bg-gradient-to-br from-[#2a2a2a] to-[#1c1c1c]
        text-blue-300 border-blue-500/30
        shadow-[inset_3px_3px_8px_rgba(0,0,0,0.8),inset_-3px_-3px_8px_rgba(59,130,246,0.1)]
      `;
    } else {
      return `
        ${buttonBaseStyle}
        ${container3DEffectStyle}
        bg-gradient-to-br from-[#3d3d3d] to-[#2a2a2a]
        text-neutral-300 hover:text-white
        hover:shadow-[10px_10px_25px_rgba(0,0,0,0.7),-10px_-10px_25px_rgba(255,255,255,0.08)]
        hover:bg-gradient-to-br hover:from-[#4a4a4a] hover:to-[#333333]
      `;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3" title="Avatar Gender Selection">
      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
        Gender
      </span>
      
      <div className={`flex gap-2 p-2 bg-neutral-900/20 rounded-xl ${containerInsetStyle}`}>
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={noiseStyle}></div>
        
        <button
          className={getButtonStyles('male')}
          onClick={() => onGenderChange('male')}
          style={{
            background: selectedGender === 'male' 
              ? 'linear-gradient(145deg, #2a2a2a, #1c1c1c)' 
              : 'linear-gradient(145deg, #3d3d3d, #2a2a2a)'
          }}
        >
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{...noiseStyle, opacity: 0.3}}></div>
          <span className="relative z-10">Male</span>
        </button>

        <button
          className={getButtonStyles('female')}
          onClick={() => onGenderChange('female')}
          style={{
            background: selectedGender === 'female' 
              ? 'linear-gradient(145deg, #2a2a2a, #1c1c1c)' 
              : 'linear-gradient(145deg, #3d3d3d, #2a2a2a)'
          }}
        >
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{...noiseStyle, opacity: 0.3}}></div>
          <span className="relative z-10">Female</span>
        </button>
      </div>
    </div>
  );
};

export default GenderSelector;