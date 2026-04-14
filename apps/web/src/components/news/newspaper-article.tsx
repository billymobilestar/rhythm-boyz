"use client";

import { motion } from "framer-motion";
import CommentsSection from "@/components/comments-section";
import LikeButton from "@/components/like-button";
import type { NewsArticle } from "@/types/database";

export default function NewspaperArticle({
  article,
}: {
  article: NewsArticle;
}) {
  const paragraphs = article.body
    .split("\n")
    .filter((p) => p.trim().length > 0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {article.cover_image_url && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8">
          <motion.img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1, y: -10 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      <motion.h1
        className="text-4xl md:text-5xl font-serif mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {article.title}
      </motion.h1>

      <div className="flex items-center gap-4 mb-8 text-sm text-muted">
        <time>
          {new Date(article.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <LikeButton contentType="news" contentId={article.id} />
      </div>

      <div className="max-w-none text-foreground/90 leading-relaxed">
        {paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <CommentsSection contentType="news" contentId={article.id} />
      </div>
    </article>
  );
}
