class ExclusiveContent {
  final String id;
  final String title;
  final String? description;
  final String contentType;
  final String? body;
  final String? mediaUrl;
  final bool isGated;
  final bool published;
  final DateTime createdAt;

  ExclusiveContent({
    required this.id,
    required this.title,
    this.description,
    required this.contentType,
    this.body,
    this.mediaUrl,
    required this.isGated,
    required this.published,
    required this.createdAt,
  });

  factory ExclusiveContent.fromJson(Map<String, dynamic> json) {
    return ExclusiveContent(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      contentType: json['content_type'],
      body: json['body'],
      mediaUrl: json['media_url'],
      isGated: json['is_gated'] ?? true,
      published: json['published'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
