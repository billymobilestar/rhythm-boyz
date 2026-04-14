import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Trailer } from "@/types/database";
import TheaterView from "@/components/trailers/theater-view";

export default async function TrailerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trailer } = await supabase
    .from("trailers")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!trailer) notFound();

  return <TheaterView trailer={trailer as Trailer} />;
}
