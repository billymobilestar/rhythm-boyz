import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/news_article.dart';
import '../../services/supabase_service.dart';
import '../comments/comments_widget.dart';
import '../comments/like_button_widget.dart';

class NewsDetailScreen extends StatefulWidget {
  final String slug;
  const NewsDetailScreen({super.key, required this.slug});

  @override
  State<NewsDetailScreen> createState() => _NewsDetailScreenState();
}

class _NewsDetailScreenState extends State<NewsDetailScreen> {
  NewsArticle? _article;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await supabase
        .from('news')
        .select()
        .eq('slug', widget.slug)
        .eq('published', true)
        .single();

    setState(() {
      _article = NewsArticle.fromJson(data);
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_article == null) {
      return const Scaffold(body: Center(child: Text('Article not found')));
    }

    final article = _article!;

    return Scaffold(
      appBar: AppBar(title: const Text('News')),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (article.coverImageUrl != null)
              AspectRatio(
                aspectRatio: 16 / 9,
                child: CachedNetworkImage(
                  imageUrl: article.coverImageUrl!,
                  fit: BoxFit.cover,
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article.title,
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Text(
                        '${article.createdAt.day}/${article.createdAt.month}/${article.createdAt.year}',
                        style: const TextStyle(color: Color(0xFF8892B0), fontSize: 14),
                      ),
                      const Spacer(),
                      LikeButtonWidget(contentType: 'news', contentId: article.id),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    article.body,
                    style: const TextStyle(fontSize: 16, height: 1.6),
                  ),
                  const SizedBox(height: 32),
                  const Divider(color: Color(0xFF2A2A3E)),
                  const SizedBox(height: 16),
                  CommentsWidget(contentType: 'news', contentId: article.id),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
