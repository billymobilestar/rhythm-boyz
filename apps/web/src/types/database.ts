export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "fan" | "admin" | "moderator";
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  body: string;
  cover_image_url: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Trailer {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  movie_name: string | null;
  published: boolean;
  created_at: string;
}

export interface Film {
  id: string;
  title: string;
  year: number;
  genre: string | null;
  synopsis: string | null;
  poster_url: string | null;
  trailer_id: string | null;
  cast_list: string | null;
  director: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface ExclusiveContent {
  id: string;
  title: string;
  description: string | null;
  content_type: "article" | "video" | "gallery";
  body: string | null;
  media_url: string | null;
  is_gated: boolean;
  published: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  content_type: "news" | "trailer" | "exclusive";
  content_id: string;
  body: string;
  created_at: string;
  profile?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  content_type: "news" | "trailer" | "exclusive" | "comment";
  content_id: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  category: "bug" | "feature_request" | "general";
  subject: string;
  body: string;
  status: "open" | "reviewed" | "resolved";
  created_at: string;
}
