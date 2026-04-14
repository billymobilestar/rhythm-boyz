"use client";

import { motion } from "framer-motion";
import CommentsSection from "@/components/comments-section";
import LikeButton from "@/components/like-button";
import type { ExclusiveContent } from "@/types/database";

export default function DeclassifiedArticle({
  item,
}: {
  item: ExclusiveContent;
}) {
  const paragraphs = item.body
    ? item.body.split("\n").filter((p) => p.trim().length > 0)
    : [];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* CLASSIFIED watermark */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
        initial={{ opacity: 0.08 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 2 }}
      >
        <span className="text-[8rem] md:text-[12rem] font-display text-red-500/20 -rotate-30 select-none whitespace-nowrap">
          CLASSIFIED
        </span>
      </motion.div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-accent text-muted capitalize">
            {item.content_type}
          </span>
          {item.is_gated && (
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
              Exclusive
            </span>
          )}
        </div>

        <motion.h1
          className="text-4xl md:text-5xl font-display tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {item.title}
        </motion.h1>

        <div className="flex items-center gap-4 mb-8 text-sm text-muted">
          <time>
            {new Date(item.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <LikeButton contentType="exclusive" contentId={item.id} />
        </div>

        {item.description && (
          <motion.p
            className="text-lg text-muted mb-8"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {item.description}
          </motion.p>
        )}

        {paragraphs.length > 0 && (
          <div className="max-w-none text-foreground/90 leading-relaxed">
            {paragraphs.map((paragraph, i) => (
              <motion.div
                key={i}
                className="mb-4"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                <p>{paragraph}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <CommentsSection contentType="exclusive" contentId={item.id} />
        </div>
      </div>
    </article>
  );
}
