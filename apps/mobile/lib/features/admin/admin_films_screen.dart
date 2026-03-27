import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/film.dart';
import '../../services/supabase_service.dart';

class AdminFilmsScreen extends StatefulWidget {
  const AdminFilmsScreen({super.key});

  @override
  State<AdminFilmsScreen> createState() => _AdminFilmsScreenState();
}

class _AdminFilmsScreenState extends State<AdminFilmsScreen> {
  List<Film> _films = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    final data = await supabase.from('films').select().order('year', ascending: false);
    setState(() { _films = (data as List).map((e) => Film.fromJson(e)).toList(); _loading = false; });
  }

  Future<void> _delete(String id) async {
    await supabase.from('films').delete().eq('id', id);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Manage Films')),
      floatingActionButton: FloatingActionButton(
        onPressed: () async { await context.push('/admin/films/form'); _load(); },
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _films.isEmpty
              ? const Center(child: Text('No films', style: TextStyle(color: Color(0xFF8892B0))))
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: _films.length,
                  itemBuilder: (context, index) {
                    final f = _films[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: SizedBox(
                            width: 40,
                            height: 56,
                            child: f.posterUrl != null
                                ? CachedNetworkImage(imageUrl: f.posterUrl!, fit: BoxFit.cover)
                                : Container(color: const Color(0xFF1A1A2E), child: Icon(Icons.movie, color: Theme.of(context).primaryColor.withValues(alpha: 0.3))),
                          ),
                        ),
                        title: Text(f.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                        subtitle: Text('${f.year} • ${f.published ? "Published" : "Draft"}', style: const TextStyle(fontSize: 12, color: Color(0xFF8892B0))),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(icon: const Icon(Icons.edit, size: 20), onPressed: () async { await context.push('/admin/films/form?id=${f.id}'); _load(); }),
                            IconButton(icon: const Icon(Icons.delete, size: 20, color: Colors.redAccent), onPressed: () async {
                              final confirm = await showDialog<bool>(context: context, builder: (c) => AlertDialog(title: const Text('Delete?'), actions: [TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')), TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Delete', style: TextStyle(color: Colors.redAccent)))]));
                              if (confirm == true) _delete(f.id);
                            }),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
