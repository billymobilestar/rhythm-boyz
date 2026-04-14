"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import AnimatedHeading from "@/components/playground/animated-heading";
import type { ExclusiveContent } from "@/types/database";

const typeIcons: Record<string, string> = {
  article: "Article",
  video: "Video",
  gallery: "Gallery",
};

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

export default function VaultGrid({
  content,
  isLoggedIn,
}: {
  content: ExclusiveContent[];
  isLoggedIn: boolean;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatedHeading
        text="THE VAULT"
        as="h1"
        preset="slide-up"
        className="text-5xl md:text-6xl font-display tracking-tight mb-2"
      />
      <p className="font-serif text-muted text-lg mb-10">
        Behind-the-scenes access, interviews, and more.
      </p>

      {content.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {content.map((contentItem) => {
            const isLocked = contentItem.is_gated && !isLoggedIn;

            return (
              <motion.div key={contentItem.id} variants={item}>
                <div className="relative holo-shimmer rounded-xl overflow-hidden border border-border bg-card transition-all">
                  {isLocked && (
                    <div className="absolute top-3 right-3 z-10 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                      <motion.svg
                        className="w-3.5 h-3.5 text-warning"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path d="M12 1C8.676 1 6 3.676 6 7v2H4v14h16V9h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
                      </motion.svg>
                      <span className="text-xs text-warning">Members Only</span>
                    </div>
                  )}

                  {isLocked ? (
                    <Link href="/auth/login" className="block">
                      <div className="p-6">
                        <span className="text-xs px-2 py-1 rounded-full bg-accent text-muted">
                          {typeIcons[contentItem.content_type]}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold">
                          {contentItem.title}
                        </h3>
                        {contentItem.description && (
                          <p className="mt-2 text-sm text-muted line-clamp-2">
                            {contentItem.description}
                          </p>
                        )}
                        <p className="mt-4 text-sm text-primary">
                          Sign in to unlock
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/exclusive/${contentItem.id}`} className="block">
                      <motion.div
                        className="p-6"
                        whileHover={{
                          boxShadow:
                            "0 0 20px rgba(233, 69, 96, 0.2), 0 0 40px rgba(233, 69, 96, 0.1)",
                        }}
                      >
                        <span className="text-xs px-2 py-1 rounded-full bg-accent text-muted">
                          {typeIcons[contentItem.content_type]}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold hover:text-primary transition-colors">
                          {contentItem.title}
                        </h3>
                        {contentItem.description && (
                          <p className="mt-2 text-sm text-muted line-clamp-2">
                            {contentItem.description}
                          </p>
                        )}
                        <time className="mt-3 block text-xs text-muted">
                          {new Date(
                            contentItem.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </motion.div>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">No exclusive content yet.</p>
          <p className="text-sm mt-2">
            Check back for behind-the-scenes access.
          </p>
        </div>
      )}
    </div>
  );
}
