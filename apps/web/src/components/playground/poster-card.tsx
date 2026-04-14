"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";

interface PosterCardProps {
  id: string;
  title: string;
  year: number;
  genre: string;
  posterUrl?: string;
  className?: string;
}

export default function PosterCard({
  id,
  title,
  year,
  genre,
  posterUrl,
  className = "",
}: PosterCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = ((centerY - y) / centerY) * 12;
    setTilt({ rotateX, rotateY });
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0 });
    setHovering(false);
  }

  return (
    <Link href={`/films/${id}`} className={`block ${className}`}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="rounded-lg overflow-hidden bg-card transition-shadow duration-300"
        style={{
          perspective: "800px",
          transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${hovering ? 1.03 : 1})`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s",
          boxShadow: hovering
            ? "0 0 20px rgba(233, 69, 96, 0.4), 0 8px 32px rgba(0, 0, 0, 0.5)"
            : "0 2px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-secondary">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 300px"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted text-sm font-display uppercase tracking-wider">
              {title}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-display text-lg text-foreground leading-tight">
            {title}
          </h3>
          <p className="text-sm text-muted mt-1">
            {year} &middot; {genre}
          </p>
        </div>
      </div>
    </Link>
  );
}
