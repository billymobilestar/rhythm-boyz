"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Film } from "@/types/database";
import ImageUpload from "./image-upload";

interface TmdbResult {
  tmdb_id: number;
  title: string;
  year: number | null;
  synopsis: string;
  poster_url: string | null;
}

interface TmdbDetail {
  title: string;
  year: number | null;
  synopsis: string;
  poster_url: string | null;
  genre: string;
  director: string | null;
  cast_list: string;
}

export default function FilmForm({ film }: { film?: Film }) {
  const isEdit = !!film;
  const [title, setTitle] = useState(film?.title ?? "");
  const [year, setYear] = useState(film?.year?.toString() ?? new Date().getFullYear().toString());
  const [genre, setGenre] = useState(film?.genre ?? "");
  const [synopsis, setSynopsis] = useState(film?.synopsis ?? "");
  const [posterUrl, setPosterUrl] = useState(film?.poster_url ?? "");
  const [castList, setCastList] = useState(film?.cast_list ?? "");
  const [director, setDirector] = useState(film?.director ?? "");
  const [published, setPublished] = useState(film?.published ?? false);
  const [featured, setFeatured] = useState(film?.featured ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TMDB search state
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState<TmdbResult[]>([]);
  const [tmdbSearching, setTmdbSearching] = useState(false);
  const [tmdbFilling, setTmdbFilling] = useState(false);
  const [tmdbError, setTmdbError] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const supabase = createClient();

  function handleTmdbSearch(query: string) {
    setTmdbQuery(query);
    setTmdbError("");

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.length < 2) {
      setTmdbResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setTmdbSearching(true);
      try {
        const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.error) {
          setTmdbError(data.error);
          setTmdbResults([]);
        } else {
          setTmdbResults(data.results);
        }
      } catch {
        setTmdbError("Failed to search TMDB");
      }
      setTmdbSearching(false);
    }, 400);
  }

  async function selectTmdbFilm(tmdbId: number) {
    setTmdbFilling(true);
    setTmdbError("");

    try {
      const res = await fetch(`/api/tmdb/${tmdbId}`);
      const data: TmdbDetail = await res.json();

      setTitle(data.title);
      if (data.year) setYear(data.year.toString());
      if (data.synopsis) setSynopsis(data.synopsis);
      if (data.poster_url) setPosterUrl(data.poster_url);
      if (data.genre) setGenre(data.genre);
      if (data.director) setDirector(data.director);
      if (data.cast_list) setCastList(data.cast_list);
    } catch {
      setTmdbError("Failed to fetch film details");
    }

    setTmdbResults([]);
    setTmdbQuery("");
    setTmdbFilling(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      year: parseInt(year),
      genre: genre || null,
      synopsis: synopsis || null,
      poster_url: posterUrl || null,
      cast_list: castList || null,
      director: director || null,
      published,
      featured,
    };

    const { error: err } = isEdit
      ? await supabase.from("films").update(payload).eq("id", film!.id)
      : await supabase.from("films").insert(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/admin/films");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* TMDB Auto-fill */}
      <div className="bg-accent/50 rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span className="text-sm font-medium">Auto-fill from TMDB</span>
          <span className="text-xs text-muted">(search for a film to auto-fill all fields)</span>
        </div>
        <input
          type="text"
          value={tmdbQuery}
          onChange={(e) => handleTmdbSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="Search for a film... e.g. Angrej, Chal Mera Putt"
        />
        {tmdbError && (
          <p className="text-xs text-red-400 mt-2">{tmdbError}</p>
        )}
        {tmdbSearching && (
          <p className="text-xs text-muted mt-2">Searching...</p>
        )}
        {tmdbFilling && (
          <p className="text-xs text-primary mt-2">Filling in details...</p>
        )}

        {/* Search results */}
        {tmdbResults.length > 0 && (
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
            {tmdbResults.map((result) => (
              <button
                key={result.tmdb_id}
                type="button"
                onClick={() => selectTmdbFilm(result.tmdb_id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
              >
                {result.poster_url ? (
                  <img src={result.poster_url} alt={result.title} className="w-12 h-16 rounded object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-16 rounded bg-secondary shrink-0 flex items-center justify-center">
                    <span className="text-xs text-muted">N/A</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{result.title}</p>
                  <p className="text-xs text-muted">{result.year ?? "Unknown year"}</p>
                  {result.synopsis && (
                    <p className="text-xs text-muted mt-1 line-clamp-2">{result.synopsis}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
            placeholder="Film title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Year</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required min="1900" max="2100"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Director</label>
          <input type="text" value={director} onChange={(e) => setDirector(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
            placeholder="e.g. Simerjit Singh" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Genre</label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
            placeholder="e.g. Drama, Comedy, Romance" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Cast</label>
        <input type="text" value={castList} onChange={(e) => setCastList(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground"
          placeholder="e.g. Amrinder Gill, Aditi Sharma, Ammy Virk" />
      </div>

      <ImageUpload
        bucket="covers"
        value={posterUrl}
        onChange={setPosterUrl}
        label="Film Poster"
      />

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Synopsis</label>
        <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows={5}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground resize-y"
          placeholder="Brief synopsis of the film..." />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
          <span className="text-sm text-muted">Published</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-yellow-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
          <span className="text-sm text-muted">Featured on homepage</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">
          {loading ? "Saving..." : isEdit ? "Update Film" : "Add Film"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 border border-border text-muted rounded-lg hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
