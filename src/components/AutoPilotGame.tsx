
import React, { useEffect, useRef } from 'react';

const AutoPilotGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Game variables
    let animationId: number;
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 100,
      width: 40,
      height: 40,
      speed: 3,
      color: 'rgba(90, 103, 216, 0.7)',
      direction: 1 // 1 for right, -1 for left
    };

    const obstacles: {x: number, y: number, width: number, height: number, speed: number}[] = [];
    const stars: {x: number, y: number, size: number, speed: number, twinkle: number}[] = [];
    
    // Create initial stars
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * 0.05
      });
    }

    // Generate an obstacle at random position
    const generateObstacle = () => {
      const width = Math.random() * 50 + 20;
      obstacles.push({
        x: Math.random() * (canvas.width - width),
        y: -50,
        width,
        height: 20,
        speed: Math.random() * 2 + 1
      });
    };

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        // Create twinkling effect
        const opacity = 0.3 + Math.sin(Date.now() * star.twinkle) * 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Move player
      player.x += player.speed * player.direction;
      
      // Bounce off walls
      if (player.x > canvas.width - player.width || player.x < 0) {
        player.direction *= -1;
      }

      // Draw player
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Randomly generate obstacles
      if (Math.random() < 0.01) {
        generateObstacle();
      }

      // Update and draw obstacles
      for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.y += obstacle.speed;
        
        ctx.fillStyle = 'rgba(200, 50, 50, 0.5)';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Remove obstacles that go off screen
        if (obstacle.y > canvas.height) {
          obstacles.splice(i, 1);
          i--;
        }

        // Auto-dodge obstacles
        const playerCenterX = player.x + player.width / 2;
        const obstacleCenterX = obstacle.x + obstacle.width / 2;
        
        if (obstacle.y + obstacle.height > player.y - 100 && obstacle.y < player.y) {
          if (
            (playerCenterX > obstacle.x && playerCenterX < obstacle.x + obstacle.width) ||
            (Math.abs(playerCenterX - obstacleCenterX) < 100)
          ) {
            player.direction = playerCenterX < obstacleCenterX ? -1 : 1;
          }
        }
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      player.y = canvas.height - 100;
    };

    window.addEventListener('resize', handleResize);
    gameLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-20 opacity-30 pointer-events-none"
    />
  );
};

export default AutoPilotGame;
