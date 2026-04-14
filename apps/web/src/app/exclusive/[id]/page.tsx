import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ExclusiveContent } from "@/types/database";
import DeclassifiedArticle from "@/components/exclusive/declassified-article";

export default async function ExclusiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("exclusive_content")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!item) notFound();

  const typedItem = item as ExclusiveContent;

  // Redirect to login if gated and not authenticated
  if (typedItem.is_gated) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");
  }

  return <DeclassifiedArticle item={typedItem} />;
}
