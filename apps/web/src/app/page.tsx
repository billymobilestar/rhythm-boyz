import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Trailer, NewsArticle, Film } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: trailers }, { data: articles }, { data: films }] = await Promise.all([
    supabase
      .from("trailers")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("films")
      .select("*")
      .eq("published", true)
      .order("year", { ascending: false }),
  ]);

  const featuredTrailer = (trailers as Trailer[] | null)?.[0];
  const otherTrailers = (trailers as Trailer[] | null)?.slice(1) ?? [];

  function getEmbedUrl(url: string): string {
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  }

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-secondary via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_60%)] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-widest text-sm mb-4">EST. 2013</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              Rhythm Boyz
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed">
              Punjabi cinema & music label by Amrinder Gill & Karaj Gill.
              <br className="hidden md:block" />
              Creating stories that move the world.
            </p>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link
                href="#trailers"
                className="px-8 py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors text-lg"
              >
                Watch Trailers
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3.5 border border-border text-foreground rounded-lg font-medium hover:border-primary hover:text-primary transition-colors text-lg"
              >
                Fan Portal
              </Link>
            </div>
          </div>

          {/* Featured Trailer */}
          {featuredTrailer && (
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
                <iframe
                  src={getEmbedUrl(featuredTrailer.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={featuredTrailer.title}
                />
              </div>
              <p className="text-center mt-4 text-muted text-sm">
                {featuredTrailer.title}
                {featuredTrailer.movie_name && (
                  <span className="text-primary ml-2">| {featuredTrailer.movie_name}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "13+", label: "Years" },
              { value: "20+", label: "Films Produced" },
              { value: "3M+", label: "YouTube Subscribers" },
              { value: "100M+", label: "Views" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-medium tracking-widest text-sm mb-3">OUR STORY</p>
            <h2 className="text-4xl font-bold mb-6">About Rhythm Boyz</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Rhythm Boyz Entertainment was founded on March 19, 2013 by actor and singer
                Amrinder Gill and Karaj Gill. Named after a college-time Bhangra group formed
                by the founders, the company has grown into a powerhouse of Punjabi cinema.
              </p>
              <p>
                From the critically acclaimed <span className="text-foreground font-medium">Angrej (2015)</span> to
                the beloved <span className="text-foreground font-medium">Chal Mera Putt</span> series, Rhythm Boyz
                is known for producing meaningful, family-oriented entertainment that resonates
                with audiences worldwide.
              </p>
              <p>
                As both a film production house and music label, we produce, release, and distribute
                music for artists including Amrinder Gill, Dr Zeus, and Gurshabad.
              </p>
            </div>
            <Link
              href="#films"
              className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              View Our Films
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">2013</p>
              <p className="text-sm text-muted">Founded</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">Amritsar</p>
              <p className="text-sm text-muted">Headquarters</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center col-span-2">
              <p className="text-lg font-semibold mb-2">Founders</p>
              <p className="text-muted text-sm">Amrinder Gill & Karaj Gill</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILMOGRAPHY HIGHLIGHTS ===== */}
      <section id="films" className="bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-widest text-sm mb-3">FILMOGRAPHY</p>
            <h2 className="text-4xl font-bold">Our Films</h2>
          </div>

          {films && films.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(films as Film[]).map((film) => (
                <div
                  key={film.id}
                  className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all group"
                >
                  <div className="aspect-2/3 rounded-lg bg-secondary mb-3 flex items-center justify-center overflow-hidden">
                    {film.poster_url ? (
                      <img src={film.poster_url} alt={film.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-2xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors text-center px-2">
                        {film.title}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">{film.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted">{film.year}</p>
                    {film.genre && <p className="text-xs text-primary">{film.genre}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Films coming soon.</p>
          )}

          <div className="text-center mt-8">
            <a
              href="https://letterboxd.com/studio/rhythm-boyz-entertainment/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View full filmography on Letterboxd &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ===== TRAILERS ===== */}
      <section id="trailers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-widest text-sm mb-3">WATCH</p>
          <h2 className="text-4xl font-bold">Latest Trailers</h2>
        </div>

        {otherTrailers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherTrailers.map((trailer) => (
              <Link
                key={trailer.id}
                href={`/trailers/${trailer.id}`}
                className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
              >
                <div className="aspect-video bg-secondary overflow-hidden relative">
                  {trailer.thumbnail_url ? (
                    <img
                      src={trailer.thumbnail_url}
                      alt={trailer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{trailer.title}</h3>
                  {trailer.movie_name && (
                    <span className="text-xs text-primary mt-1 block">{trailer.movie_name}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Trailers coming soon.</p>
        )}

        <div className="text-center mt-8">
          <Link href="/trailers" className="text-primary hover:underline text-sm">
            View all trailers &rarr;
          </Link>
        </div>
      </section>

      {/* ===== LATEST NEWS ===== */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-widest text-sm mb-3">NEWS</p>
            <h2 className="text-4xl font-bold">Latest Updates</h2>
          </div>

          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(articles as NewsArticle[]).map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
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
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted line-clamp-2">
                      {article.body.substring(0, 120)}...
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
            <p className="text-center text-muted">News coming soon.</p>
          )}
        </div>
      </section>

      {/* ===== FAN PORTAL CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Rhythm Boyz Community</h2>
          <p className="text-muted max-w-xl mx-auto mb-8">
            Get access to exclusive behind-the-scenes content, early ticket sales,
            fan meetups, and more. Available on iOS, Android, and web.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/signup"
              className="px-8 py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3.5 border border-border text-foreground rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CONNECT ===== */}
      <section className="border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-primary font-medium tracking-widest text-sm mb-3">FOLLOW US</p>
          <h2 className="text-3xl font-bold mb-8">Stay Connected</h2>
          <div className="flex gap-6 justify-center">
            <a
              href="https://www.youtube.com/@RhythmBoyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="text-sm font-medium">YouTube</span>
            </a>
            <a
              href="https://www.instagram.com/rhythmboyzentertainment/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              <span className="text-sm font-medium">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/Rhythmboyzofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium">Facebook</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
