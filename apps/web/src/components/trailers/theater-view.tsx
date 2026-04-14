"use client";

import { motion } from "framer-motion";
import VideoPlayer from "@/components/video-player";
import CommentsSection from "@/components/comments-section";
import LikeButton from "@/components/like-button";
import type { Trailer } from "@/types/database";

export default function TheaterView({ trailer }: { trailer: Trailer }) {
  return (
    <div className="relative">
      {/* Curtain panels */}
      <motion.div
        className="fixed inset-y-0 left-0 w-1/2 bg-[#5c1a1a] z-50"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed inset-y-0 right-0 w-1/2 bg-[#5c1a1a] z-50"
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Main content fades in after curtain */}
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <VideoPlayer url={trailer.video_url} />

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-display tracking-tight">
            {trailer.title}
          </h1>
          <div className="flex items-center gap-4 mt-3">
            {trailer.movie_name && (
              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                {trailer.movie_name}
              </span>
            )}
            <time className="text-sm text-muted">
              {new Date(trailer.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <LikeButton contentType="trailer" contentId={trailer.id} />
          </div>
          {trailer.description && (
            <motion.p
              className="mt-4 text-foreground/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {trailer.description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CommentsSection contentType="trailer" contentId={trailer.id} />
        </motion.div>
      </motion.div>
    </div>
  );
}
