"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const categories = [
  { value: "general", label: "General Feedback" },
  { value: "feature_request", label: "Feature Request" },
  { value: "bug", label: "Bug Report" },
] as const;

export default function FeedbackPage() {
  const [category, setCategory] = useState<string>("general");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error: submitError } = await supabase.from("feedback").insert({
      category,
      subject,
      body,
      user_id: user?.id ?? null,
    });

    if (submitError) {
      setError(submitError.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank you!</h1>
        <p className="text-muted mb-6">Your feedback has been submitted. We appreciate your input!</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setSubject("");
            setBody("");
            setCategory("general");
          }}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">Feedback</h1>
      <p className="text-muted mb-8">
        We&apos;d love to hear from you. Share your thoughts, report issues, or request new features.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-muted mb-2">Category</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat.value
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-muted mb-1">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground placeholder-muted"
            placeholder="Brief summary"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-muted mb-1">
            Details
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none resize-none text-foreground placeholder-muted"
            placeholder="Tell us more..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
