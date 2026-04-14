import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/database";
import NewspaperArticle from "@/components/news/newspaper-article";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) notFound();

  return <NewspaperArticle article={article as NewsArticle} />;
}
