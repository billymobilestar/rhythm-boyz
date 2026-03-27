import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/film.dart';
import '../../services/supabase_service.dart';

class FilmDetailScreen extends StatefulWidget {
  final String id;
  const FilmDetailScreen({super.key, required this.id});

  @override
  State<FilmDetailScreen> createState() => _FilmDetailScreenState();
}

class _FilmDetailScreenState extends State<FilmDetailScreen> {
  Film? _film;
  String? _trailerUrl;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await supabase
        .from('films')
        .select()
        .eq('id', widget.id)
        .eq('published', true)
        .single();

    final film = Film.fromJson(data);

    // Try to find trailer
    String? trailerUrl;
    if (film.trailerId != null) {
      final t = await supabase
          .from('trailers')
          .select('video_url')
          .eq('id', film.trailerId!)
          .maybeSingle();
      trailerUrl = t?['video_url'];
    }

    if (trailerUrl == null) {
      final t = await supabase
          .from('trailers')
          .select('video_url')
          .ilike('movie_name', film.title)
          .eq('published', true)
          .limit(1)
          .maybeSingle();
      trailerUrl = t?['video_url'];
    }

    setState(() {
      _film = film;
      _trailerUrl = trailerUrl;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final film = _film!;
    final castMembers = film.castList?.split(',').map((c) => c.trim()).where((c) => c.isNotEmpty).toList() ?? [];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Poster as app bar
          SliverAppBar(
            expandedHeight: 400,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: film.posterUrl != null
                  ? CachedNetworkImage(
                      imageUrl: film.posterUrl!,
                      fit: BoxFit.cover,
                      color: Colors.black.withValues(alpha: 0.3),
                      colorBlendMode: BlendMode.darken,
                    )
                  : Container(
                      color: const Color(0xFF1A1A2E),
                      child: Center(
                        child: Text(
                          film.title,
                          style: TextStyle(
                            color: Theme.of(context).primaryColor.withValues(alpha: 0.3),
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title & Year
                  Text(film.title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text('${film.year}', style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 16, fontWeight: FontWeight.w600)),
                      if (film.genre != null) ...[
                        const SizedBox(width: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF16213E),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(film.genre!, style: const TextStyle(color: Color(0xFF8892B0), fontSize: 12)),
                        ),
                      ],
                    ],
                  ),

                  // Director
                  if (film.director != null) ...[
                    const SizedBox(height: 20),
                    const Text('Directed by', style: TextStyle(color: Color(0xFF8892B0), fontSize: 13)),
                    const SizedBox(height: 4),
                    Text(film.director!, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w500)),
                  ],

                  // Synopsis
                  if (film.synopsis != null) ...[
                    const SizedBox(height: 20),
                    const Text('Synopsis', style: TextStyle(color: Color(0xFF8892B0), fontSize: 13)),
                    const SizedBox(height: 6),
                    Text(film.synopsis!, style: const TextStyle(fontSize: 15, height: 1.6)),
                  ],

                  // Cast
                  if (castMembers.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    const Text('Cast', style: TextStyle(color: Color(0xFF8892B0), fontSize: 13)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: castMembers.map((name) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF12121A),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFF2A2A3E)),
                        ),
                        child: Text(name, style: const TextStyle(fontSize: 13)),
                      )).toList(),
                    ),
                  ],

                  // Watch Trailer button
                  if (_trailerUrl != null) ...[
                    const SizedBox(height: 28),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => launchUrl(Uri.parse(_trailerUrl!), mode: LaunchMode.externalApplication),
                        icon: const Icon(Icons.play_arrow),
                        label: const Text('Watch Trailer'),
                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                      ),
                    ),
                  ],

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
