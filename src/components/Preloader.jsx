import React, { useEffect } from 'react';
import gsap from 'gsap';

export default function Preloader({ onFinish }) {
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: onFinish });
    tl.to('#preloader-bar', { width: '100%', duration: 1.6, ease: 'power2.out' });
    tl.to('#preloader', { opacity: 0, pointerEvents: 'none', duration: 0.6, delay: 0.3 });
  }, [onFinish]);

  return (
    <div id="preloader" className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
      <div className="w-64">
        <div className="text-center mb-4">Loading portfolio</div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div id="preloader-bar" className="h-full bg-white w-0" />
        </div>
      </div>
    </div>
  );
}
