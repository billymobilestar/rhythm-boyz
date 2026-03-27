import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Trailer } from "@/types/database";

export default async function TrailersPage() {
  const supabase = await createClient();

  const { data: trailers } = await supabase
    .from("trailers")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">Trailers</h1>
      <p className="text-muted mb-8">Watch the latest trailers from RBZ Studios.</p>

      {trailers && trailers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(trailers as Trailer[]).map((trailer) => (
            <Link
              key={trailer.id}
              href={`/trailers/${trailer.id}`}
              className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
            >
              <div className="aspect-video bg-secondary overflow-hidden relative">
                {trailer.thumbnail_url && (
                  <img
                    src={trailer.thumbnail_url}
                    alt={trailer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {trailer.title}
                </h3>
                {trailer.movie_name && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {trailer.movie_name}
                  </span>
                )}
                {trailer.description && (
                  <p className="mt-2 text-sm text-muted line-clamp-2">{trailer.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">No trailers available yet.</p>
          <p className="text-sm mt-2">Stay tuned for upcoming releases.</p>
        </div>
      )}
    </div>
  );
}
