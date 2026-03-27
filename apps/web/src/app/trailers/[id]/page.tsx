import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Trailer } from "@/types/database";
import VideoPlayer from "@/components/video-player";
import CommentsSection from "@/components/comments-section";
import LikeButton from "@/components/like-button";

export default async function TrailerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trailer } = await supabase
    .from("trailers")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!trailer) notFound();

  const typedTrailer = trailer as Trailer;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <VideoPlayer url={typedTrailer.video_url} />

      <div className="mt-6">
        <h1 className="text-3xl font-bold">{typedTrailer.title}</h1>
        <div className="flex items-center gap-4 mt-3">
          {typedTrailer.movie_name && (
            <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
              {typedTrailer.movie_name}
            </span>
          )}
          <time className="text-sm text-muted">
            {new Date(typedTrailer.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <LikeButton contentType="trailer" contentId={typedTrailer.id} />
        </div>
        {typedTrailer.description && (
          <p className="mt-4 text-foreground/90">{typedTrailer.description}</p>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <CommentsSection contentType="trailer" contentId={typedTrailer.id} />
      </div>
    </div>
  );
}
