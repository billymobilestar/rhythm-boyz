"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface LikeButtonProps {
  contentType: "news" | "trailer" | "exclusive";
  contentId: string;
}

export default function LikeButton({ contentType, contentId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLikes() {
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("content_type", contentType)
        .eq("content_id", contentId);

      setCount(likeCount ?? 0);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("content_type", contentType)
          .eq("content_id", contentId)
          .eq("user_id", user.id)
          .single();

        setLiked(!!data);
      }
    }

    fetchLikes();
  }, [contentType, contentId]);

  async function toggleLike() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .eq("user_id", user.id);

      setLiked(false);
      setCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({
        content_type: contentType,
        content_id: contentId,
        user_id: user.id,
      });

      setLiked(true);
      setCount((c) => c + 1);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        liked
          ? "bg-primary/20 text-primary"
          : "bg-card text-muted hover:text-foreground hover:bg-card-hover"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count}
    </button>
  );
}
