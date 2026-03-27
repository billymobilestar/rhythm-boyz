"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Trailer } from "@/types/database";
import ImageUpload from "./image-upload";

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export default function TrailerForm({ trailer }: { trailer?: Trailer }) {
  const isEdit = !!trailer;
  const [title, setTitle] = useState(trailer?.title ?? "");
  const [description, setDescription] = useState(trailer?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(trailer?.video_url ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(trailer?.thumbnail_url ?? "");
  const [movieName, setMovieName] = useState(trailer?.movie_name ?? "");
  const [published, setPublished] = useState(trailer?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoThumb, setAutoThumb] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  function handleVideoUrlChange(url: string) {
    setVideoUrl(url);

    // Auto-generate thumbnail from YouTube
    const ytThumb = getYouTubeThumbnail(url);
    if (ytThumb) {
      setAutoThumb(ytThumb);
      if (!thumbnailUrl) setThumbnailUrl(ytThumb);
      return;
    }

    // For Vimeo, we can't easily get thumbnails without an API key
    // but we flag it
    if (getVimeoId(url)) {
      setAutoThumb(null);
    } else {
      setAutoThumb(null);
    }
  }

  function useAutoThumbnail() {
    if (autoThumb) setThumbnailUrl(autoThumb);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      description: description || null,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl || null,
      movie_name: movieName || null,
      published,
    };

    const { error: err } = isEdit
      ? await supabase.from("trailers").update(payload).eq("id", trailer!.id)
      : await supabase.from("trailers").insert(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/admin/trailers");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="Trailer title" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Movie Name</label>
        <input type="text" value={movieName} onChange={(e) => setMovieName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="e.g. Eclipse" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Video URL (YouTube/Vimeo)</label>
        <input type="url" value={videoUrl} onChange={(e) => handleVideoUrlChange(e.target.value)} required
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="https://www.youtube.com/watch?v=..." />

        {/* Auto-detected thumbnail */}
        {autoThumb && (
          <div className="mt-3 p-3 rounded-lg bg-accent/50 border border-border">
            <p className="text-xs text-muted mb-2">Auto-detected YouTube thumbnail:</p>
            <div className="flex items-start gap-3">
              <img src={autoThumb} alt="Auto thumbnail" className="h-20 rounded-lg object-cover" />
              <div>
                <p className="text-xs text-muted mb-2 break-all">{autoThumb}</p>
                {thumbnailUrl !== autoThumb && (
                  <button
                    type="button"
                    onClick={useAutoThumbnail}
                    className="text-xs px-3 py-1 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
                  >
                    Use this thumbnail
                  </button>
                )}
                {thumbnailUrl === autoThumb && (
                  <span className="text-xs text-green-400">Currently using this</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail upload / URL */}
      <ImageUpload
        bucket="thumbnails"
        value={thumbnailUrl}
        onChange={setThumbnailUrl}
        label="Thumbnail (upload or auto-detected from video)"
      />

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground resize-y"
          placeholder="Brief description of the trailer" />
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
        <span className="text-sm text-muted">Published</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">
          {loading ? "Saving..." : isEdit ? "Update Trailer" : "Create Trailer"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 border border-border text-muted rounded-lg hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
