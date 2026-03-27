import 'package:flutter/material.dart';
import '../../models/exclusive_content.dart';
import '../../services/supabase_service.dart';
import '../comments/comments_widget.dart';
import '../comments/like_button_widget.dart';

class ExclusiveDetailScreen extends StatefulWidget {
  final String id;
  const ExclusiveDetailScreen({super.key, required this.id});

  @override
  State<ExclusiveDetailScreen> createState() => _ExclusiveDetailScreenState();
}

class _ExclusiveDetailScreenState extends State<ExclusiveDetailScreen> {
  ExclusiveContent? _content;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await supabase
        .from('exclusive_content')
        .select()
        .eq('id', widget.id)
        .eq('published', true)
        .single();

    setState(() {
      _content = ExclusiveContent.fromJson(data);
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final content = _content!;

    return Scaffold(
      appBar: AppBar(title: const Text('Exclusive')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF16213E),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(content.contentType, style: const TextStyle(color: Color(0xFF8892B0), fontSize: 12)),
                ),
                if (content.isGated) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text('Exclusive', style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 12)),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 16),
            Text(content.title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(
              children: [
                Text(
                  '${content.createdAt.day}/${content.createdAt.month}/${content.createdAt.year}',
                  style: const TextStyle(color: Color(0xFF8892B0), fontSize: 14),
                ),
                const Spacer(),
                LikeButtonWidget(contentType: 'exclusive', contentId: content.id),
              ],
            ),
            if (content.description != null) ...[
              const SizedBox(height: 16),
              Text(content.description!, style: const TextStyle(color: Color(0xFF8892B0), fontSize: 16)),
            ],
            if (content.body != null) ...[
              const SizedBox(height: 20),
              Text(content.body!, style: const TextStyle(fontSize: 16, height: 1.6)),
            ],
            const SizedBox(height: 32),
            const Divider(color: Color(0xFF2A2A3E)),
            const SizedBox(height: 16),
            CommentsWidget(contentType: 'exclusive', contentId: content.id),
          ],
        ),
      ),
    );
  }
}
