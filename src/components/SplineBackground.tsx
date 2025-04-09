
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const SplineBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene with reduced complexity
    const scene = new THREE.Scene();
    
    // Create camera with optimal settings
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer with performance-focused settings
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      powerPreference: 'default'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Force 1x pixel ratio for better performance
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create simplified particles - significantly reduced count
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 50000));
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
      // Position - create a sparse grid structure
      const xGrid = (Math.random() - 0.5) * 10;
      const yGrid = (Math.random() - 0.5) * 10;
      const zGrid = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = xGrid;
      positions[i * 3 + 1] = yGrid;
      positions[i * 3 + 2] = zGrid;
      
      // Simpler color scheme
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        color.setHSL(0.6, 0.7, 0.5); // Blue
      } else {
        color.setHSL(0.3, 0.7, 0.5); // Green
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Smaller sizes
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Simplified material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true
    });
    
    // Create points
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Add ambient light - simplified lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add only one directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Just create one shape to represent technology - much simpler scene
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16), // Reduced geometry complexity
      new THREE.MeshPhongMaterial({
        color: 0x6db33f,
        transparent: true,
        opacity: 0.7,
        shininess: 30
      })
    );
    sphere.position.set(0, 0, -5);
    scene.add(sphere);
    
    // Simpler mouse interaction
    const mousePosition = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Reduce camera movement sensitivity
      if (camera) {
        camera.position.x += (mousePosition.x * 0.2 - camera.position.x) * 0.02;
        camera.position.y += (mousePosition.y * 0.2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
      }
      
      setIsInteracting(true);
      setTimeout(() => setIsInteracting(false), 1000);
    };
    
    // Throttle mouse move events for better performance
    let lastMoveTime = 0;
    const throttledMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime > 50) { // Only process every 50ms
        lastMoveTime = now;
        handleMouseMove(event);
      }
    };
    
    window.addEventListener('mousemove', throttledMouseMove);
    
    // Simplified resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(1); // Keep at 1 for performance
    };
    
    // Throttle resize events
    let resizeTimeout: number;
    const throttledResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', throttledResize);
    
    // Animation loop with reduced complexity and frame rate limiting
    let frameId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);
      
      // Limit to ~30fps for better performance
      const deltaTime = time - lastTime;
      if (deltaTime < 33) return; // Cap at ~30fps
      lastTime = time;
      
      // Simplified animations
      const speed = isInteracting ? 0.0005 : 0.0002;
      particles.rotation.x += speed;
      particles.rotation.y += speed;
      
      // Simplified sphere animation
      sphere.rotation.y += speed * 2;
      
      renderer.render(scene, camera);
    };
    
    animate(0);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('mousemove', throttledMouseMove);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      particleGeometry.dispose();
      particleMaterial.dispose();
      scene.remove(particles);
      
      if (sphere.geometry) sphere.geometry.dispose();
      if (sphere.material) {
        if (Array.isArray(sphere.material)) {
          sphere.material.forEach(material => material.dispose());
        } else {
          sphere.material.dispose();
        }
      }
      scene.remove(sphere);
    };
  }, [isInteracting]);
  
  return (
    <motion.div 
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1 }}
      ref={mountRef}
    />
  );
};

export default SplineBackground;
