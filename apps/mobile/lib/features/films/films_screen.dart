import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../models/film.dart';
import '../../services/supabase_service.dart';

class FilmsScreen extends StatefulWidget {
  const FilmsScreen({super.key});

  @override
  State<FilmsScreen> createState() => _FilmsScreenState();
}

class _FilmsScreenState extends State<FilmsScreen> {
  List<Film> _films = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await supabase
          .from('films')
          .select()
          .eq('published', true)
          .order('year', ascending: false);

      setState(() {
        _films = (data as List).map((e) => Film.fromJson(e)).toList();
        _loading = false;
        _error = null;
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Films')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.cloud_off, size: 64, color: Color(0xFF2A2A3E)),
                      const SizedBox(height: 16),
                      const Text('Could not load films', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(onPressed: _load, icon: const Icon(Icons.refresh), label: const Text('Retry')),
                    ],
                  ),
                )
              : _films.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.movie_outlined, size: 64, color: Color(0xFF2A2A3E)),
                          const SizedBox(height: 16),
                          const Text('No Films Yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 16),
                          OutlinedButton.icon(onPressed: _load, icon: const Icon(Icons.refresh), label: const Text('Refresh')),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: GridView.builder(
                        padding: const EdgeInsets.all(12),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.55,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        itemCount: _films.length,
                        itemBuilder: (context, index) {
                          final film = _films[index];
                          return GestureDetector(
                            onTap: () => context.push('/films/${film.id}'),
                            child: Card(
                              clipBehavior: Clip.antiAlias,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: film.posterUrl != null
                                        ? CachedNetworkImage(
                                            imageUrl: film.posterUrl!,
                                            fit: BoxFit.cover,
                                            width: double.infinity,
                                            placeholder: (context, url) => Container(color: const Color(0xFF1A1A2E)),
                                            errorWidget: (context, url, error) => _posterPlaceholder(film.title),
                                          )
                                        : _posterPlaceholder(film.title),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(10),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          film.title,
                                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 2),
                                        Row(
                                          children: [
                                            Text('${film.year}', style: const TextStyle(color: Color(0xFF8892B0), fontSize: 12)),
                                            if (film.genre != null) ...[
                                              const SizedBox(width: 6),
                                              Expanded(
                                                child: Text(
                                                  film.genre!,
                                                  style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 11),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }

  Widget _posterPlaceholder(String title) {
    return Container(
      color: const Color(0xFF1A1A2E),
      width: double.infinity,
      child: Center(
        child: Text(
          title,
          style: TextStyle(color: Theme.of(context).primaryColor.withValues(alpha: 0.3), fontSize: 18, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
