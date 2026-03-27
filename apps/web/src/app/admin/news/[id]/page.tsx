import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NewsForm from "@/components/admin/news-form";
import type { NewsArticle } from "@/types/database";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("news").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
      <NewsForm article={data as NewsArticle} />
    </div>
  );
}
