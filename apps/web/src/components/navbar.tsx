"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/films", label: "Films" },
  { href: "/news", label: "News" },
  { href: "/trailers", label: "Trailers" },
  { href: "/exclusive", label: "Exclusive" },
  { href: "/feedback", label: "Feedback" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }

  const allLinks = isAdmin
    ? [...navLinks, { href: "/admin", label: "Admin" }]
    : navLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "frosted" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display tracking-widest text-foreground">
              RHYTHM BOYZ
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {allLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span
                    className={
                      isActive ? "text-primary" : "text-muted hover:text-foreground"
                    }
                  >
                    {link.label}
                  </span>
                  {(hoveredLink === link.href || isActive) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-primary transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button — animated hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative p-2 w-10 h-10 rounded-lg text-foreground"
            aria-label="Toggle menu"
          >
            <motion.span
              className="absolute left-2 h-[2px] w-6 bg-current rounded-full"
              animate={
                menuOpen
                  ? { top: "50%", rotate: 45, translateY: "-50%" }
                  : { top: "30%", rotate: 0, translateY: "0%" }
              }
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="absolute left-2 top-1/2 h-[2px] w-6 bg-current rounded-full -translate-y-1/2"
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-2 h-[2px] w-6 bg-current rounded-full"
              animate={
                menuOpen
                  ? { bottom: "50%", rotate: -45, translateY: "50%" }
                  : { bottom: "30%", rotate: 0, translateY: "0%" }
              }
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-1">
                {allLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-muted hover:text-foreground hover:bg-card"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-border">
                  {user ? (
                    <>
                      <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-muted hover:text-foreground">
                        Profile
                      </Link>
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-muted hover:text-foreground">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-muted hover:text-foreground">
                        Log In
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-primary font-medium">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
