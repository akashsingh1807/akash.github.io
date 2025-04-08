
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const SplineBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create code-like particles - representing a developer theme
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = Math.min(300, Math.floor((window.innerWidth * window.innerHeight) / 15000)); // Responsive particle count
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
      // Position - create a grid-like structure reminiscent of code
      const xGrid = (Math.random() - 0.5) * 10;
      const yGrid = (Math.random() - 0.5) * 10;
      const zGrid = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = xGrid;
      positions[i * 3 + 1] = yGrid;
      positions[i * 3 + 2] = zGrid;
      
      // Color - use developer-friendly color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        color.setHSL(0.6, 0.7, 0.5); // Blue - Java
      } else if (colorChoice < 0.66) {
        color.setHSL(0.3, 0.7, 0.5); // Green - Spring
      } else {
        color.setHSL(0.1, 0.7, 0.5); // Orange - JavaScript/React
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size - vary for visual interest
      sizes[i] = Math.random() * 0.1 + 0.03;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create code-like floating elements using shaders for better performance
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    // Create points
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Create code-related shapes (representing technology elements)
    const createShape = (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number) => {
      const material = new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.7,
        shininess: 100
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return mesh;
    };
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create shapes to represent technologies
    // Java-like cup shape
    const torus = createShape(
      new THREE.TorusGeometry(1, 0.3, 16, 100),
      0x5382a1, // Java blue
      -3,
      -1,
      -4
    );
    
    // Spring-like spiral
    const sphere = createShape(
      new THREE.SphereGeometry(0.8, 32, 32),
      0x6db33f, // Spring green
      3,
      2,
      -5
    );
    
    // Database-like structure
    const cylinder = createShape(
      new THREE.CylinderGeometry(0.7, 0.7, 1.2, 16),
      0xf29111, // MySQL orange
      -2,
      -3,
      -6
    );
    
    // React-like atom
    const ring = createShape(
      new THREE.TorusGeometry(1.2, 0.1, 8, 50),
      0x61dafb, // React blue
      2,
      -2,
      -5
    );
    
    // Handle mouse interaction
    const mousePosition = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Subtle camera movement based on mouse position
      if (camera) {
        camera.position.x += (mousePosition.x * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mousePosition.y * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
      }
      
      setIsInteracting(true);
      setTimeout(() => setIsInteracting(false), 2000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize efficiently
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop with performance optimizations
    let frameId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);
      
      // Throttle animations for better performance
      const deltaTime = time - lastTime;
      if (deltaTime < 16.7) return; // Cap at ~60fps
      lastTime = time;
      
      // Particles react to interaction
      const interactionSpeed = isInteracting ? 0.001 : 0.0003;
      particles.rotation.x += interactionSpeed;
      particles.rotation.y += interactionSpeed * 1.5;
      
      // Shape animations - more dynamic when user is interacting
      const torSpeed = isInteracting ? 0.006 : 0.003;
      torus.rotation.x += torSpeed;
      torus.rotation.y += torSpeed * 1.2;
      
      const sphSpeed = isInteracting ? 0.004 : 0.002;
      sphere.rotation.x += sphSpeed;
      sphere.rotation.y += sphSpeed * 1.3;
      
      const cylSpeed = isInteracting ? 0.003 : 0.001;
      cylinder.rotation.x += cylSpeed;
      cylinder.rotation.z += cylSpeed * 1.1;
      
      const ringSpeed = isInteracting ? 0.005 : 0.002;
      ring.rotation.x += ringSpeed;
      ring.rotation.y += ringSpeed * 0.7;
      
      renderer.render(scene, camera);
    };
    
    animate(0);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
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
      
      [torus, sphere, cylinder, ring].forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
        scene.remove(mesh);
      });
    };
  }, [isInteracting]);
  
  return (
    <motion.div 
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      ref={mountRef}
    />
  );
};

export default SplineBackground;
