
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = ({ opacity = 0.1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: {x: number, y: number, size: number, speedX: number, speedY: number, opacity: number}[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };
    
    const createParticles = () => {
      particles = [];
      // Significantly reduced particle count for better performance
      const particleCount = Math.floor((canvas.width * canvas.height) / 80000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.8 + 0.1, // Even smaller particles
          speedX: (Math.random() - 0.5) * 0.1, // Slower movement
          speedY: (Math.random() - 0.5) * 0.1,
          opacity: Math.random() * 0.2 + 0.03 // Lower opacity
        });
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 100, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Update position with reduced frequency
        if (Math.random() > 0.7) { // Only update some particles each frame
          particle.x += particle.speedX;
          particle.y += particle.speedY;
        }
        
        // Handle edge cases
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    // Handle resize with throttling
    let resizeTimeout: number;
    const throttledResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 100);
    };
    
    window.addEventListener('resize', throttledResize);
    resizeCanvas();
    
    // Start animation with frame limiting
    let lastFrameTime = 0;
    const animateWithLimit = (timestamp: number) => {
      if (timestamp - lastFrameTime > 33) { // Limit to ~30fps
        lastFrameTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 100, 255, ${particle.opacity})`;
          ctx.fill();
          
          // Update position
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          // Handle edge cases
          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
      }
      
      animationFrameId = requestAnimationFrame(animateWithLimit);
    };
    
    animationFrameId = requestAnimationFrame(animateWithLimit);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <motion.canvas 
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 1 }}
    />
  );
};

export default BackgroundAnimation;
