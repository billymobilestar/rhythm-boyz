import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../models/trailer.dart';
import '../../services/supabase_service.dart';

class AdminTrailersScreen extends StatefulWidget {
  const AdminTrailersScreen({super.key});

  @override
  State<AdminTrailersScreen> createState() => _AdminTrailersScreenState();
}

class _AdminTrailersScreenState extends State<AdminTrailersScreen> {
  List<Trailer> _trailers = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    final data = await supabase.from('trailers').select().order('created_at', ascending: false);
    setState(() { _trailers = (data as List).map((e) => Trailer.fromJson(e)).toList(); _loading = false; });
  }

  Future<void> _delete(String id) async {
    await supabase.from('trailers').delete().eq('id', id);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Manage Trailers')),
      floatingActionButton: FloatingActionButton(
        onPressed: () async { await context.push('/admin/trailers/form'); _load(); },
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _trailers.isEmpty
              ? const Center(child: Text('No trailers', style: TextStyle(color: Color(0xFF8892B0))))
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: _trailers.length,
                  itemBuilder: (context, index) {
                    final t = _trailers[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        title: Text(t.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                        subtitle: Text('${t.movieName ?? "No movie"} • ${t.published ? "Published" : "Draft"}', style: const TextStyle(fontSize: 12, color: Color(0xFF8892B0))),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(icon: const Icon(Icons.edit, size: 20), onPressed: () async { await context.push('/admin/trailers/form?id=${t.id}'); _load(); }),
                            IconButton(icon: const Icon(Icons.delete, size: 20, color: Colors.redAccent), onPressed: () async {
                              final confirm = await showDialog<bool>(context: context, builder: (c) => AlertDialog(title: const Text('Delete?'), actions: [TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')), TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Delete', style: TextStyle(color: Colors.redAccent)))]));
                              if (confirm == true) _delete(t.id);
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
