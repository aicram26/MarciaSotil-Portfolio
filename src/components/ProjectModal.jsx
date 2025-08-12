import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ProjectModal({ project, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(modalRef.current, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => { document.body.style.overflow = ''; },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e) { if (e.key === 'Escape' && isOpen) onClose(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  function handleBackdropClick(e) { if (e.target === modalRef.current) onClose(); }

  if (!project) return null;

  return (
    <div
      ref={modalRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{ pointerEvents: isOpen ? 'auto' : 'none', opacity: 0, transform: 'scale(0.8)' }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close project details">×</button>
        <img src={project.image} alt={project.title} className="modal-image" loading="lazy" />
        <h2 id="modal-title">{project.title}</h2>
        <p id="modal-desc">{project.description || 'Amazing project details go here.'}</p>
      </div>
    </div>
  );
}
