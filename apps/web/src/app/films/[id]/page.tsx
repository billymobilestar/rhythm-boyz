import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Film, Trailer } from "@/types/database";
import CinematicReveal from "@/components/films/cinematic-reveal";

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("films")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!data) notFound();

  const film = data as Film;

  // Fetch linked trailer if exists
  let trailer: Trailer | null = null;
  if (film.trailer_id) {
    const { data: t } = await supabase
      .from("trailers")
      .select("*")
      .eq("id", film.trailer_id)
      .single();
    trailer = t as Trailer | null;
  }

  // Also try to find a trailer by movie name
  if (!trailer && film.title) {
    const { data: t } = await supabase
      .from("trailers")
      .select("*")
      .ilike("movie_name", film.title)
      .eq("published", true)
      .limit(1)
      .maybeSingle();
    trailer = t as Trailer | null;
  }

  const castMembers =
    film.cast_list
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean) ?? [];

  return (
    <CinematicReveal
      film={film}
      trailer={trailer}
      castMembers={castMembers}
    />
  );
}
