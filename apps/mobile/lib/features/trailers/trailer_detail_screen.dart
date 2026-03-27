import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/trailer.dart';
import '../../services/supabase_service.dart';
import '../comments/comments_widget.dart';
import '../comments/like_button_widget.dart';

class TrailerDetailScreen extends StatefulWidget {
  final String id;
  const TrailerDetailScreen({super.key, required this.id});

  @override
  State<TrailerDetailScreen> createState() => _TrailerDetailScreenState();
}

class _TrailerDetailScreenState extends State<TrailerDetailScreen> {
  Trailer? _trailer;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await supabase
        .from('trailers')
        .select()
        .eq('id', widget.id)
        .eq('published', true)
        .single();

    setState(() {
      _trailer = Trailer.fromJson(data);
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final trailer = _trailer!;

    return Scaffold(
      appBar: AppBar(title: const Text('Trailer')),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Video thumbnail with play button
            GestureDetector(
              onTap: () => launchUrl(Uri.parse(trailer.videoUrl), mode: LaunchMode.externalApplication),
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (trailer.thumbnailUrl != null)
                      Image.network(trailer.thumbnailUrl!, fit: BoxFit.cover)
                    else
                      Container(color: const Color(0xFF1A1A2E)),
                    Container(color: Colors.black.withValues(alpha: 0.3)),
                    Center(
                      child: Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: Theme.of(context).primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.play_arrow, color: Colors.white, size: 40),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(trailer.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      if (trailer.movieName != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(trailer.movieName!, style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 13)),
                        ),
                      const Spacer(),
                      LikeButtonWidget(contentType: 'trailer', contentId: trailer.id),
                    ],
                  ),
                  if (trailer.description != null) ...[
                    const SizedBox(height: 16),
                    Text(trailer.description!, style: const TextStyle(fontSize: 15, height: 1.5)),
                  ],
                  const SizedBox(height: 32),
                  const Divider(color: Color(0xFF2A2A3E)),
                  const SizedBox(height: 16),
                  CommentsWidget(contentType: 'trailer', contentId: trailer.id),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
