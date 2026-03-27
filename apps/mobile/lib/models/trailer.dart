class Trailer {
  final String id;
  final String title;
  final String? description;
  final String videoUrl;
  final String? thumbnailUrl;
  final String? movieName;
  final bool published;
  final DateTime createdAt;

  Trailer({
    required this.id,
    required this.title,
    this.description,
    required this.videoUrl,
    this.thumbnailUrl,
    this.movieName,
    required this.published,
    required this.createdAt,
  });

  factory Trailer.fromJson(Map<String, dynamic> json) {
    return Trailer(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      videoUrl: json['video_url'],
      thumbnailUrl: json['thumbnail_url'],
      movieName: json['movie_name'],
      published: json['published'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
