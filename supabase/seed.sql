-- ============================================
-- RBZ Studios - Sample Seed Data
-- ============================================

-- Sample News Articles
INSERT INTO news (title, slug, body, cover_image_url, published) VALUES
(
  'RBZ Studios Announces New Blockbuster Film',
  'rbz-announces-new-blockbuster',
  'RBZ Studios is thrilled to announce our latest project — an epic action-adventure film set to release next summer. Stay tuned for casting announcements and behind-the-scenes content.',
  'https://placehold.co/1200x600/1a1a2e/e94560?text=New+Film+Announcement',
  true
),
(
  'Behind the Scenes: The Making of "Eclipse"',
  'behind-the-scenes-eclipse',
  'Take a deep dive into the creative process behind our award-winning film "Eclipse." From concept art to final cut, discover how our team brought this vision to life.',
  'https://placehold.co/1200x600/16213e/0f3460?text=Behind+The+Scenes',
  true
),
(
  'RBZ Studios Celebrates 10 Years',
  'rbz-celebrates-10-years',
  'A decade of storytelling, blockbuster hits, and unforgettable moments. Join us as we look back at the journey that made RBZ Studios what it is today.',
  'https://placehold.co/1200x600/1a1a2e/e94560?text=10+Year+Anniversary',
  true
);

-- Sample Trailers
INSERT INTO trailers (title, description, video_url, thumbnail_url, movie_name, published) VALUES
(
  'Eclipse - Official Trailer',
  'The official trailer for the most anticipated film of the year.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://placehold.co/800x450/0f3460/e94560?text=Eclipse+Trailer',
  'Eclipse',
  true
),
(
  'Nightfall - Teaser Trailer',
  'A first glimpse into the world of Nightfall.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://placehold.co/800x450/1a1a2e/e94560?text=Nightfall+Teaser',
  'Nightfall',
  true
);

-- Sample Exclusive Content
INSERT INTO exclusive_content (title, description, content_type, body, is_gated, published) VALUES
(
  'Director''s Commentary: Eclipse',
  'An exclusive director''s commentary breaking down key scenes from Eclipse.',
  'article',
  'In this exclusive piece, our director shares the inspiration behind the opening sequence of Eclipse and the challenges of filming on location in Iceland...',
  true,
  true
),
(
  'Concept Art Gallery: Nightfall',
  'Explore the stunning concept art that shaped the world of Nightfall.',
  'gallery',
  'Our art department spent over 6 months creating the visual language of Nightfall. Here is a collection of early concept art that defined the film''s aesthetic.',
  false,
  true
);
