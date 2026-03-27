import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ExclusiveContent } from "@/types/database";
import CommentsSection from "@/components/comments-section";
import LikeButton from "@/components/like-button";

export default async function ExclusiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("exclusive_content")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!item) notFound();

  const typedItem = item as ExclusiveContent;

  // Redirect to login if gated and not authenticated
  if (typedItem.is_gated) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs px-3 py-1 rounded-full bg-accent text-muted capitalize">
          {typedItem.content_type}
        </span>
        {typedItem.is_gated && (
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
            Exclusive
          </span>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4">{typedItem.title}</h1>

      <div className="flex items-center gap-4 mb-8 text-sm text-muted">
        <time>
          {new Date(typedItem.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <LikeButton contentType="exclusive" contentId={typedItem.id} />
      </div>

      {typedItem.description && (
        <p className="text-lg text-muted mb-8">{typedItem.description}</p>
      )}

      {typedItem.body && (
        <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {typedItem.body}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-border">
        <CommentsSection contentType="exclusive" contentId={typedItem.id} />
      </div>
    </article>
  );
}
