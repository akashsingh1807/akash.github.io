
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const SplineBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create floating particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Color
      color.setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.5); // Blue-ish hues
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size
      sizes[i] = Math.random() * 0.1 + 0.03;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Material
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
    
    // Add a few floating shapes
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
    
    // Create shapes
    const torus = createShape(
      new THREE.TorusGeometry(1, 0.3, 16, 100),
      0x0088ff,
      -3,
      -1,
      -4
    );
    
    const sphere = createShape(
      new THREE.SphereGeometry(0.8, 32, 32),
      0x5500ff,
      3,
      2,
      -5
    );
    
    const cube = createShape(
      new THREE.BoxGeometry(1, 1, 1),
      0x00ccff,
      0,
      -2,
      -6
    );
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate particles
      particles.rotation.x += 0.0003;
      particles.rotation.y += 0.0005;
      
      // Rotate shapes
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;
      
      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.004;
      
      cube.rotation.x += 0.004;
      cube.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      scene.remove(particles);
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);
  
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
