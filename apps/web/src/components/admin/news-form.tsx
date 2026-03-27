"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { NewsArticle } from "@/types/database";
import ImageUpload from "./image-upload";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewsForm({ article }: { article?: NewsArticle }) {
  const isEdit = !!article;
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [body, setBody] = useState(article?.body ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url ?? "");
  const [published, setPublished] = useState(article?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      slug,
      body,
      cover_image_url: coverImageUrl || null,
      published,
    };

    const { error: err } = isEdit
      ? await supabase.from("news").update(payload).eq("id", article!.id)
      : await supabase.from("news").insert(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/admin/news");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="Article title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground font-mono text-sm"
          placeholder="article-slug"
        />
      </div>

      <ImageUpload
        bucket="covers"
        value={coverImageUrl}
        onChange={setCoverImageUrl}
        label="Cover Image"
      />

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={12}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground resize-y"
          placeholder="Write the article content..."
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
        <span className="text-sm text-muted">Published</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-border text-muted rounded-lg hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
