"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue } from "framer-motion";
import type { Trailer, NewsArticle, Film } from "@/types/database";
import AnimatedHeading from "@/components/playground/animated-heading";
import PosterCard from "@/components/playground/poster-card";
import SectionNav from "@/components/playground/section-nav";

/* ── Types ───────────────────────────────────────────── */

interface StudioLotHomeProps {
  trailers: Trailer[];
  articles: NewsArticle[];
  films: Film[];
}

/* ── Helpers ─────────────────────────────────────────── */

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch)
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch)
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

const SECTIONS = ["gate", "screening", "posters", "press", "vault"];
const SECTION_LABELS = ["The Gate", "Screening Room", "Poster Alley", "Press Room", "The Vault"];

/* ── Component ───────────────────────────────────────── */

export default function StudioLotHome({
  trailers,
  articles,
  films,
}: StudioLotHomeProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* ── Intersection Observer for active zone ─────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(
              entry.target as HTMLElement
            );
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function handleNavigate(index: number) {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }

  const featuredTrailer = trailers[0] ?? null;
  const otherTrailers = trailers.slice(1, 4);

  /* ── Random rotations for press cards (stable) ─────── */
  const cardRotations = useMemo(
    () => articles.map(() => Math.random() * 12 - 6),
    [articles]
  );

  /* ── Spotlight tracking for poster alley ───────────── */
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const handlePosterMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlightPos({ x, y });
    },
    []
  );

  /* ── Drag constraints for poster wall ──────────────── */
  const dragX = useMotionValue(0);
  const posterContainerRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);

  useEffect(() => {
    function measure() {
      const el = posterContainerRef.current;
      if (!el) return;
      const scrollW = el.scrollWidth;
      const clientW = el.parentElement?.clientWidth ?? window.innerWidth;
      setDragConstraint(Math.min(0, -(scrollW - clientW)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [films]);

  return (
    <div className="relative">
      {/* Section Nav */}
      <SectionNav
        sections={SECTIONS}
        activeIndex={activeIndex}
        onNavigate={handleNavigate}
      />

      {/* ════════════════════════════════════════════════ */}
      {/* ZONE 1 — The Gate (Hero)                       */}
      {/* ════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        id="gate"
        className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
              top: "-10%",
              left: "50%",
              transform: "translateX(-50%)",
              animation: "pulse 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
            style={{
              background: "radial-gradient(circle, var(--neon-blue) 0%, transparent 70%)",
              bottom: "10%",
              right: "10%",
              animation: "pulse 8s ease-in-out infinite reverse",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4">
          <AnimatedHeading
            text="RHYTHM BOYZ"
            as="h1"
            preset="slide-up"
            className="font-display text-[12vw] leading-none text-foreground"
          />
          <p className="font-serif tracking-[0.5em] text-muted text-lg md:text-2xl mt-4 uppercase">
            Entertainment
          </p>
          <div className="mt-16">
            <p className="text-muted text-sm tracking-widest uppercase mb-3">
              Enter the Lot
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <svg
                className="w-8 h-8 text-primary mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* ZONE 2 — Screening Room (Trailers)             */}
      {/* ════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        id="screening"
        className="snap-section relative overflow-hidden py-20"
        style={{ background: "#0a0a0f" }}
      >
        {/* Marquee heading */}
        <div className="marquee mb-12">
          <div className="flex shrink-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="font-display text-[8vw] text-foreground/10 whitespace-nowrap mx-8"
              >
                NOW SCREENING
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Featured trailer */}
          {featuredTrailer ? (
            <div className="mb-12">
              <div
                className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden"
                style={{
                  border: "4px solid var(--border)",
                  boxShadow:
                    "0 0 40px rgba(233, 69, 96, 0.15), inset 0 0 40px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="aspect-video">
                  <iframe
                    src={getEmbedUrl(featuredTrailer.video_url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={featuredTrailer.title}
                  />
                </div>
              </div>
              <p className="text-center mt-4 text-muted text-sm">
                {featuredTrailer.title}
                {featuredTrailer.movie_name && (
                  <span className="text-primary ml-2">
                    | {featuredTrailer.movie_name}
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-center text-muted text-2xl font-display tracking-widest mb-12">
              COMING SOON
            </p>
          )}

          {/* Smaller trailer cards */}
          {otherTrailers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherTrailers.map((trailer) => (
                <motion.div
                  key={trailer.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={`/trailers/${trailer.id}`}
                    className="group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="aspect-video bg-secondary relative overflow-hidden">
                      {trailer.thumbnail_url ? (
                        <img
                          src={trailer.thumbnail_url}
                          alt={trailer.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {trailer.title}
                      </h3>
                      {trailer.movie_name && (
                        <p className="text-xs text-muted mt-0.5">
                          {trailer.movie_name}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* ZONE 3 — Poster Alley (Films)                  */}
      {/* ════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        id="posters"
        className="snap-section relative overflow-hidden flex items-center"
        onMouseMove={handlePosterMouseMove}
        style={{
          background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(233,69,96,0.08) 0%, transparent 50%), var(--background)`,
          minHeight: "100vh",
        }}
      >
        {/* Rotated side title */}
        <div
          className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 origin-center"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          <span className="font-display text-[8vw] text-foreground/5 leading-none select-none">
            THE WALL
          </span>
        </div>

        <div className="w-full pl-4 lg:pl-32 py-20 overflow-hidden">
          {films.length > 0 ? (
            <motion.div
              ref={posterContainerRef}
              drag="x"
              dragConstraints={{ left: dragConstraint, right: 0 }}
              style={{ x: dragX }}
              className="flex gap-6 cursor-grab active:cursor-grabbing pr-8"
            >
              {films.map((film) => (
                <div key={film.id} className="shrink-0 w-[220px] md:w-[260px]">
                  <PosterCard
                    id={film.id}
                    title={film.title}
                    year={film.year}
                    genre={film.genre ?? ""}
                    posterUrl={film.poster_url ?? undefined}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-muted w-full font-display text-2xl tracking-widest">
              FILMS COMING SOON
            </p>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* ZONE 4 — Press Room (News)                     */}
      {/* ════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        id="press"
        className="snap-section relative overflow-hidden py-20 corkboard-bg"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-5xl md:text-7xl text-center text-white mb-16 drop-shadow-lg">
            FRESH OFF THE PRESS
          </h2>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40, rotate: cardRotations[i] }}
                  whileInView={{ opacity: 1, y: 0, rotate: cardRotations[i] }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="w-full max-w-sm"
                >
                  <Link
                    href={`/news/${article.slug}`}
                    className="block bg-white p-3 rounded shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    {article.cover_image_url && (
                      <div className="aspect-video overflow-hidden rounded-sm mb-3">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    <time className="text-xs text-gray-500">
                      {new Date(article.created_at).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </time>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/60 font-display text-2xl tracking-widest">
              NEWS COMING SOON
            </p>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* ZONE 5 — The Vault (Exclusive + CTA)           */}
      {/* ════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[4] = el; }}
        id="vault"
        className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        {/* Vault door graphic */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-12"
        >
          <div
            className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center"
            style={{
              border: "4px solid var(--border)",
              boxShadow:
                "0 0 60px rgba(233,69,96,0.1), inset 0 0 60px rgba(233,69,96,0.05)",
            }}
          >
            {/* Handle / wheel */}
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
              style={{ border: "3px solid var(--border)" }}
            >
              {/* Spokes */}
              <div className="relative w-full h-full">
                <div
                  className="absolute top-1/2 left-1/2 w-3/4 h-0.5 bg-border"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 w-3/4 h-0.5 bg-border"
                  style={{ transform: "translate(-50%, -50%) rotate(60deg)" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 w-3/4 h-0.5 bg-border"
                  style={{ transform: "translate(-50%, -50%) rotate(120deg)" }}
                />
                {/* Center bolt */}
                <div
                  className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-primary"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <h2 className="font-display text-5xl md:text-7xl neon-text text-foreground text-center mb-4">
          UNLOCK THE VAULT
        </h2>
        <p className="text-muted text-center max-w-md mb-10 px-4">
          Sign in for exclusive behind-the-scenes content
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mb-16">
          <Link
            href="/auth/signup"
            className="px-8 py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors text-lg"
          >
            Sign Up
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3.5 border border-border text-foreground rounded-lg font-medium hover:border-primary hover:text-primary transition-colors text-lg"
          >
            Log In
          </Link>
        </div>

        {/* Social links */}
        <div className="flex gap-8">
          <a
            href="https://www.youtube.com/@RhythmBoyz"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted hover:text-red-400 transition-all duration-300"
            aria-label="YouTube"
          >
            <svg
              className="w-7 h-7 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,45,117,0.7)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/rhythmboyzentertainment/"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted hover:text-pink-400 transition-all duration-300"
            aria-label="Instagram"
          >
            <svg
              className="w-7 h-7 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,45,117,0.7)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/Rhythmboyzofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted hover:text-blue-400 transition-all duration-300"
            aria-label="Facebook"
          >
            <svg
              className="w-7 h-7 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.7)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </section>

    </div>
  );
}
