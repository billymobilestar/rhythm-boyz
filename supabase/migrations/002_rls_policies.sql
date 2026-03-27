-- ============================================
-- RBZ Studios - Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE trailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exclusive_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES
-- ============================================
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- NEWS
-- ============================================
CREATE POLICY "Published news is viewable by everyone"
  ON news FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all news"
  ON news FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRAILERS
-- ============================================
CREATE POLICY "Published trailers are viewable by everyone"
  ON trailers FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all trailers"
  ON trailers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- EXCLUSIVE CONTENT
-- ============================================
CREATE POLICY "Non-gated published content is public"
  ON exclusive_content FOR SELECT USING (
    published = true AND is_gated = false
  );

CREATE POLICY "Gated published content for authenticated users"
  ON exclusive_content FOR SELECT USING (
    published = true AND is_gated = true AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Admins can manage all exclusive content"
  ON exclusive_content FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COMMENTS
-- ============================================
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments"
  ON comments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- LIKES
-- ============================================
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like"
  ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike (delete own likes)"
  ON likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FEEDBACK
-- ============================================
CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all feedback"
  ON feedback FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
