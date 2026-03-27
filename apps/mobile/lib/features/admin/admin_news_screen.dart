import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../models/news_article.dart';
import '../../services/supabase_service.dart';

class AdminNewsScreen extends StatefulWidget {
  const AdminNewsScreen({super.key});

  @override
  State<AdminNewsScreen> createState() => _AdminNewsScreenState();
}

class _AdminNewsScreenState extends State<AdminNewsScreen> {
  List<NewsArticle> _articles = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await supabase.from('news').select().order('created_at', ascending: false);
    setState(() {
      _articles = (data as List).map((e) => NewsArticle.fromJson(e)).toList();
      _loading = false;
    });
  }

  Future<void> _delete(String id) async {
    await supabase.from('news').delete().eq('id', id);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Manage News')),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await context.push('/admin/news/form');
          _load();
        },
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _articles.isEmpty
              ? const Center(child: Text('No articles', style: TextStyle(color: Color(0xFF8892B0))))
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: _articles.length,
                  itemBuilder: (context, index) {
                    final a = _articles[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        title: Text(a.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                        subtitle: Text(a.published ? 'Published' : 'Draft', style: TextStyle(fontSize: 12, color: a.published ? const Color(0xFF10B981) : const Color(0xFFF59E0B))),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, size: 20),
                              onPressed: () async {
                                await context.push('/admin/news/form?id=${a.id}');
                                _load();
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, size: 20, color: Colors.redAccent),
                              onPressed: () async {
                                final confirm = await showDialog<bool>(
                                  context: context,
                                  builder: (c) => AlertDialog(
                                    title: const Text('Delete?'),
                                    content: Text('Delete "${a.title}"?'),
                                    actions: [
                                      TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')),
                                      TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Delete', style: TextStyle(color: Colors.redAccent))),
                                    ],
                                  ),
                                );
                                if (confirm == true) _delete(a.id);
                              },
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
