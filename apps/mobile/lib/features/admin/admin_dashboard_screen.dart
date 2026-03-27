import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/supabase_service.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, int> _counts = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final results = await Future.wait([
      supabase.from('films').select().count(),
      supabase.from('news').select().count(),
      supabase.from('trailers').select().count(),
      supabase.from('exclusive_content').select().count(),
      supabase.from('feedback').select().eq('status', 'open').count(),
      supabase.from('profiles').select().count(),
    ]);

    setState(() {
      _counts = {
        'Films': results[0].count,
        'News': results[1].count,
        'Trailers': results[2].count,
        'Exclusive': results[3].count,
        'Open Feedback': results[4].count,
        'Users': results[5].count,
      };
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Text('RBZ', style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold)),
            const SizedBox(width: 6),
            const Text('Admin', style: TextStyle(fontWeight: FontWeight.w400)),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats grid
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.6,
                    children: _counts.entries.map((e) => Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(e.key, style: const TextStyle(color: Color(0xFF8892B0), fontSize: 13)),
                            const SizedBox(height: 4),
                            Text('${e.value}', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Theme.of(context).primaryColor)),
                          ],
                        ),
                      ),
                    )).toList(),
                  ),

                  const SizedBox(height: 24),
                  const Text('Manage', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 12),

                  _adminTile(context, Icons.movie_outlined, 'Films', '/admin/films'),
                  _adminTile(context, Icons.newspaper, 'News', '/admin/news'),
                  _adminTile(context, Icons.play_circle_outline, 'Trailers', '/admin/trailers'),
                  _adminTile(context, Icons.feedback_outlined, 'Feedback', '/admin/feedback'),
                ],
              ),
            ),
    );
  }

  Widget _adminTile(BuildContext context, IconData icon, String label, String route) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).primaryColor),
        title: Text(label),
        trailing: const Icon(Icons.chevron_right, color: Color(0xFF8892B0)),
        onTap: () => context.push(route),
      ),
    );
  }
}
