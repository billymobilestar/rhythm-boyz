import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: filmsCount },
    { count: newsCount },
    { count: trailersCount },
    { count: exclusiveCount },
    { count: feedbackCount },
    { count: usersCount },
    { count: commentsCount },
  ] = await Promise.all([
    supabase.from("films").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("trailers").select("*", { count: "exact", head: true }),
    supabase.from("exclusive_content").select("*", { count: "exact", head: true }),
    supabase.from("feedback").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Films", count: filmsCount ?? 0, href: "/admin/films", color: "bg-purple-500/10 text-purple-400" },
    { label: "News Articles", count: newsCount ?? 0, href: "/admin/news", color: "bg-blue-500/10 text-blue-400" },
    { label: "Trailers", count: trailersCount ?? 0, href: "/admin/trailers", color: "bg-purple-500/10 text-purple-400" },
    { label: "Exclusive Content", count: exclusiveCount ?? 0, href: "/admin/exclusive", color: "bg-yellow-500/10 text-yellow-400" },
    { label: "Open Feedback", count: feedbackCount ?? 0, href: "/admin/feedback", color: "bg-primary/10 text-primary" },
    { label: "Total Users", count: usersCount ?? 0, href: "#", color: "bg-green-500/10 text-green-400" },
    { label: "Total Comments", count: commentsCount ?? 0, href: "#", color: "bg-cyan-500/10 text-cyan-400" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted mb-8">Welcome to the RBZ Studios Control Centre.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="block bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.count}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
