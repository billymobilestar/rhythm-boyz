import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/database";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminNewsPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">News</h1>
          <p className="text-muted text-sm mt-1">Manage news articles</p>
        </div>
        <Link
          href="/admin/news/new"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(articles as NewsArticle[] | null)?.map((article) => (
              <tr key={article.id} className="border-b border-border last:border-0 hover:bg-card-hover transition-colors">
                <td className="px-4 py-3 text-sm font-medium max-w-[200px] truncate">{article.title}</td>
                <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">{article.slug}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${article.published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted hidden sm:table-cell">
                  {new Date(article.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/news/${article.id}`} className="text-xs text-muted hover:text-foreground transition-colors">
                      Edit
                    </Link>
                    <DeleteButton table="news" id={article.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted text-sm">
                  No articles yet. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
