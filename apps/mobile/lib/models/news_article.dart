class NewsArticle {
  final String id;
  final String title;
  final String slug;
  final String body;
  final String? coverImageUrl;
  final bool published;
  final String? authorId;
  final DateTime createdAt;

  NewsArticle({
    required this.id,
    required this.title,
    required this.slug,
    required this.body,
    this.coverImageUrl,
    required this.published,
    this.authorId,
    required this.createdAt,
  });

  factory NewsArticle.fromJson(Map<String, dynamic> json) {
    return NewsArticle(
      id: json['id'],
      title: json['title'],
      slug: json['slug'],
      body: json['body'],
      coverImageUrl: json['cover_image_url'],
      published: json['published'] ?? false,
      authorId: json['author_id'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
