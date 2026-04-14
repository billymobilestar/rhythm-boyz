import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/database";
import PressRoom from "@/components/news/press-room";

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return <PressRoom articles={(articles as NewsArticle[]) ?? []} />;
}
