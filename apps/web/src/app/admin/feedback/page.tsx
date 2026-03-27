"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Feedback } from "@/types/database";

const statusColors: Record<string, string> = {
  open: "bg-yellow-500/10 text-yellow-400",
  reviewed: "bg-blue-500/10 text-blue-400",
  resolved: "bg-green-500/10 text-green-400",
};

const categoryLabels: Record<string, string> = {
  general: "General",
  feature_request: "Feature Request",
  bug: "Bug Report",
};

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadFeedback();
  }, [filter]);

  async function loadFeedback() {
    setLoading(true);
    let query = supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setFeedback((data as Feedback[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("feedback").update({ status }).eq("id", id);
    setFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: status as Feedback["status"] } : f))
    );
  }

  async function deleteFeedback(id: string) {
    if (!confirm("Delete this feedback?")) return;
    await supabase.from("feedback").delete().eq("id", id);
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="text-muted text-sm mt-1">Review user feedback and feature requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "open", "reviewed", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-12 text-muted">
          No feedback found{filter !== "all" ? ` with status "${filter}"` : ""}.
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold">{item.subject}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-muted">
                      {categoryLabels[item.category] ?? item.category}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{item.body}</p>
                  <p className="text-xs text-muted mt-3">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  {item.status !== "reviewed" && (
                    <button
                      onClick={() => updateStatus(item.id, "reviewed")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {item.status !== "resolved" && (
                    <button
                      onClick={() => updateStatus(item.id, "resolved")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => deleteFeedback(item.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
