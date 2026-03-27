import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../models/exclusive_content.dart';
import '../../services/supabase_service.dart';

class ExclusiveScreen extends StatefulWidget {
  const ExclusiveScreen({super.key});

  @override
  State<ExclusiveScreen> createState() => _ExclusiveScreenState();
}

class _ExclusiveScreenState extends State<ExclusiveScreen> {
  List<ExclusiveContent> _content = [];
  bool _loading = true;
  bool _isLoggedIn = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final user = supabase.auth.currentUser;
      final data = await supabase
          .from('exclusive_content')
          .select()
          .eq('published', true)
          .order('created_at', ascending: false);

      setState(() {
        _content = (data as List).map((e) => ExclusiveContent.fromJson(e)).toList();
        _isLoggedIn = user != null;
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

  IconData _typeIcon(String type) {
    switch (type) {
      case 'video':
        return Icons.videocam;
      case 'gallery':
        return Icons.photo_library;
      default:
        return Icons.article;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Exclusive Content')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.cloud_off, size: 64, color: Color(0xFF2A2A3E)),
                        const SizedBox(height: 16),
                        const Text('Connection Error', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(onPressed: _load, icon: const Icon(Icons.refresh), label: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _content.isEmpty
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.star_outline, size: 64, color: Color(0xFF2A2A3E)),
                            const SizedBox(height: 16),
                            const Text('No Exclusive Content Yet', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
                            const SizedBox(height: 8),
                            const Text('Check back for behind-the-scenes access.', style: TextStyle(color: Color(0xFF8892B0))),
                            const SizedBox(height: 24),
                            OutlinedButton.icon(onPressed: _load, icon: const Icon(Icons.refresh), label: const Text('Refresh')),
                          ],
                        ),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _content.length,
                        itemBuilder: (context, index) {
                          final item = _content[index];
                          final isLocked = item.isGated && !_isLoggedIn;

                          return GestureDetector(
                            onTap: () {
                              if (isLocked) {
                                context.push('/login');
                              } else {
                                context.push('/exclusive/${item.id}');
                              }
                            },
                            child: Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Icon(_typeIcon(item.contentType), color: Theme.of(context).primaryColor),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(item.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                                          if (item.description != null) ...[
                                            const SizedBox(height: 4),
                                            Text(
                                              item.description!,
                                              style: const TextStyle(color: Color(0xFF8892B0), fontSize: 13),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                    if (isLocked)
                                      const Icon(Icons.lock, color: Color(0xFFF59E0B), size: 20),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
