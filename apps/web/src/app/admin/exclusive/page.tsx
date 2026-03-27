import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ExclusiveContent } from "@/types/database";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminExclusivePage() {
  const supabase = await createClient();

  const { data: content } = await supabase
    .from("exclusive_content")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Exclusive Content</h1>
          <p className="text-muted text-sm mt-1">Manage exclusive content</p>
        </div>
        <Link
          href="/admin/exclusive/new"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          + New Content
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Type</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Access</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(content as ExclusiveContent[] | null)?.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-card-hover transition-colors">
                <td className="px-4 py-3 text-sm font-medium max-w-[200px] truncate">{item.title}</td>
                <td className="px-4 py-3 text-sm text-muted capitalize hidden md:table-cell">{item.content_type}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.is_gated ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"}`}>
                    {item.is_gated ? "Members Only" : "Public"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {item.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/exclusive/${item.id}`} className="text-xs text-muted hover:text-foreground transition-colors">
                      Edit
                    </Link>
                    <DeleteButton table="exclusive_content" id={item.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(!content || content.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted text-sm">
                  No exclusive content yet. Create your first piece!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
