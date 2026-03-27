import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../models/comment.dart';
import '../../services/supabase_service.dart';

class CommentsWidget extends StatefulWidget {
  final String contentType;
  final String contentId;
  const CommentsWidget({super.key, required this.contentType, required this.contentId});

  @override
  State<CommentsWidget> createState() => _CommentsWidgetState();
}

class _CommentsWidgetState extends State<CommentsWidget> {
  List<Comment> _comments = [];
  final _controller = TextEditingController();
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _loadComments();
    _subscribeRealtime();
  }

  Future<void> _loadComments() async {
    final data = await supabase
        .from('comments')
        .select('*, profile:profiles(*)')
        .eq('content_type', widget.contentType)
        .eq('content_id', widget.contentId)
        .order('created_at', ascending: false);

    setState(() {
      _comments = (data as List).map((e) => Comment.fromJson(e)).toList();
    });
  }

  void _subscribeRealtime() {
    supabase
        .channel('comments:${widget.contentType}:${widget.contentId}')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'comments',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'content_id',
            value: widget.contentId,
          ),
          callback: (payload) => _loadComments(),
        )
        .subscribe();
  }

  Future<void> _submitComment() async {
    final user = supabase.auth.currentUser;
    if (user == null || _controller.text.trim().isEmpty) return;

    setState(() => _submitting = true);

    await supabase.from('comments').insert({
      'content_type': widget.contentType,
      'content_id': widget.contentId,
      'user_id': user.id,
      'body': _controller.text.trim(),
    });

    _controller.clear();
    setState(() => _submitting = false);
  }

  Future<void> _deleteComment(String id) async {
    await supabase.from('comments').delete().eq('id', id);
    setState(() => _comments.removeWhere((c) => c.id == id));
  }

  @override
  void dispose() {
    _controller.dispose();
    supabase.removeChannel(
      supabase.channel('comments:${widget.contentType}:${widget.contentId}'),
    );
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = supabase.auth.currentUser;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Comments (${_comments.length})', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
        const SizedBox(height: 16),

        if (user != null) ...[
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(hintText: 'Share your thoughts...'),
                  maxLines: null,
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: _submitting ? null : _submitComment,
                icon: _submitting
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                    : Icon(Icons.send, color: Theme.of(context).primaryColor),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ] else
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Text('Log in to comment', style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 14)),
          ),

        ..._comments.map((comment) => Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFF12121A),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF2A2A3E)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 14,
                    backgroundColor: Theme.of(context).primaryColor.withValues(alpha: 0.2),
                    child: Text(
                      (comment.displayName ?? '?')[0].toUpperCase(),
                      style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(comment.displayName ?? 'Anonymous', style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
                  const SizedBox(width: 6),
                  Text(timeago.format(comment.createdAt), style: const TextStyle(color: Color(0xFF8892B0), fontSize: 11)),
                  const Spacer(),
                  if (user?.id == comment.userId)
                    GestureDetector(
                      onTap: () => _deleteComment(comment.id),
                      child: const Text('Delete', style: TextStyle(color: Color(0xFF8892B0), fontSize: 11)),
                    ),
                ],
              ),
              const SizedBox(height: 6),
              Text(comment.body, style: const TextStyle(fontSize: 14)),
            ],
          ),
        )),

        if (_comments.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Text('No comments yet. Be the first!', style: TextStyle(color: Color(0xFF8892B0))),
            ),
          ),
      ],
    );
  }
}
