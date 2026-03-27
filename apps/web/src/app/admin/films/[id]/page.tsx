import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FilmForm from "@/components/admin/film-form";
import type { Film } from "@/types/database";

export default async function EditFilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("films").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Film</h1>
      <FilmForm film={data as Film} />
    </div>
  );
}
