import { createClient } from "@/lib/supabase/server";
import type { Trailer } from "@/types/database";
import ScreeningRoom from "@/components/trailers/screening-room";

export default async function TrailersPage() {
  const supabase = await createClient();

  const { data: trailers } = await supabase
    .from("trailers")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return <ScreeningRoom trailers={(trailers as Trailer[]) ?? []} />;
}
