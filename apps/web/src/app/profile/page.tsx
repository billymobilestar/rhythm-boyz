"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const p = data as Profile;
        setProfile(p);
        setDisplayName(p.display_name ?? "");
      }
      setLoading(false);
    }

    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted">
        Loading...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>

      <div className="bg-card rounded-xl border border-border p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
            {(profile.display_name ?? "?")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">{profile.display_name}</p>
            <p className="text-sm text-muted capitalize">{profile.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-muted mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="text-sm text-success">Saved!</span>
            )}
          </div>
        </form>
      </div>

      <div className="mt-6 bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-2">Account Info</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted">Member since: </span>
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            <span className="text-muted">Role: </span>
            <span className="capitalize">{profile.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
