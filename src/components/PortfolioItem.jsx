import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import vertexShader from '../shaders/gallery.vert';
import fragmentShader from '../shaders/gallery.frag';

export default function PortfolioItem({ project, onClick }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 10);
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(width, height);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(project.image);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uHover: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let rafId;
    function animate() {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      texture.dispose();
    };
  }, [project.image]);

  useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.uHover.value = hovered ? 1 : 0;
  }, [hovered]);

  return (
    <div
      ref={containerRef}
      className="portfolio-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      onKeyDown={e => { if (e.key === 'Enter') onClick(); }}
    >
      <div className="project-title">{project.title}</div>
    </div>
  );
}
