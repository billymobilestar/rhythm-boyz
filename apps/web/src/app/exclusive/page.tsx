import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ExclusiveContent } from "@/types/database";

const typeIcons: Record<string, string> = {
  article: "Article",
  video: "Video",
  gallery: "Gallery",
};

export default async function ExclusivePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: content } = await supabase
    .from("exclusive_content")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">Exclusive Content</h1>
      <p className="text-muted mb-8">Behind-the-scenes access, interviews, and more.</p>

      {content && content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content as ExclusiveContent[]).map((item) => {
            const isLocked = item.is_gated && !user;

            return (
              <div
                key={item.id}
                className="relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
              >
                {isLocked && (
                  <div className="absolute top-3 right-3 z-10 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1C8.676 1 6 3.676 6 7v2H4v14h16V9h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
                    </svg>
                    <span className="text-xs text-warning">Members Only</span>
                  </div>
                )}

                {isLocked ? (
                  <Link href="/auth/login" className="block">
                    <div className="p-6">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent text-muted">
                        {typeIcons[item.content_type]}
                      </span>
                      <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="mt-2 text-sm text-muted line-clamp-2">{item.description}</p>
                      )}
                      <p className="mt-4 text-sm text-primary">Sign in to unlock</p>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/exclusive/${item.id}`} className="block">
                    <div className="p-6">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent text-muted">
                        {typeIcons[item.content_type]}
                      </span>
                      <h3 className="mt-3 text-lg font-semibold hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-2 text-sm text-muted line-clamp-2">{item.description}</p>
                      )}
                      <time className="mt-3 block text-xs text-muted">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">No exclusive content yet.</p>
          <p className="text-sm mt-2">Check back for behind-the-scenes access.</p>
        </div>
      )}
    </div>
  );
}
