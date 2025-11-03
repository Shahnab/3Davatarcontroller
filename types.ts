// A representation of a single blendshape score
export interface Blendshape {
  categoryName: string;
  score: number;
}

export interface FaceData {
  rotation: { x: number; y: number; z: number };
  blendshapes: Blendshape[]; // Array of all facial blendshapes
}

// A unified structure for all tracking data from MediaPipe
export interface TrackingData {
    face: FaceData | null;
}

// Gender type for avatar selection
export type Gender = 'male' | 'female';