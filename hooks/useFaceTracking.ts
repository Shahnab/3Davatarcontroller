import { useEffect, useRef, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12';
import * as THREE from 'three';
import type { TrackingData, FaceData } from '../types';

const useMediaPipeTracking = (
  onTrackingData: (data: TrackingData | null) => void,
  onReady: (isReady: boolean) => void,
  traceOn: boolean
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const predictWebcam = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !faceLandmarkerRef.current) {
        animationFrameIdRef.current = window.requestAnimationFrame(predictWebcam);
        return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameIdRef.current = window.requestAnimationFrame(predictWebcam);
        return;
    }

    // Run detection on every frame, driven by requestAnimationFrame for lowest latency.
    const timestampMs = performance.now();
    const faceResults = faceLandmarkerRef.current.detectForVideo(video, timestampMs);

    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx) {
      if (!drawingUtilsRef.current) {
          drawingUtilsRef.current = new DrawingUtils(canvasCtx);
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (traceOn && faceResults.faceLandmarks) {
        for (const landmarks of faceResults.faceLandmarks) {
          // Draw yellow dots for each landmark
          drawingUtilsRef.current.drawLandmarks(landmarks, {
            color: '#FFFF00', // Bright yellow color
            radius: 2,         // Size of the dots
          });
        }
      }
    }

    let faceData: FaceData | null = null;
    if (faceResults.faceBlendshapes?.[0] && faceResults.facialTransformationMatrixes?.[0]) {
      const matrix = new THREE.Matrix4().fromArray(faceResults.facialTransformationMatrixes[0].data);
      const rotation = new THREE.Euler().setFromRotationMatrix(matrix);
      faceData = {
        rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
        blendshapes: faceResults.faceBlendshapes[0].categories,
      };
    }
    
    onTrackingData({ face: faceData });

    animationFrameIdRef.current = window.requestAnimationFrame(predictWebcam);
  }, [onTrackingData, traceOn]);

  const setup = useCallback(async () => {
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm'
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`, delegate: 'GPU' },
        outputFaceBlendshapes: true, outputFacialTransformationMatrixes: true, runningMode: 'VIDEO', numFaces: 1,
      });

      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      video.srcObject = stream;
      video.addEventListener('loadeddata', () => {
        // Start the prediction loop once the video is ready to play.
        predictWebcam();
      });
      onReady(true);
    } catch (error) {
      console.error("Error setting up MediaPipe tracking:", error);
      onReady(false);
    }
  }, [onReady, predictWebcam]);

  useEffect(() => {
    setup();
    const videoElement = videoRef.current;

    // Cleanup function
    return () => {
      if (animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (videoElement) {
        const stream = videoElement.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
      }
    };
  }, [setup]);

  return { videoRef, canvasRef };
};

export default useMediaPipeTracking;