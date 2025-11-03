import React from 'react';
import { TrackingData } from '../types';

interface TelemetryProps {
    trackingData: TrackingData | null;
}

// Function to convert radians to degrees
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

const Telemetry: React.FC<TelemetryProps> = ({ trackingData }) => {
    const rotation = trackingData?.face?.rotation;
    
    // Format values, providing defaults if data is unavailable
    const pitch = rotation ? toDegrees(rotation.x).toFixed(2) : '0.00';
    const yaw = rotation ? toDegrees(rotation.y).toFixed(2) : '0.00';
    const roll = rotation ? toDegrees(rotation.z).toFixed(2) : '0.00';

    const noiseStyle = { 
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
        backgroundSize: '4px 4px' 
    };

    const dataRowStyle = "flex justify-between items-baseline";
    const labelStyle = "text-sm text-neutral-400 font-sans uppercase tracking-wider";
    const valueStyle = "font-mono text-sm text-neutral-200";

    return (
        <div className="relative w-[240px] bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-3xl shadow-[10px_10px_30px_rgba(0,0,0,0.6),-10px_-10px_30px_rgba(255,255,255,0.06)] border border-black/30">
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseStyle}></div>
            <div className="relative flex flex-col gap-4">
                 <h3 className="text-center font-semibold uppercase tracking-wider mb-1 text-xs text-neutral-400">Head Telemetry</h3>
                 <div className="flex flex-col gap-3 px-2">
                    <div className={dataRowStyle}>
                        <span className={labelStyle}>Pitch</span>
                        <span className={valueStyle}>{pitch}°</span>
                    </div>
                     <hr className="border-t border-black/30 my-1" />
                    {/* Fix: Corrected typo from `dataRow-Style` to `dataRowStyle`. */}
                    <div className={dataRowStyle}>
                        <span className={labelStyle}>Yaw</span>
                        <span className={valueStyle}>{yaw}°</span>
                    </div>
                     <hr className="border-t border-black/30 my-1" />
                    <div className={dataRowStyle}>
                        <span className={labelStyle}>Roll</span>
                        <span className={valueStyle}>{roll}°</span>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default Telemetry;