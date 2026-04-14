import { createClient } from "@/lib/supabase/server";
import type { ExclusiveContent } from "@/types/database";
import VaultGrid from "@/components/exclusive/vault-grid";

export default async function ExclusivePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: content } = await supabase
    .from("exclusive_content")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <VaultGrid
      content={(content as ExclusiveContent[]) ?? []}
      isLoggedIn={!!user}
    />
  );
}
