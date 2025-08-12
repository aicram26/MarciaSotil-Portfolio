import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const scene = new THREE.Scene();

    // Camera (we will animate this with GSAP/ScrollTrigger)
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.2, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(el.clientWidth || window.innerWidth, el.clientHeight || window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    el.appendChild(renderer.domElement);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7.5);
    scene.add(hemi, dir);

    // Floating island placeholder (geometry + subtle vertex noise)
    const island = new THREE.Group();
    const baseGeo = new THREE.IcosahedronGeometry(1.4, 3);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x6c2bd6, roughness: 0.35, metalness: 0.05 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.2;
    island.add(baseMesh);

    // Ring
    const ringGeo = new THREE.TorusGeometry(1.8, 0.03, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x2a002a, roughness: 0.25 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.5;
    island.add(ring);

    // Particles (simple point cloud)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = THREE.MathUtils.randFloat(1.8, 3.2);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(-0.6, 0.8);
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.03, color: 0xffffff, transparent: true, opacity: 0.9 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    island.position.y = -0.3;
    scene.add(island);

    // Controls (only for desktop; we'll disable interaction for mobile)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 10;

    // Responsive resize
    function onResize() {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // GSAP ScrollTrigger camera timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-pin',
        start: 'top top',
        end: '+=1500',
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Key camera positions/rotations to create a cinematic journey
    tl.to(camera.position, { x: 0, y: 1.0, z: 5.2, duration: 1 }, 0);
    tl.to(camera.rotation, { x: -0.05, y: 0, z: 0, duration: 1 }, 0);

    tl.to(camera.position, { x: -0.8, y: 0.8, z: 4.8, duration: 1.2 }, 0.5);
    tl.to(camera.rotation, { x: -0.12, y: -0.12, z: 0, duration: 1.2 }, 0.5);

    tl.to(camera.position, { x: 1.2, y: 0.9, z: 3.8, duration: 1.6 }, 1.2);
    tl.to(camera.rotation, { x: -0.2, y: 0.25, z: 0, duration: 1.6 }, 1.2);

    // small island animation tied to scroll for parallax
    tl.to(island.rotation, { y: Math.PI * 1.2, duration: 3 }, 0);
    tl.to(ring.rotation, { z: Math.PI * 2, duration: 2.5 }, 0.2);

    // Animation loop
    const clock = new THREE.Clock();
    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // idle animations
      island.rotation.y += 0.003 + Math.sin(t * 0.5) * 0.0007;
      ring.rotation.z += 0.005 + Math.cos(t * 0.7) * 0.0009;
      particles.rotation.y = t * 0.02;

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fade-in" />;
}
