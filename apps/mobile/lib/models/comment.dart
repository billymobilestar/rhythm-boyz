class Comment {
  final String id;
  final String userId;
  final String contentType;
  final String contentId;
  final String body;
  final DateTime createdAt;
  final String? displayName;

  Comment({
    required this.id,
    required this.userId,
    required this.contentType,
    required this.contentId,
    required this.body,
    required this.createdAt,
    this.displayName,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    final profile = json['profile'] as Map<String, dynamic>?;
    return Comment(
      id: json['id'],
      userId: json['user_id'],
      contentType: json['content_type'],
      contentId: json['content_id'],
      body: json['body'],
      createdAt: DateTime.parse(json['created_at']),
      displayName: profile?['display_name'],
    );
  }
}
