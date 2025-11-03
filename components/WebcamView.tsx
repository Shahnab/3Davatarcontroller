import React from 'react';
import useMediaPipeTracking from '../hooks/useFaceTracking';
import { TrackingData } from '../types';

interface WebcamViewProps {
  onTrackingData: (data: TrackingData | null) => void;
  onReady: (isReady: boolean) => void;
  traceOn: boolean;
}

const WebcamView: React.FC<WebcamViewProps> = ({ onTrackingData, onReady, traceOn }) => {
  const { videoRef, canvasRef } = useMediaPipeTracking(onTrackingData, onReady, traceOn);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scaleX-[-1] grayscale"></video>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full transform scaleX-[-1]"></canvas>
    </>
  );
};

export default WebcamView;