
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LogoAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Trigger animation on hover
  const handleHover = () => {
    setIsAnimating(true);
  };
  
  // Reset animation after it completes
  const handleAnimationComplete = () => {
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Link to="/" className="focus:outline-none">
      <div 
        className="flex items-center space-x-1"
        onMouseEnter={handleHover}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 1.5 
          }}
          onAnimationComplete={handleAnimationComplete}
          className="text-primary font-bold text-2xl"
        >
          a
        </motion.div>
        <motion.div
          initial={{ opacity: 1 }}
          animate={isAnimating ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-foreground font-bold text-2xl"
        >
          kash
        </motion.div>
      </div>
    </Link>
  );
};

export default LogoAnimation;
