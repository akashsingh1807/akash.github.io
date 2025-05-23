import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  char?: string;
  iconId?: string;
  opacity: number;
  scale: number;
  isIcon: boolean;
}

const techIcons = ['react', 'node', 'typescript', 'python'];


const codeChars = ['{', '}', '(', ')', ';', '<', '>', '/', '*', '='];

const CodeParticles: React.FC = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: Particle[] = [];
    const numParticles = 35; // Increased for better visibility
    const baseSpeed = 0.04; // Slower, smoother movement

    // Load tech icons SVG
    const techIconsSvg = new Image();
    techIconsSvg.src = '/images/tech-icons.svg';

    // Create initial particles
    for (let i = 0; i < numParticles; i++) {
      const isIcon = Math.random() > 0.7; // 30% chance of being an icon
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        ...(isIcon
          ? { iconId: techIcons[Math.floor(Math.random() * techIcons.length)] }
          : { char: codeChars[Math.floor(Math.random() * codeChars.length)] }),
        opacity: Math.random() * 0.4 + 0.2, // Increased opacity for better visibility
        scale: Math.random() * 0.4 + 0.4, // Larger particles
        isIcon
      });
    }

    // Animation function
    const animate = () => {
      const ctx = container.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, container.width, container.height);
      ctx.fillStyle = 'var(--accent)';
      
      // Set up for text particles
      ctx.font = '20px monospace';

      particles.forEach((particle) => {
        // Update position
        particle.y = (particle.y + baseSpeed) % 100;
        particle.x = particle.x + Math.sin(particle.y / 15) * 0.15; // Gentler horizontal movement
        if (particle.x > 100) particle.x = 0;
        if (particle.x < 0) particle.x = 100;

        // Calculate position
        const x = (container.width * particle.x) / 100;
        const y = (container.height * particle.y) / 100;
        
        ctx.globalAlpha = particle.opacity;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(particle.scale, particle.scale);

        if (particle.isIcon && particle.iconId) {
          // Draw icon
          const iconSize = 24;
          const svgIcon = document.querySelector(`#${particle.iconId}`);
          if (svgIcon) {
            const pathData = svgIcon.querySelector('path')?.getAttribute('d');
            if (pathData) {
              const path = new Path2D(pathData);
              ctx.translate(-iconSize/2, -iconSize/2);
              ctx.fill(path);
            }
          }
        } else if (particle.char) {
          // Draw character
          ctx.fillText(particle.char, 0, 0);
        }
        
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      container.width = container.offsetWidth;
      container.height = container.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={containerRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ mixBlendMode: 'overlay' }} // More visible blend mode
    />
  );
};

export default CodeParticles;