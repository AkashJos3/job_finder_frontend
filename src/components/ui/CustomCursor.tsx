import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, { damping: 25, stiffness: 200, mass: 0.5 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    // Only show on desktop
    if (window.innerWidth < 768) return;
    setIsVisible(true);

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
    };

    const mouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', mouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', mouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          * {
            cursor: none !important;
          }
        `}
      </style>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#F5C518] pointer-events-none z-[9999] mix-blend-exclusion"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.3 : 0.8
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#F5C518] pointer-events-none z-[9999] mix-blend-exclusion"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1
        }}
        transition={{ type: "tween", duration: 0 }}
      />
    </>
  );
}
