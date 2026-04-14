"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const springX = useSpring(0, { damping: 25, stiffness: 250 });
  const springY = useSpring(0, { damping: 25, stiffness: 250 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    if (mq.matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        setHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        setHovering(false);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [springX, springY, visible]);

  if (isTouch) return null;

  const ringSize = hovering ? 48 : 32;

  return (
    <>
      {/* Dot */}
      <div
        className="pointer-events-none fixed z-[10001]"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#e94560",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s",
        }}
      />
      {/* Trailing ring */}
      <motion.div
        className="pointer-events-none fixed z-[10000]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: "1.5px solid #e94560",
          opacity: visible ? 0.6 : 0,
          transition: "width 0.2s, height 0.2s, opacity 0.15s",
        }}
      />
    </>
  );
}
