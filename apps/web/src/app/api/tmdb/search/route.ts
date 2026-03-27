import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ results: [] });

  if (!TMDB_KEY) {
    return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 });
  }

  const res = await fetch(
    `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`,
  );
  const data = await res.json();

  const results = (data.results ?? []).slice(0, 8).map((m: any) => ({
    tmdb_id: m.id,
    title: m.title,
    year: m.release_date ? new Date(m.release_date).getFullYear() : null,
    synopsis: m.overview,
    poster_url: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : null,
    genre_ids: m.genre_ids,
  }));

  return NextResponse.json({ results });
}
