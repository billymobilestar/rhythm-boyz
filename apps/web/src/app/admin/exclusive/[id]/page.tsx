import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExclusiveForm from "@/components/admin/exclusive-form";
import type { ExclusiveContent } from "@/types/database";

export default async function EditExclusivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("exclusive_content").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Exclusive Content</h1>
      <ExclusiveForm content={data as ExclusiveContent} />
    </div>
  );
}
