import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/supabase_service.dart';

class AdminNewsFormScreen extends StatefulWidget {
  final String? articleId;
  const AdminNewsFormScreen({super.key, this.articleId});

  @override
  State<AdminNewsFormScreen> createState() => _AdminNewsFormScreenState();
}

class _AdminNewsFormScreenState extends State<AdminNewsFormScreen> {
  final _titleC = TextEditingController();
  final _slugC = TextEditingController();
  final _bodyC = TextEditingController();
  final _coverC = TextEditingController();
  bool _published = false;
  bool _loading = false;
  bool _isEdit = false;

  @override
  void initState() {
    super.initState();
    if (widget.articleId != null) {
      _isEdit = true;
      _loadArticle();
    }
  }

  Future<void> _loadArticle() async {
    setState(() => _loading = true);
    final data = await supabase.from('news').select().eq('id', widget.articleId!).single();
    _titleC.text = data['title'] ?? '';
    _slugC.text = data['slug'] ?? '';
    _bodyC.text = data['body'] ?? '';
    _coverC.text = data['cover_image_url'] ?? '';
    _published = data['published'] ?? false;
    setState(() => _loading = false);
  }

  String _slugify(String text) => text.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]+'), '-').replaceAll(RegExp(r'^-|-$'), '');

  Future<void> _save() async {
    setState(() => _loading = true);
    final payload = {
      'title': _titleC.text.trim(),
      'slug': _slugC.text.trim(),
      'body': _bodyC.text.trim(),
      'cover_image_url': _coverC.text.trim().isEmpty ? null : _coverC.text.trim(),
      'published': _published,
    };

    if (_isEdit) {
      await supabase.from('news').update(payload).eq('id', widget.articleId!);
    } else {
      await supabase.from('news').insert(payload);
    }

    if (mounted) context.pop();
  }

  @override
  void dispose() { _titleC.dispose(); _slugC.dispose(); _bodyC.dispose(); _coverC.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isEdit ? 'Edit Article' : 'New Article')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(controller: _titleC, decoration: const InputDecoration(labelText: 'Title'), onChanged: (v) { if (!_isEdit) _slugC.text = _slugify(v); }),
                  const SizedBox(height: 12),
                  TextField(controller: _slugC, decoration: const InputDecoration(labelText: 'Slug')),
                  const SizedBox(height: 12),
                  TextField(controller: _coverC, decoration: const InputDecoration(labelText: 'Cover Image URL')),
                  const SizedBox(height: 12),
                  TextField(controller: _bodyC, decoration: const InputDecoration(labelText: 'Body', alignLabelWithHint: true), maxLines: 8),
                  const SizedBox(height: 16),
                  SwitchListTile(title: const Text('Published'), value: _published, onChanged: (v) => setState(() => _published = v), activeThumbColor: Theme.of(context).primaryColor),
                  const SizedBox(height: 16),
                  ElevatedButton(onPressed: _save, child: Text(_isEdit ? 'Update' : 'Create')),
                ],
              ),
            ),
    );
  }
}
