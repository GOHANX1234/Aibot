import { useEffect, useRef } from "react";

export default function StarsBackground() {
  const starsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!starsRef.current) return;
    
    const stars = starsRef.current;
    const NUM_STARS = 100;
    stars.innerHTML = ''; // Clear any existing stars
    
    // Create stars with random positions, sizes, and animations
    for (let i = 0; i < NUM_STARS; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      
      // Random size (1-3px)
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation duration and delay
      const duration = Math.random() * 3 + 2; // 2-5s
      const delay = Math.random() * 5; // 0-5s
      star.style.setProperty('--duration', `${duration}s`);
      star.style.setProperty('--delay', `${delay}s`);
      
      // Random opacity
      const opacity = Math.random() * 0.7 + 0.3; // 0.3-1.0
      star.style.setProperty('--opacity', opacity.toString());
      
      stars.appendChild(star);
    }
    
    return () => {
      stars.innerHTML = '';
    };
  }, []);
  
  return <div ref={starsRef} className="stars" />;
}