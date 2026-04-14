import { createClient } from "@/lib/supabase/server";
import type { Trailer, NewsArticle, Film } from "@/types/database";
import StudioLotHome from "@/components/playground/studio-lot-home";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: trailers }, { data: articles }, { data: films }] = await Promise.all([
    supabase
      .from("trailers")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("films")
      .select("*")
      .eq("published", true)
      .order("year", { ascending: false }),
  ]);

  return (
    <StudioLotHome
      trailers={(trailers as Trailer[]) ?? []}
      articles={(articles as NewsArticle[]) ?? []}
      films={(films as Film[]) ?? []}
    />
  );
}
