import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!TMDB_KEY) {
    return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 });
  }

  // Fetch movie details + credits in parallel
  const [movieRes, creditsRes] = await Promise.all([
    fetch(`${TMDB_BASE}/movie/${id}?api_key=${TMDB_KEY}&language=en-US`),
    fetch(`${TMDB_BASE}/movie/${id}/credits?api_key=${TMDB_KEY}&language=en-US`),
  ]);

  const movie = await movieRes.json();
  const credits = await creditsRes.json();

  // Get director
  const director = credits.crew?.find((c: any) => c.job === "Director")?.name ?? null;

  // Get top 6 cast members
  const cast = (credits.cast ?? [])
    .slice(0, 6)
    .map((c: any) => c.name)
    .join(", ");

  // Get genres
  const genres = (movie.genres ?? []).map((g: any) => g.name).join(", ");

  return NextResponse.json({
    tmdb_id: movie.id,
    title: movie.title,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
    synopsis: movie.overview,
    poster_url: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    genre: genres,
    director,
    cast_list: cast,
    runtime: movie.runtime,
  });
}
