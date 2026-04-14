import { createClient } from "@/lib/supabase/server";
import type { Film } from "@/types/database";
import PosterWall from "@/components/films/poster-wall";

export default async function FilmsPage() {
  const supabase = await createClient();

  const { data: films } = await supabase
    .from("films")
    .select("*")
    .eq("published", true)
    .order("year", { ascending: false });

  return <PosterWall films={(films as Film[]) ?? []} />;
}
