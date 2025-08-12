import React, { useState, useEffect } from 'react';
import ShaderBackground from './components/ShaderBackground';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ProjectModal from './components/ProjectModal';
import Preloader from './components/Preloader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [openProject, setOpenProject] = useState(null);

  useEffect(() => {
    gsap.from('.headline-stagger .word', { y: 28, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out', delay: 0.2 });
    ScrollTrigger.create({ trigger: '#hero-pin', start: 'top top', end: '+=800', pin: true });
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  const projects = [
    { id: 'p1', title: 'Immersive Interface', role: '3D UX / Motion', description: 'Shader-driven transitions and micro-interactions.', image: '/assets/project1.jpg' },
    { id: 'p2', title: 'Brand Reel', role: 'Motion Graphics', description: 'Fast-paced video reel showcasing motion and edit work.', image: '/assets/project2.jpg' },
    { id: 'p3', title: 'Configurator', role: '3D Web App', description: 'GLB configurator with postprocess and mobile-friendly UI.', image: '/assets/project3.jpg' }
  ];

  return (
    <div className="min-h-screen relative font-sans text-white bg-black overflow-x-hidden">
      {loading && <Preloader onFinish={() => setLoading(false)} />}

      <ShaderBackground />

      <header className="px-6 md:px-12 py-6 z-40 relative flex items-center justify-between">
        <div className="text-lg font-bold">YourName</div>
        <nav className="space-x-6 hidden md:flex">
          <a href="#portfolio" className="opacity-80 hover:opacity-100">Work</a>
          <a href="#about" className="opacity-80 hover:opacity-100">About</a>
          <a href="#contact" className="opacity-80 hover:opacity-100">Contact</a>
        </nav>
      </header>

      <main>
        <section id="hero-pin" className="relative pt-12 pb-12 md:pt-24 md:pb-12">
          <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h1 className="headline-stagger text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                <span className="word block">Immersive</span>
                <span className="word block">3D</span>
                <span className="word block">Designer</span>
                <span className="word block">Portfolio</span>
              </h1>
              <p className="max-w-xl opacity-80 mb-6">I design motion-forward product experiences, high-fidelity 3D interfaces, and cinematic brand motion.</p>
              <div className="flex gap-4">
                <a href="#portfolio" className="px-4 py-2 bg-white text-black rounded">View Work</a>
                <a href="#contact" className="px-4 py-2 border border-white/20 rounded">Contact</a>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <Hero />
            </div>
          </div>
        </section>

        <Gallery projects={projects} onOpen={(p) => setOpenProject(p)} />

        <section id="about" className="py-20 px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-4">About</h2>
          <p className="max-w-3xl opacity-80">I combine UX, motion design and 3D to craft immersive product experiences. I work in Three.js, GLSL shaders, and motion pipelines for realtime and film.</p>
        </section>

        <section id="contact" className="py-16 px-6 md:px-12">
          <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
          <p className="opacity-80">Email: <a href="mailto:hello@yourdomain.com" className="underline">hello@yourdomain.com</a></p>
        </section>
      </main>

      <footer className="py-8 text-center opacity-70">© {new Date().getFullYear()} YourName — 3D UX · Motion · Graphic Design</footer>

      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
    </div>
  );
}
