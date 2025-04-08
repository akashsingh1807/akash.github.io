
import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const SplineBackground = () => {
  return (
    <motion.div 
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Suspense fallback={<div className="w-full h-full bg-background"></div>}>
        <Spline 
          className="w-full h-full"
          scene="https://prod.spline.design/096a3372-f4c9-461c-bea8-fd738007261f/scene.splinecode" 
        />
      </Suspense>
    </motion.div>
  );
};

export default SplineBackground;
