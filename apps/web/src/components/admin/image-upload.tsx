"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  bucket: "thumbnails" | "covers";
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ bucket, value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function upload(file: File) {
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onChange(data.publicUrl);
    }

    setUploading(false);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) upload(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-1">{label}</label>

      {/* Preview */}
      {value && (
        <div className="mb-3 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-400"
          >
            x
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted"
        }`}
      >
        {uploading ? (
          <p className="text-sm text-muted">Uploading...</p>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto mb-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-muted">
              Drop an image here or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted mt-1">PNG, JPG, WebP</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Manual URL input */}
      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground text-sm"
          placeholder="Or paste image URL"
        />
      </div>
    </div>
  );
}
