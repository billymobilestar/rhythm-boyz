"use client";

import { motion, type Variants } from "framer-motion";
import AnimatedHeading from "@/components/playground/animated-heading";
import PosterCard from "@/components/playground/poster-card";
import type { Film } from "@/types/database";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function PosterWall({ films }: { films: Film[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatedHeading
        text="FILMOGRAPHY"
        as="h1"
        preset="slide-up"
        className="text-5xl md:text-6xl font-display tracking-tight mb-2"
      />
      <p className="font-serif text-muted text-lg mb-10">
        All films produced by Rhythm Boyz Entertainment.
      </p>

      {films.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
        >
          {films.map((film) => (
            <motion.div key={film.id} variants={item}>
              <PosterCard
                id={film.id}
                title={film.title}
                year={film.year}
                genre={film.genre ?? ""}
                posterUrl={film.poster_url ?? undefined}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">Filmography coming soon.</p>
        </div>
      )}
    </div>
  );
}
