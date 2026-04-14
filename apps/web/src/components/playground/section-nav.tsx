"use client";

import { motion } from "framer-motion";

interface SectionNavProps {
  sections: string[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function SectionNav({
  sections,
  activeIndex,
  onNavigate,
}: SectionNavProps) {
  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-center"
      aria-label="Section navigation"
    >
      {sections.map((id, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={id}
            onClick={() => onNavigate(i)}
            className="relative flex items-center justify-center w-6 h-6"
            aria-label={`Go to section ${id}`}
          >
            {isActive && (
              <motion.div
                layoutId="section-nav-active"
                className="absolute rounded-full bg-primary"
                style={{ width: 12, height: 12 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {!isActive && (
              <div
                className="rounded-full border border-border"
                style={{ width: 8, height: 8 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
