import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/supabase_service.dart';

class AdminFilmFormScreen extends StatefulWidget {
  final String? filmId;
  const AdminFilmFormScreen({super.key, this.filmId});

  @override
  State<AdminFilmFormScreen> createState() => _AdminFilmFormScreenState();
}

class _AdminFilmFormScreenState extends State<AdminFilmFormScreen> {
  final _titleC = TextEditingController();
  final _yearC = TextEditingController();
  final _genreC = TextEditingController();
  final _synopsisC = TextEditingController();
  final _posterC = TextEditingController();
  final _castC = TextEditingController();
  final _directorC = TextEditingController();
  bool _published = false;
  bool _featured = false;
  bool _loading = false;
  bool _isEdit = false;

  @override
  void initState() {
    super.initState();
    _yearC.text = DateTime.now().year.toString();
    if (widget.filmId != null) { _isEdit = true; _loadFilm(); }
  }

  Future<void> _loadFilm() async {
    setState(() => _loading = true);
    final data = await supabase.from('films').select().eq('id', widget.filmId!).single();
    _titleC.text = data['title'] ?? '';
    _yearC.text = '${data['year'] ?? DateTime.now().year}';
    _genreC.text = data['genre'] ?? '';
    _synopsisC.text = data['synopsis'] ?? '';
    _posterC.text = data['poster_url'] ?? '';
    _castC.text = data['cast_list'] ?? '';
    _directorC.text = data['director'] ?? '';
    _published = data['published'] ?? false;
    _featured = data['featured'] ?? false;
    setState(() => _loading = false);
  }

  Future<void> _save() async {
    setState(() => _loading = true);
    final payload = {
      'title': _titleC.text.trim(),
      'year': int.tryParse(_yearC.text.trim()) ?? DateTime.now().year,
      'genre': _genreC.text.trim().isEmpty ? null : _genreC.text.trim(),
      'synopsis': _synopsisC.text.trim().isEmpty ? null : _synopsisC.text.trim(),
      'poster_url': _posterC.text.trim().isEmpty ? null : _posterC.text.trim(),
      'cast_list': _castC.text.trim().isEmpty ? null : _castC.text.trim(),
      'director': _directorC.text.trim().isEmpty ? null : _directorC.text.trim(),
      'published': _published,
      'featured': _featured,
    };
    if (_isEdit) { await supabase.from('films').update(payload).eq('id', widget.filmId!); }
    else { await supabase.from('films').insert(payload); }
    if (mounted) context.pop();
  }

  @override
  void dispose() { _titleC.dispose(); _yearC.dispose(); _genreC.dispose(); _synopsisC.dispose(); _posterC.dispose(); _castC.dispose(); _directorC.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isEdit ? 'Edit Film' : 'New Film')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(controller: _titleC, decoration: const InputDecoration(labelText: 'Title')),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: TextField(controller: _yearC, decoration: const InputDecoration(labelText: 'Year'), keyboardType: TextInputType.number)),
                      const SizedBox(width: 12),
                      Expanded(child: TextField(controller: _genreC, decoration: const InputDecoration(labelText: 'Genre'))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(controller: _directorC, decoration: const InputDecoration(labelText: 'Director')),
                  const SizedBox(height: 12),
                  TextField(controller: _castC, decoration: const InputDecoration(labelText: 'Cast (comma-separated)')),
                  const SizedBox(height: 12),
                  TextField(controller: _posterC, decoration: const InputDecoration(labelText: 'Poster URL')),
                  if (_posterC.text.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(_posterC.text, height: 120, fit: BoxFit.cover, errorBuilder: (c, e, s) => const SizedBox()),
                    ),
                  ],
                  const SizedBox(height: 12),
                  TextField(controller: _synopsisC, decoration: const InputDecoration(labelText: 'Synopsis', alignLabelWithHint: true), maxLines: 5),
                  const SizedBox(height: 12),
                  SwitchListTile(title: const Text('Published'), value: _published, onChanged: (v) => setState(() => _published = v), activeThumbColor: Theme.of(context).primaryColor),
                  SwitchListTile(title: const Text('Featured'), value: _featured, onChanged: (v) => setState(() => _featured = v), activeThumbColor: const Color(0xFFF59E0B)),
                  const SizedBox(height: 16),
                  ElevatedButton(onPressed: _save, child: Text(_isEdit ? 'Update' : 'Add Film')),
                ],
              ),
            ),
    );
  }
}
