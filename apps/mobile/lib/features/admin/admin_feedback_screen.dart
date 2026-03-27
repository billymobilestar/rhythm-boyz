import 'package:flutter/material.dart';
import '../../services/supabase_service.dart';

class AdminFeedbackScreen extends StatefulWidget {
  const AdminFeedbackScreen({super.key});

  @override
  State<AdminFeedbackScreen> createState() => _AdminFeedbackScreenState();
}

class _AdminFeedbackScreenState extends State<AdminFeedbackScreen> {
  List<Map<String, dynamic>> _feedback = [];
  bool _loading = true;
  String _filter = 'all';

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    final List<dynamic> data;
    if (_filter != 'all') {
      data = await supabase.from('feedback').select().eq('status', _filter).order('created_at', ascending: false);
    } else {
      data = await supabase.from('feedback').select().order('created_at', ascending: false);
    }
    setState(() { _feedback = List<Map<String, dynamic>>.from(data); _loading = false; });
  }

  Future<void> _updateStatus(String id, String status) async {
    await supabase.from('feedback').update({'status': status}).eq('id', id);
    _load();
  }

  Future<void> _delete(String id) async {
    await supabase.from('feedback').delete().eq('id', id);
    _load();
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'open': return const Color(0xFFF59E0B);
      case 'reviewed': return const Color(0xFF3B82F6);
      case 'resolved': return const Color(0xFF10B981);
      default: return const Color(0xFF8892B0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Feedback')),
      body: Column(
        children: [
          // Filter chips
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: ['all', 'open', 'reviewed', 'resolved'].map((f) => Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(f[0].toUpperCase() + f.substring(1)),
                  selected: _filter == f,
                  selectedColor: Theme.of(context).primaryColor,
                  onSelected: (_) { setState(() { _filter = f; _loading = true; }); _load(); },
                ),
              )).toList(),
            ),
          ),

          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _feedback.isEmpty
                    ? const Center(child: Text('No feedback', style: TextStyle(color: Color(0xFF8892B0))))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        itemCount: _feedback.length,
                        itemBuilder: (context, index) {
                          final f = _feedback[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 10),
                            child: Padding(
                              padding: const EdgeInsets.all(14),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(child: Text(f['subject'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600))),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(color: _statusColor(f['status']).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
                                        child: Text(f['status'], style: TextStyle(color: _statusColor(f['status']), fontSize: 11)),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(f['body'] ?? '', style: const TextStyle(fontSize: 13, color: Color(0xFFCCCCCC))),
                                  const SizedBox(height: 10),
                                  Row(
                                    children: [
                                      Text(f['category'] ?? '', style: const TextStyle(fontSize: 11, color: Color(0xFF8892B0))),
                                      const Spacer(),
                                      if (f['status'] != 'reviewed')
                                        TextButton(onPressed: () => _updateStatus(f['id'], 'reviewed'), child: const Text('Review', style: TextStyle(fontSize: 12))),
                                      if (f['status'] != 'resolved')
                                        TextButton(onPressed: () => _updateStatus(f['id'], 'resolved'), child: const Text('Resolve', style: TextStyle(fontSize: 12, color: Color(0xFF10B981)))),
                                      IconButton(icon: const Icon(Icons.delete, size: 18, color: Colors.redAccent), onPressed: () => _delete(f['id'])),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
