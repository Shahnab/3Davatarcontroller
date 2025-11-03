import React from 'react';

interface ControlsProps {
    traceOn: boolean;
    onTraceToggle: () => void;
    playOn: boolean;
    onPlayToggle: () => void;
    lightSettings: {
        position: { x: number; y: number; z: number };
        color: string;
        intensity: number;
    };
    onLightSettingsChange: (newSettings: ControlsProps['lightSettings']) => void;
}

const Controls: React.FC<ControlsProps> = ({ 
    traceOn, onTraceToggle, 
    playOn, onPlayToggle,
    lightSettings, onLightSettingsChange
}) => {
    
    const baseButtonStyle = "w-24 h-24 rounded-2xl flex items-center justify-center font-sans font-semibold text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none";
    const unpressedStyle = "bg-gradient-to-br from-neutral-700 to-neutral-800 text-neutral-300 shadow-[-8px_-8px_16px_rgba(255,255,255,0.05),8px_8px_16px_rgba(0,0,0,0.7)] border border-black/20";
    const pressedStyle = "bg-neutral-900 text-neutral-400 shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.02),inset_6px_6px_12px_rgba(0,0,0,0.9)] border border-black/50";

    // FIX: Changed the type of `value` from `string | number` to `string`.
    // The value from an input's `onChange` event is always a string.
    // This resolves the type error when assigning the value to the `color` property, which expects a string.
    const handleSettingChange = (setting: 'x' | 'y' | 'z' | 'intensity' | 'color', value: string) => {
        if (setting === 'x' || setting === 'y' || setting === 'z') {
            onLightSettingsChange({
                ...lightSettings,
                position: {
                    ...lightSettings.position,
                    [setting]: Number(value)
                }
            });
        } else if (setting === 'intensity') {
             onLightSettingsChange({
                ...lightSettings,
                intensity: Number(value)
            });
        } else { // color
             onLightSettingsChange({
                ...lightSettings,
                [setting]: value
            });
        }
    };
    
    const sliderStyle = "w-full h-2 bg-black/50 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]";

    const noiseStyle = { 
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
        backgroundSize: '4px 4px' 
    };

    return (
        <div className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-3xl shadow-[10px_10px_30px_rgba(0,0,0,0.6),-10px_-10px_30px_rgba(255,255,255,0.06)] border border-black/30">
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseStyle}></div>
            <div className="relative flex flex-col items-center gap-6">
                <div className="flex gap-4">
                    {/* REC Button */}
                    <button
                        onClick={onTraceToggle}
                        aria-pressed={traceOn}
                        title={traceOn ? "Stop Tracing" : "Start Tracing"}
                        className={`${baseButtonStyle} ${traceOn ? pressedStyle + ' text-red-500' : unpressedStyle}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full transition-colors ${traceOn ? 'bg-red-500 animate-[pulse_1.5s_infinite]' : 'bg-red-400/30'}`}></span>
                            <span>Trace</span>
                        </div>
                    </button>
                    {/* PLAY Button */}
                    <button
                        onClick={onPlayToggle}
                        aria-pressed={playOn}
                        title={playOn ? "Pause Avatar" : "Play Avatar"}
                        className={`${baseButtonStyle} ${playOn ? pressedStyle + ' text-green-400' : unpressedStyle}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full transition-colors ${playOn ? 'bg-green-500 animate-[pulse_1.5s_infinite]' : 'bg-green-400/30'}`}></span>
                            <span>Play</span>
                        </div>
                    </button>
                </div>

                {/* Light Controls */}
                <div className="w-full flex flex-col gap-3 text-xs text-neutral-400 px-2">
                    <h3 className="text-center font-semibold uppercase tracking-wider mb-1">Light Control</h3>
                    {/* Color Picker */}
                    <div className="grid grid-cols-[1fr_2rem] items-center gap-2 mb-2">
                        <span className="font-sans text-sm">Color</span>
                        <div className="relative w-8 h-8 rounded-full border-2 border-neutral-700/50 bg-black/30 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
                            <input 
                                type="color" 
                                value={lightSettings.color} 
                                onChange={(e) => handleSettingChange('color', e.target.value)} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title="Light Color"
                            />
                            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: lightSettings.color }}></div>
                        </div>
                    </div>
                    {/* Intensity Slider */}
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                        <span className="font-sans text-sm">Intensity</span>
                        <input type="range" min="0" max="10" step="0.1" value={lightSettings.intensity} onChange={(e) => handleSettingChange('intensity', e.target.value)} className={sliderStyle} />
                    </div>
                    <hr className="border-t border-black/30 my-2" />
                    {/* X Slider */}
                    <div className="grid grid-cols-[1rem_1fr] items-center gap-2">
                        <span className="font-mono">X</span>
                        <input type="range" min="-10" max="10" step="0.1" value={lightSettings.position.x} onChange={(e) => handleSettingChange('x', e.target.value)} className={sliderStyle} />
                    </div>
                    {/* Y Slider */}
                    <div className="grid grid-cols-[1rem_1fr] items-center gap-2">
                        <span className="font-mono">Y</span>
                        <input type="range" min="-10" max="10" step="0.1" value={lightSettings.position.y} onChange={(e) => handleSettingChange('y', e.target.value)} className={sliderStyle} />
                    </div>
                    {/* Z Slider */}
                    <div className="grid grid-cols-[1rem_1fr] items-center gap-2">
                        <span className="font-mono">Z</span>
                        <input type="range" min="-10" max="10" step="0.1" value={lightSettings.position.z} onChange={(e) => handleSettingChange('z', e.target.value)} className={sliderStyle} />
                    </div>
                </div>

                {/* Stop Button */}
                <button
                    onClick={() => { 
                        if (traceOn) onTraceToggle();
                        if (playOn) onPlayToggle();
                    }}
                    className="w-28 h-10 mt-2 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-300 font-semibold text-sm shadow-md hover:from-neutral-700 hover:to-neutral-800 active:bg-neutral-900 transition-all focus:outline-none border border-black/80"
                    title="Stop all activity"
                >
                    Stop
                </button>
            </div>
        </div>
    );
};

export default Controls;
