import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/supabase_service.dart';

class AdminTrailerFormScreen extends StatefulWidget {
  final String? trailerId;
  const AdminTrailerFormScreen({super.key, this.trailerId});

  @override
  State<AdminTrailerFormScreen> createState() => _AdminTrailerFormScreenState();
}

class _AdminTrailerFormScreenState extends State<AdminTrailerFormScreen> {
  final _titleC = TextEditingController();
  final _descC = TextEditingController();
  final _videoC = TextEditingController();
  final _thumbC = TextEditingController();
  final _movieC = TextEditingController();
  bool _published = false;
  bool _loading = false;
  bool _isEdit = false;

  @override
  void initState() { super.initState(); if (widget.trailerId != null) { _isEdit = true; _loadTrailer(); } }

  Future<void> _loadTrailer() async {
    setState(() => _loading = true);
    final data = await supabase.from('trailers').select().eq('id', widget.trailerId!).single();
    _titleC.text = data['title'] ?? '';
    _descC.text = data['description'] ?? '';
    _videoC.text = data['video_url'] ?? '';
    _thumbC.text = data['thumbnail_url'] ?? '';
    _movieC.text = data['movie_name'] ?? '';
    _published = data['published'] ?? false;
    setState(() => _loading = false);
  }

  void _onVideoUrlChanged(String url) {
    final match = RegExp(r'(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)').firstMatch(url);
    if (match != null && _thumbC.text.isEmpty) {
      _thumbC.text = 'https://img.youtube.com/vi/${match.group(1)}/maxresdefault.jpg';
    }
  }

  Future<void> _save() async {
    setState(() => _loading = true);
    final payload = {
      'title': _titleC.text.trim(),
      'description': _descC.text.trim().isEmpty ? null : _descC.text.trim(),
      'video_url': _videoC.text.trim(),
      'thumbnail_url': _thumbC.text.trim().isEmpty ? null : _thumbC.text.trim(),
      'movie_name': _movieC.text.trim().isEmpty ? null : _movieC.text.trim(),
      'published': _published,
    };
    if (_isEdit) { await supabase.from('trailers').update(payload).eq('id', widget.trailerId!); }
    else { await supabase.from('trailers').insert(payload); }
    if (mounted) context.pop();
  }

  @override
  void dispose() { _titleC.dispose(); _descC.dispose(); _videoC.dispose(); _thumbC.dispose(); _movieC.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isEdit ? 'Edit Trailer' : 'New Trailer')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(controller: _titleC, decoration: const InputDecoration(labelText: 'Title')),
                  const SizedBox(height: 12),
                  TextField(controller: _movieC, decoration: const InputDecoration(labelText: 'Movie Name')),
                  const SizedBox(height: 12),
                  TextField(controller: _videoC, decoration: const InputDecoration(labelText: 'Video URL'), onChanged: _onVideoUrlChanged),
                  const SizedBox(height: 12),
                  TextField(controller: _thumbC, decoration: const InputDecoration(labelText: 'Thumbnail URL')),
                  const SizedBox(height: 12),
                  TextField(controller: _descC, decoration: const InputDecoration(labelText: 'Description', alignLabelWithHint: true), maxLines: 4),
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
