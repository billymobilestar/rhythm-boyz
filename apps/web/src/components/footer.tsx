import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-bold text-primary">Rhythm Boyz</span>
            <span className="text-sm text-muted ml-1">Entertainment</span>
            <p className="mt-2 text-sm text-muted">
              Punjabi film production & music label. Creating stories that move the world since 2013.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/#about" className="block text-sm text-muted hover:text-foreground transition-colors">About</Link>
              <Link href="/#films" className="block text-sm text-muted hover:text-foreground transition-colors">Films</Link>
              <Link href="/trailers" className="block text-sm text-muted hover:text-foreground transition-colors">Trailers</Link>
              <Link href="/exclusive" className="block text-sm text-muted hover:text-foreground transition-colors">Exclusive Content</Link>
              <Link href="/feedback" className="block text-sm text-muted hover:text-foreground transition-colors">Feedback</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Connect</h3>
            <div className="space-y-2">
              <a href="https://www.youtube.com/@RhythmBoyz" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted hover:text-red-400 transition-colors">YouTube</a>
              <a href="https://www.instagram.com/rhythmboyzentertainment/" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted hover:text-pink-400 transition-colors">Instagram</a>
              <a href="https://www.facebook.com/Rhythmboyzofficial/" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted hover:text-blue-400 transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Rhythm Boyz Entertainment INC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
