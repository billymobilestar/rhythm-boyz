"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ExclusiveContent } from "@/types/database";

const contentTypes = [
  { value: "article", label: "Article" },
  { value: "video", label: "Video" },
  { value: "gallery", label: "Gallery" },
];

export default function ExclusiveForm({ content }: { content?: ExclusiveContent }) {
  const isEdit = !!content;
  const [title, setTitle] = useState(content?.title ?? "");
  const [description, setDescription] = useState(content?.description ?? "");
  const [contentType, setContentType] = useState<string>(content?.content_type ?? "article");
  const [body, setBody] = useState(content?.body ?? "");
  const [mediaUrl, setMediaUrl] = useState(content?.media_url ?? "");
  const [isGated, setIsGated] = useState(content?.is_gated ?? true);
  const [published, setPublished] = useState(content?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      description: description || null,
      content_type: contentType,
      body: body || null,
      media_url: mediaUrl || null,
      is_gated: isGated,
      published,
    };

    const { error: err } = isEdit
      ? await supabase.from("exclusive_content").update(payload).eq("id", content!.id)
      : await supabase.from("exclusive_content").insert(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/admin/exclusive");
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
          placeholder="Content title" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Content Type</label>
        <div className="flex gap-2">
          {contentTypes.map((ct) => (
            <button key={ct.value} type="button" onClick={() => setContentType(ct.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                contentType === ct.value ? "bg-primary text-white" : "bg-card border border-border text-muted hover:text-foreground"
              }`}>
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="Short description" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Media URL (optional)</label>
        <input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="https://..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Body</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground resize-y"
          placeholder="Full content..." />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isGated} onChange={(e) => setIsGated(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-yellow-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
          <span className="text-sm text-muted">Members Only</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
          <span className="text-sm text-muted">Published</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">
          {loading ? "Saving..." : isEdit ? "Update Content" : "Create Content"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 border border-border text-muted rounded-lg hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
