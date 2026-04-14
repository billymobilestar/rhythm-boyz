"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Film, Trailer } from "@/types/database";

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

const castContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.6 } },
};

const castChip: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

interface CinematicRevealProps {
  film: Film;
  trailer: Trailer | null;
  castMembers: string[];
}

export default function CinematicReveal({
  film,
  trailer,
  castMembers,
}: CinematicRevealProps) {
  const [lightsDimmed, setLightsDimmed] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/films"
        className="text-sm text-muted hover:text-primary transition-colors mb-6 inline-block"
      >
        &larr; Back to Filmography
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster - slides in from left */}
        <motion.div
          className="md:col-span-1"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="aspect-2/3 rounded-xl overflow-hidden bg-secondary border border-border">
            {film.poster_url ? (
              <img
                src={film.poster_url}
                alt={film.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary/30 text-center px-4">
                  {film.title}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Details - slides in from right */}
        <motion.div
          className="md:col-span-2"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-display tracking-tight mb-2">
            {film.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-3 mb-6">
            <span className="text-lg text-primary font-semibold">
              {film.year}
            </span>
            {film.genre && (
              <span className="px-3 py-1 rounded-full bg-accent text-sm text-muted">
                {film.genre}
              </span>
            )}
          </div>

          {film.director && (
            <div className="mb-4">
              <p className="text-sm text-muted">Directed by</p>
              <p className="text-lg font-medium">{film.director}</p>
            </div>
          )}

          {film.synopsis && (
            <div className="mb-6">
              <h2 className="text-sm text-muted mb-2">Synopsis</h2>
              <p className="text-foreground/85 leading-relaxed">
                {film.synopsis}
              </p>
            </div>
          )}

          {castMembers.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm text-muted mb-3">Cast</h2>
              <motion.div
                className="flex flex-wrap gap-2"
                variants={castContainer}
                initial="hidden"
                animate="visible"
              >
                {castMembers.map((name) => (
                  <motion.span
                    key={name}
                    variants={castChip}
                    className="px-3 py-1.5 bg-card rounded-lg border border-border text-sm"
                  >
                    {name}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          )}

          {/* Trailer with lights-dim effect */}
          {trailer && (
            <div className="mt-8 relative">
              <h2 className="text-sm text-muted mb-3">Trailer</h2>
              <div
                className="relative"
                onMouseEnter={() => setLightsDimmed(true)}
                onMouseLeave={() => setLightsDimmed(false)}
              >
                {/* Dim overlay */}
                {lightsDimmed && (
                  <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none transition-opacity duration-300" />
                )}
                <div
                  className={`aspect-video rounded-xl overflow-hidden bg-black border border-border relative ${lightsDimmed ? "z-50" : ""}`}
                >
                  <iframe
                    src={getEmbedUrl(trailer.video_url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${film.title} Trailer`}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
