import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Film } from "@/types/database";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminFilmsPage() {
  const supabase = await createClient();

  const { data: films } = await supabase
    .from("films")
    .select("*")
    .order("year", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Films</h1>
          <p className="text-muted text-sm mt-1">Manage filmography</p>
        </div>
        <Link
          href="/admin/films/new"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          + New Film
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {(films as Film[] | null)?.map((film) => (
          <div key={film.id} className="bg-card rounded-xl border border-border overflow-hidden group relative">
            <div className="aspect-2/3 bg-secondary overflow-hidden">
              {film.poster_url ? (
                <img src={film.poster_url} alt={film.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary/30 text-center px-2">{film.title}</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{film.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted">{film.year}</p>
                <div className="flex gap-1">
                  {film.published ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400">Live</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">Draft</span>
                  )}
                  {film.featured && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Link href={`/admin/films/${film.id}`} className="text-xs text-muted hover:text-foreground transition-colors">
                  Edit
                </Link>
                <DeleteButton table="films" id={film.id} />
              </div>
            </div>
          </div>
        ))}

        {(!films || films.length === 0) && (
          <div className="col-span-full text-center py-12 text-muted text-sm">
            No films yet. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}
