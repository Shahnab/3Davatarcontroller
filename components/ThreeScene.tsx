import React, { Suspense, useRef } from 'react';
// FIX: Add this import to help TypeScript recognize react-three-fiber's custom JSX elements.
// This is often needed in environments where type augmentation isn't picked up automatically.
import '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import Avatar from './Avatar';
import { TrackingData, Gender } from '../types';

interface ThreeSceneProps {
  trackingData: TrackingData | null;
  playOn: boolean;
  gender: Gender;
  lightSettings: {
    position: { x: number; y: number; z: number };
    color: string;
    intensity: number;
  };
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ trackingData, playOn, gender, lightSettings }) => {
  // FIX: Initialize useRef with null. The `useRef()` overload with no arguments might not be
  // recognized in all TypeScript/React configurations, and `useRef(null)` is the standard
  // pattern for creating refs to be attached to components.
  const controlsRef = useRef(null);

  return (
    <div className="w-full h-full relative bg-[#1A1A1A]">
      <Canvas dpr={[1, 2]} camera={{ fov: 40, position: [0, 0.1, 3] }} shadows>
        <Suspense fallback={<Html center className="text-white font-sans">Loading Model...</Html>}>
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[lightSettings.position.x, lightSettings.position.y, lightSettings.position.z]}
            intensity={lightSettings.intensity}
            color={lightSettings.color}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          {/* Invisible plane to receive shadows */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
          <Avatar trackingData={trackingData} playOn={playOn} controlsRef={controlsRef} gender={gender} />
        </Suspense>
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enableZoom={true}
            enablePan={false}
            target={[0, 0.4, 0]} // Adjust target for new scale
            minDistance={1.5}
            maxDistance={6.0}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
