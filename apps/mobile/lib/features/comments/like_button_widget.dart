import 'package:flutter/material.dart';
import '../../services/supabase_service.dart';

class LikeButtonWidget extends StatefulWidget {
  final String contentType;
  final String contentId;
  const LikeButtonWidget({super.key, required this.contentType, required this.contentId});

  @override
  State<LikeButtonWidget> createState() => _LikeButtonWidgetState();
}

class _LikeButtonWidgetState extends State<LikeButtonWidget> {
  bool _liked = false;
  int _count = 0;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _fetchLikes();
  }

  Future<void> _fetchLikes() async {
    final countResponse = await supabase
        .from('likes')
        .select()
        .eq('content_type', widget.contentType)
        .eq('content_id', widget.contentId)
        .count();

    setState(() => _count = countResponse.count);

    final user = supabase.auth.currentUser;
    if (user != null) {
      final data = await supabase
          .from('likes')
          .select('id')
          .eq('content_type', widget.contentType)
          .eq('content_id', widget.contentId)
          .eq('user_id', user.id)
          .maybeSingle();

      setState(() => _liked = data != null);
    }
  }

  Future<void> _toggleLike() async {
    final user = supabase.auth.currentUser;
    if (user == null) return;

    setState(() => _loading = true);

    if (_liked) {
      await supabase
          .from('likes')
          .delete()
          .eq('content_type', widget.contentType)
          .eq('content_id', widget.contentId)
          .eq('user_id', user.id);

      setState(() { _liked = false; _count--; });
    } else {
      await supabase.from('likes').insert({
        'content_type': widget.contentType,
        'content_id': widget.contentId,
        'user_id': user.id,
      });

      setState(() { _liked = true; _count++; });
    }

    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _loading ? null : _toggleLike,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: _liked
              ? Theme.of(context).primaryColor.withValues(alpha: 0.2)
              : const Color(0xFF12121A),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: _liked ? Theme.of(context).primaryColor.withValues(alpha: 0.5) : const Color(0xFF2A2A3E),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              _liked ? Icons.favorite : Icons.favorite_border,
              size: 18,
              color: _liked ? Theme.of(context).primaryColor : const Color(0xFF8892B0),
            ),
            const SizedBox(width: 4),
            Text(
              '$_count',
              style: TextStyle(
                color: _liked ? Theme.of(context).primaryColor : const Color(0xFF8892B0),
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
