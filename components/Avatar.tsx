import React, { useRef, useEffect, useMemo, useState } from 'react';
// FIX: Add this import to help TypeScript recognize react-three-fiber's custom JSX elements.
// This is often needed in environments where type augmentation isn't picked up automatically.
import '@react-three/fiber';
import { useGLTF, Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { TrackingData, Gender } from '../types';

// Reusable utilities
const euler = new THREE.Euler(0, 0, 0, 'XYZ');
const quaternion = new THREE.Quaternion();
const SMOOTH_FACTOR = 0.5; // For head rotation. Increased for higher sensitivity.
const DEFAULT_BLENDSHAPE_SMOOTH_FACTOR = 0.4; // Increased for more responsive facial expressions.

// Map MediaPipe blendshape names to the model's morph target names
const blendshapeMap = {
    // Existing facial controls
    'jawOpen': 'jawOpen',
    'mouthSmileLeft': 'mouthSmileLeft',
    'mouthSmileRight': 'mouthSmileRight',
    'mouthPucker': 'mouthPucker',
    'mouthFrownLeft': 'mouthFrownLeft',
    'mouthFrownRight': 'mouthFrownRight',
    'eyeBlinkLeft': 'eyeBlinkLeft',
    'eyeBlinkRight': 'eyeBlinkRight',
    'eyeWideLeft': 'eyeWideLeft',
    'eyeWideRight': 'eyeWideRight',
    
    // Added for more expressive eyebrows
    'browDownLeft': 'browDownLeft',
    'browDownRight': 'browDownRight',
    'browInnerUp': 'browInnerUp',
    'browOuterUpLeft': 'browOuterUpLeft',
    'browOuterUpRight': 'browOuterUpRight',
    
    // Added for cheek and nose movements
    'cheekPuff': 'cheekPuff',
    'cheekSquintLeft': 'cheekSquintLeft',
    'cheekSquintRight': 'cheekSquintRight',
    'noseSneerLeft': 'noseSneerLeft',
    'noseSneerRight': 'noseSneerRight',

    // Added for more detailed mouth control
    'mouthUpperUpLeft': 'mouthUpperUpLeft',
    'mouthUpperUpRight': 'mouthUpperUpRight',
    'mouthLowerDownLeft': 'mouthLowerDownLeft',
    'mouthLowerDownRight': 'mouthLowerDownRight',
};

// Custom amplification for specific blendshapes to make them more expressive
const blendshapeAmplificationMap = {
  // Eyelids
  eyeBlinkLeft: 3.0,
  eyeBlinkRight: 3.0,
  eyeWideLeft: 2.0,
  eyeWideRight: 2.0,

  // Eyebrows
  browDownLeft: 3.0,
  browDownRight: 3.0,
  browInnerUp: 3.0,
  browOuterUpLeft: 3.0,
  browOuterUpRight: 3.0,
  
  // Mouth
  mouthSmileLeft: 2.0,
  mouthSmileRight: 2.0,
  jawOpen: 1.5,
};

// Custom smoothing factors for specific blendshapes
const blendshapeSmoothingMap = {
  eyeBlinkLeft: 0.7, // Blinks should be faster and more responsive
  eyeBlinkRight: 0.7,
  jawOpen: 0.6, // Talking movements should also be fairly quick
};


interface AvatarProps {
  trackingData: TrackingData | null;
  playOn: boolean;
  controlsRef: React.MutableRefObject<any>;
  gender: Gender;
}

// Model URLs for different genders
const modelUrls = {
  male: 'https://models.readyplayer.me/68f9b2fe95d7404895674392.glb?morphTargets=ARKit',
  female: 'https://models.readyplayer.me/68fe47f16d70940408dc7efc.glb?morphTargets=ARKit'
};

const Avatar: React.FC<AvatarProps> = ({ trackingData, playOn, controlsRef, gender }) => {
  const modelUrl = modelUrls[gender];
  const { scene, nodes } = useGLTF(modelUrl);
  
  const boneRefs = useRef<{ [key: string]: THREE.Object3D | THREE.SkinnedMesh | undefined }>({});

  const [position, setPosition] = useState(() => new THREE.Vector3(0, -0.9, 0));
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { camera, raycaster } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  
  // Memoize these to avoid recreating them on every render
  const dragPlane = useMemo(() => new THREE.Plane(), []);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const dragOffset = useMemo(() => new THREE.Vector3(), []);
  
  // Memoize morph target indices for performance
  const morphTargetIndices = useMemo(() => {
    const indices: { [key: string]: number } = {};
    // Target the head mesh specifically for blendshapes
    const headMesh = Object.values(nodes).find((node: THREE.Object3D) => node.name === 'Wolf3D_Head') as THREE.SkinnedMesh;
    
    if (headMesh?.morphTargetDictionary) {
        for (const [key, value] of Object.entries(blendshapeMap)) {
            if (headMesh.morphTargetDictionary[value] !== undefined) {
                indices[key] = headMesh.morphTargetDictionary[value];
            }
        }
    }
    return indices;
  }, [nodes]);

  useEffect(() => {
    const bones: { [key: string]: THREE.Object3D | THREE.SkinnedMesh | undefined } = {};
    scene.traverse((object) => {
      // Find the head bone for rotation
      if (object.name === 'Head') bones.head = object;
      // Find the face mesh for applying blendshapes
      if (object.name === 'Wolf3D_Head') bones.faceMesh = object;

      // Hide the main body, hands, and problematic teeth
      if (
        object.name === 'Wolf3D_Avatar' ||
        object.name === 'Wolf3D_Hands' ||
        object.name === 'Wolf3D_Teeth'
      ) {
        object.visible = false;
      }
      
      // Ensure all meshes can cast and receive shadows
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    boneRefs.current = bones;
  }, [scene, nodes]);

  useEffect(() => {
      document.body.style.cursor = isHovered && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'auto';
  }, [isHovered, isDragging]);


  const handlePointerDown = (e: any) => {
      e.stopPropagation();
      setIsDragging(true);
      if (controlsRef.current) controlsRef.current.enabled = false;
      
      groupRef.current.getWorldPosition(worldPosition);
      camera.getWorldDirection(dragPlane.normal); 
      dragPlane.setFromNormalAndCoplanarPoint(dragPlane.normal, worldPosition);

      raycaster.setFromCamera(e.pointer, camera);
      raycaster.ray.intersectPlane(dragPlane, dragOffset);
      dragOffset.sub(worldPosition);
  };

  const handlePointerUp = (e: any) => {
      e.stopPropagation();
      setIsDragging(false);
      if (controlsRef.current) controlsRef.current.enabled = true;
  };

  const handlePointerMove = (e: any) => {
      if (!isDragging) return;
      e.stopPropagation();
      
      raycaster.setFromCamera(e.pointer, camera);
      const newPos = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane, newPos)) {
          setPosition(newPos.sub(dragOffset));
      }
  };

  useFrame(() => {
    if (!playOn || !trackingData?.face || !Object.keys(boneRefs.current).length) return;

    const { head, faceMesh } = boneRefs.current;

    // --- Head Rotation Control ---
    if (head) {
      // Correct the rotation: Remove inversion from Y-axis
      euler.set(trackingData.face.rotation.x, trackingData.face.rotation.y, trackingData.face.rotation.z);
      quaternion.setFromEuler(euler);
      head.quaternion.slerp(quaternion, SMOOTH_FACTOR);
    }

    // --- Facial Expression Control ---
    const mesh = faceMesh as THREE.SkinnedMesh;
    if (mesh?.morphTargetInfluences) {
      const blendshapes = trackingData.face.blendshapes;
      for (const [name, index] of Object.entries(morphTargetIndices)) {
          const score = blendshapes.find(s => s.categoryName === name)?.score ?? 0;
          const current = mesh.morphTargetInfluences[index];
          
          const amplification = blendshapeAmplificationMap[name as keyof typeof blendshapeAmplificationMap] ?? 2.0;
          const target = THREE.MathUtils.clamp(score * amplification, 0, 1);

          // Get the specific smoothing factor for this blendshape, or use the default
          const smoothing = blendshapeSmoothingMap[name as keyof typeof blendshapeSmoothingMap] ?? DEFAULT_BLENDSHAPE_SMOOTH_FACTOR;
          
          mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(current, target, smoothing);
      }
    }
  });

  return (
    <>
        <group 
            ref={groupRef}
            position={position}
            onPointerDown={handlePointerDown}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
        >
            <primitive object={scene} scale={2.8} />
        </group>
        {isDragging && (
            <Plane
                args={[1000, 1000]}
                visible={false}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerOut={handlePointerUp} // Also stop dragging if mouse leaves canvas
            />
        )}
    </>
    );
};

// Preload both models
useGLTF.preload(modelUrls.male);
useGLTF.preload(modelUrls.female);

export default Avatar;
