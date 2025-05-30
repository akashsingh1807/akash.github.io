import React from 'react';
import { motion } from 'framer-motion';

const AnimatedGlobe: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Main globe */}
      <motion.div
        className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Globe wireframe */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-dashed" />
        <div className="absolute inset-2 rounded-full border border-primary/20 border-dotted" />
        <div className="absolute inset-4 rounded-full border border-primary/40" />
        
        {/* Orbiting dots */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index / 6) * 360;
          return (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: [angle, angle + 360],
                x: [60, 60],
                y: [-1, -1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2,
              }}
            />
          );
        })}
      </motion.div>

      {/* Floating code symbols */}
      <div className="absolute inset-0 pointer-events-none">
        {['<', '>', '{', '}', '(', ')'].map((symbol, index) => (
          <motion.div
            key={index}
            className="absolute text-primary/60 font-mono text-lg md:text-xl"
            style={{
              top: `${20 + (index * 12)}%`,
              left: `${15 + (index * 15)}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut",
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Center glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedGlobe;
