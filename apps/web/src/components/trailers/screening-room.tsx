"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import AnimatedHeading from "@/components/playground/animated-heading";
import type { Trailer } from "@/types/database";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ScreeningRoom({
  trailers,
}: {
  trailers: Trailer[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatedHeading
        text="TRAILERS"
        as="h1"
        preset="slide-up"
        className="text-5xl md:text-6xl font-display tracking-tight mb-2"
      />
      <p className="font-serif text-muted text-lg mb-10">
        Watch the latest trailers from RBZ Studios.
      </p>

      {trailers.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {trailers.map((trailer) => (
            <motion.div key={trailer.id} variants={item}>
              <Link href={`/trailers/${trailer.id}`} className="block">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:neon-box transition-all"
                >
                  <div className="aspect-video bg-secondary overflow-hidden relative">
                    {trailer.thumbnail_url && (
                      <img
                        src={trailer.thumbnail_url}
                        alt={trailer.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
                      >
                        <svg
                          className="w-7 h-7 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{trailer.title}</h3>
                    {trailer.movie_name && (
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {trailer.movie_name}
                      </span>
                    )}
                    {trailer.description && (
                      <p className="mt-2 text-sm text-muted line-clamp-2">
                        {trailer.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">No trailers available yet.</p>
          <p className="text-sm mt-2">Stay tuned for upcoming releases.</p>
        </div>
      )}
    </div>
  );
}
