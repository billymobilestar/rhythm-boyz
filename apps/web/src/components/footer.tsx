"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-background">
      {/* Film-strip decorative border */}
      <div
        className="h-8 w-full"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              var(--border) 0px,
              var(--border) 2px,
              transparent 2px,
              transparent 12px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 14px,
              var(--secondary) 14px,
              var(--secondary) 16px
            ),
            linear-gradient(
              180deg,
              var(--secondary) 0%,
              var(--secondary) 25%,
              var(--card) 25%,
              var(--card) 75%,
              var(--secondary) 75%,
              var(--secondary) 100%
            )
          `,
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        {/* Studio title */}
        <p className="font-display text-4xl md:text-5xl tracking-widest text-foreground mb-2">
          RHYTHM BOYZ ENTERTAINMENT
        </p>
        <p className="text-muted text-sm tracking-[0.3em] uppercase mb-12">
          Punjabi Cinema &middot; Music Label &middot; Est. 2013
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <Link href="/#about" className="text-sm text-muted hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/films" className="text-sm text-muted hover:text-foreground transition-colors">
            Films
          </Link>
          <Link href="/trailers" className="text-sm text-muted hover:text-foreground transition-colors">
            Trailers
          </Link>
          <Link href="/exclusive" className="text-sm text-muted hover:text-foreground transition-colors">
            Exclusive Content
          </Link>
          <Link href="/feedback" className="text-sm text-muted hover:text-foreground transition-colors">
            Feedback
          </Link>
        </div>

        {/* Social icons — neon on hover */}
        <div className="flex justify-center gap-8 mb-12">
          <a
            href="https://www.youtube.com/@RhythmBoyz"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted transition-all duration-300 hover:text-red-400 hover:neon-text"
            aria-label="YouTube"
          >
            <svg className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,45,117,0.6)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/rhythmboyzentertainment/"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted transition-all duration-300 hover:text-pink-400"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,45,117,0.6)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/Rhythmboyzofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted transition-all duration-300 hover:text-blue-400"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-border mx-auto mb-6" />

        {/* Copyright */}
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Rhythm Boyz Entertainment INC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
