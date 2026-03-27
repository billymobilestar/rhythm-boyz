-- ============================================
-- RBZ Studios - Storage Buckets
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);

-- Allow authenticated users to upload
CREATE POLICY "Admins can upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('thumbnails', 'covers')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow public read
CREATE POLICY "Public can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id IN ('thumbnails', 'covers'));

-- Allow admins to delete
CREATE POLICY "Admins can delete thumbnails" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('thumbnails', 'covers')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
