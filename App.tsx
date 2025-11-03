import React, { useState, useCallback } from 'react';
import { TrackingData, Gender } from './types';
import ThreeScene from './components/ThreeScene';
import WebcamView from './components/WebcamView';
import Controls from './components/Controls';
import Telemetry from './components/Telemetry';
import GenderSelector from './components/GenderSelector';

type WebcamStatus = 'initializing' | 'ready' | 'error';

// Helper function to get the correct image path for deployment
const getImagePath = (imageName: string) => {
  const basePath = import.meta.env.BASE_URL || '/';
  return `${basePath}image/${imageName}`;
};

export default function App(): React.ReactElement {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [webcamStatus, setWebcamStatus] = useState<WebcamStatus>('initializing');
  const [traceOn, setTraceOn] = useState(true);
  const [playOn, setPlayOn] = useState(true);
  const [gender, setGender] = useState<Gender>('male');
  const [lightSettings, setLightSettings] = useState({
    position: { x: 5, y: 5, z: 5 },
    color: '#ffffff',
    intensity: 2.5,
  });


  const handleTrackingData = useCallback((data: TrackingData | null) => {
    setTrackingData(data);
  }, []);

  const handleWebcamReady = useCallback((isReady: boolean) => {
    setWebcamStatus(isReady ? 'ready' : 'error');
  }, []);
  
  const containerBaseStyle = "border border-black/50 rounded-3xl";
  const container3DEffectStyle = "shadow-[10px_10px_30px_rgba(0,0,0,0.6),-10px_-10px_30px_rgba(255,255,255,0.06)]";
  const containerInsetStyle = "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.03)]";
  
  // Style for the "silver particle" noise effect
  const noiseStyle = { 
    backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
    backgroundSize: '4px 4px' 
  };


  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center p-4 font-['Inter',_sans-serif]">
       <div 
        className={`w-full max-w-[1500px] h-[95vh] mx-auto overflow-hidden relative flex items-center justify-center ${containerBaseStyle} ${container3DEffectStyle}`}
        style={{ background: 'linear-gradient(145deg, #3d3d3d, #2a2a2a)' }}
      >
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseStyle}></div>
        
        {/* Left Card */}
        <div className="p-2 flex flex-col items-center">
           <div className={`relative w-48 h-48 bg-neutral-900/20 rounded-3xl ${container3DEffectStyle} ${containerInsetStyle}`}>
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseStyle}></div>
            <img 
              src={gender === 'male' ? getImagePath('image1.png') : getImagePath('image3.png')} 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[160%] max-w-none object-contain"
              style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.5))' }}
              alt="Avatar Concept" 
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.style.backgroundColor = 'rgba(250, 250, 250, 0.05)'; }}
            />
          </div>
          {/* Gender Selection */}
          <div className="mt-4">
            <GenderSelector selectedGender={gender} onGenderChange={setGender} />
          </div>

          {/* Minimalistic "On" Switch */}
          <div className="mt-6 flex flex-col items-center gap-2" title="AI Character Status">
            <div className="relative w-12 h-6 bg-black/30 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] flex items-center justify-end p-1">
                <div 
                  className="w-4 h-4 rounded-full bg-green-400" 
                  style={{ 
                    boxShadow: '0 0 5px rgba(74, 222, 128, 0.7), 0 0 10px rgba(74, 222, 128, 0.5)',
                  }}>
                </div>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Active</span>
          </div>
        </div>

        {/* Center Content: Avatar + Webcam */}
        <div className="relative w-[640px] h-[830px] flex items-center justify-center mx-8">
          {/* 3D Scene */}
          <div className={`absolute top-0 w-[640px] h-[640px] bg-neutral-800/30 backdrop-blur-lg overflow-hidden ${containerBaseStyle} ${container3DEffectStyle} ${containerInsetStyle}`}>
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{...noiseStyle, opacity: 0.5}}></div>
            <ThreeScene trackingData={trackingData} playOn={playOn} gender={gender} lightSettings={lightSettings} />
          </div>
          {/* Webcam View */}
          <div className={`absolute bottom-0 w-[360px] h-[270px] overflow-hidden z-10 ${containerBaseStyle} ${container3DEffectStyle}`}>
             <div className="absolute inset-0 rounded-3xl pointer-events-none z-10" style={noiseStyle}></div>
             <WebcamView onTrackingData={handleTrackingData} onReady={handleWebcamReady} traceOn={traceOn} />
          </div>
        </div>

        {/* Right Controls */}
        <div className="p-2 flex flex-col gap-6">
          <Telemetry trackingData={trackingData} />
          <Controls 
            traceOn={traceOn}
            onTraceToggle={() => setTraceOn(p => !p)}
            playOn={playOn}
            onPlayToggle={() => setPlayOn(p => !p)}
            lightSettings={lightSettings}
            onLightSettingsChange={setLightSettings}
          />
        </div>

        {/* Status Overlay */}
        {webcamStatus !== 'ready' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-30">
            <div className={`relative text-center p-8 bg-gradient-to-br from-[#3d3d3d] to-[#2a2a2a] rounded-2xl border border-black/50 ${container3DEffectStyle} overflow-hidden`}>
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={noiseStyle}></div>
              {webcamStatus === 'initializing' ? (
                <>
                  <p className="text-xl mb-4 text-neutral-200">Initializing Webcam...</p>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                </>
              ) : (
                <>
                  <p className="text-xl mb-2 text-red-400 font-semibold">Webcam Error</p>
                  <p className="text-neutral-300">Could not access webcam. <br/> Please check browser permissions.</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Shahnab Cutout Text */}
        <div
            className="absolute bottom-6 left-3 text-2xl font-bold tracking-[0.15em] pointer-events-none select-none"
            style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                color: '#1c1c1c',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7), -1px -1px 2px rgba(255, 255, 255, 0.07)',
            }}
            aria-hidden="true"
        >
            a-thing
        </div>

      </div>
    </div>
  );
}