
import { useState } from 'react';

export const useSadhanaView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [view3D, setView3D] = useState(false);
  
  return {
    isEditing,
    view3D,
    setIsEditing,
    setView3D,
    toggleEditing: () => setIsEditing(prev => !prev),
    toggle3DView: () => setView3D(prev => !prev)
  };
};
