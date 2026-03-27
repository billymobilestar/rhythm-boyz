-- ============================================
-- RBZ Studios - Films Table
-- ============================================

CREATE TABLE films (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT,
  synopsis TEXT,
  poster_url TEXT,
  trailer_id UUID REFERENCES trailers(id) ON DELETE SET NULL,
  cast_list TEXT,
  director TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_films_published ON films(published, year DESC);

-- RLS
ALTER TABLE films ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published films are viewable by everyone"
  ON films FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all films"
  ON films FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
