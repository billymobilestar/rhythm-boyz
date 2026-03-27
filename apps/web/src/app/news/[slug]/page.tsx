import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/database";
import CommentsSection from "@/components/comments-section";
import LikeButton from "@/components/like-button";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) notFound();

  const typedArticle = article as NewsArticle;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {typedArticle.cover_image_url && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8">
          <img
            src={typedArticle.cover_image_url}
            alt={typedArticle.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-4">{typedArticle.title}</h1>

      <div className="flex items-center gap-4 mb-8 text-sm text-muted">
        <time>
          {new Date(typedArticle.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <LikeButton contentType="news" contentId={typedArticle.id} />
      </div>

      <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
        {typedArticle.body}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <CommentsSection contentType="news" contentId={typedArticle.id} />
      </div>
    </article>
  );
}
