"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DeleteButtonProps {
  table: string;
  id: string;
}

export default function DeleteButton({ table, id }: DeleteButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this?")) return;

    await supabase.from(table).delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-300 transition-colors"
    >
      Delete
    </button>
  );
}
