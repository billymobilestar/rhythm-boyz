"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import AnimatedHeading from "@/components/playground/animated-heading";
import type { NewsArticle } from "@/types/database";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Deterministic rotation based on index to avoid hydration mismatch
function getRotation(index: number): number {
  const rotations = [-3, 2, -1, 4, -2, 3, -4, 1];
  return rotations[index % rotations.length];
}

export default function PressRoom({
  articles,
}: {
  articles: NewsArticle[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatedHeading
        text="PRESS ROOM"
        as="h1"
        preset="slide-up"
        className="text-5xl md:text-6xl font-display tracking-tight mb-2"
      />
      <p className="font-serif text-muted text-lg mb-10">
        Latest updates from Rhythm Boyz Entertainment.
      </p>

      {articles.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="corkboard-bg rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {articles.map((article, index) => {
            const rotation = getRotation(index);
            return (
              <motion.div key={article.id} variants={item}>
                <Link href={`/news/${article.slug}`} className="block">
                  <motion.div
                    className="bg-white border-4 border-[#f5f0e8] rounded-sm shadow-lg p-2 pb-4"
                    style={{ rotate: `${rotation}deg` }}
                    whileHover={{
                      rotate: 0,
                      scale: 1.05,
                      boxShadow:
                        "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.05)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    {article.cover_image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="mt-3 px-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <time className="mt-1 block text-xs text-gray-500">
                        {new Date(article.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">No news articles yet.</p>
          <p className="text-sm mt-2">Check back soon for the latest updates.</p>
        </div>
      )}
    </div>
  );
}
