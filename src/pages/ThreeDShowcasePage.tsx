
import React from 'react';

export const ThreeDShowcasePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 animate-fade-in">3D Showcase</h1>
        <div className="bg-muted/20 rounded-lg p-8 shadow-lg animate-fade-in">
          <p className="text-xl mb-4">
            This page will contain 3D showcase content. It's currently under development.
          </p>
          <a 
            href="/" 
            className="inline-block mt-4 text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};
