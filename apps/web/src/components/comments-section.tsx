"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/types/database";

interface CommentsSectionProps {
  contentType: "news" | "trailer" | "exclusive";
  contentId: string;
}

export default function CommentsSection({ contentType, contentId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null));

    // Real-time subscription
    const channel = supabase
      .channel(`comments:${contentType}:${contentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `content_id=eq.${contentId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", payload.new.user_id)
            .single();

          const comment = { ...payload.new, profile } as Comment;
          setComments((prev) => [comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentType, contentId]);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*, profile:profiles(*)")
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .order("created_at", { ascending: false });

    if (data) setComments(data as Comment[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    setSubmitting(true);

    await supabase.from("comments").insert({
      content_type: contentType,
      content_id: contentId,
      user_id: userId,
      body: newComment.trim(),
    });

    setNewComment("");
    setSubmitting(false);
  }

  async function handleDelete(commentId: string) {
    await supabase.from("comments").delete().eq("id", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {userId ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none resize-none text-foreground placeholder-muted"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="mt-2 px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-muted text-sm">
          <a href="/auth/login" className="text-primary hover:underline">Log in</a> to join the conversation.
        </p>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                  {(comment.profile?.display_name ?? "?")[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">
                  {comment.profile?.display_name ?? "Anonymous"}
                </span>
                <span className="text-xs text-muted">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              {userId === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-muted hover:text-primary transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-sm text-foreground/90">{comment.body}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-muted py-8">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
