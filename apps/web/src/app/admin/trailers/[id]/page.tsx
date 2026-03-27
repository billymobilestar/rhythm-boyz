import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TrailerForm from "@/components/admin/trailer-form";
import type { Trailer } from "@/types/database";

export default async function EditTrailerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("trailers").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Trailer</h1>
      <TrailerForm trailer={data as Trailer} />
    </div>
  );
}
