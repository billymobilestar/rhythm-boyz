import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/database";

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">News</h1>
      <p className="text-muted mb-8">Latest updates from Rhythm Boyz Entertainment.</p>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(articles as NewsArticle[]).map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              {article.cover_image_url && (
                <div className="aspect-video bg-secondary overflow-hidden">
                  <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted line-clamp-3">
                  {article.body.substring(0, 150)}...
                </p>
                <time className="mt-3 block text-xs text-muted">
                  {new Date(article.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">No news articles yet.</p>
          <p className="text-sm mt-2">Check back soon for the latest updates.</p>
        </div>
      )}
    </div>
  );
}
