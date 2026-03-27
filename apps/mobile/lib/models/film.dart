class Film {
  final String id;
  final String title;
  final int year;
  final String? genre;
  final String? synopsis;
  final String? posterUrl;
  final String? trailerId;
  final String? castList;
  final String? director;
  final bool published;
  final bool featured;
  final DateTime createdAt;

  Film({
    required this.id,
    required this.title,
    required this.year,
    this.genre,
    this.synopsis,
    this.posterUrl,
    this.trailerId,
    this.castList,
    this.director,
    required this.published,
    required this.featured,
    required this.createdAt,
  });

  factory Film.fromJson(Map<String, dynamic> json) {
    return Film(
      id: json['id'],
      title: json['title'],
      year: json['year'],
      genre: json['genre'],
      synopsis: json['synopsis'],
      posterUrl: json['poster_url'],
      trailerId: json['trailer_id'],
      castList: json['cast_list'],
      director: json['director'],
      published: json['published'] ?? false,
      featured: json['featured'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
