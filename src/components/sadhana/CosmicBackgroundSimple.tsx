import React from 'react';

const CosmicBackgroundSimple = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default CosmicBackgroundSimple;