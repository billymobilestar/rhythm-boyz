import 'package:flutter/material.dart';
import '../../services/supabase_service.dart';

class FeedbackScreen extends StatefulWidget {
  const FeedbackScreen({super.key});

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  final _subjectController = TextEditingController();
  final _bodyController = TextEditingController();
  String _category = 'general';
  bool _loading = false;
  bool _submitted = false;
  String? _error;

  final _categories = [
    {'value': 'general', 'label': 'General'},
    {'value': 'feature_request', 'label': 'Feature Request'},
    {'value': 'bug', 'label': 'Bug Report'},
  ];

  Future<void> _submit() async {
    if (_subjectController.text.trim().isEmpty || _bodyController.text.trim().isEmpty) return;

    setState(() { _loading = true; _error = null; });

    try {
      final user = supabase.auth.currentUser;

      await supabase.from('feedback').insert({
        'category': _category,
        'subject': _subjectController.text.trim(),
        'body': _bodyController.text.trim(),
        'user_id': user?.id,
      });

      setState(() { _loading = false; _submitted = true; });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = e.toString();
      });
    }
  }

  void _reset() {
    setState(() {
      _submitted = false;
      _subjectController.clear();
      _bodyController.clear();
      _category = 'general';
      _error = null;
    });
  }

  @override
  void dispose() {
    _subjectController.dispose();
    _bodyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Feedback')),
      body: _submitted
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, color: Color(0xFF10B981), size: 32),
                    ),
                    const SizedBox(height: 16),
                    const Text('Thank you!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Your feedback has been submitted.', style: TextStyle(color: Color(0xFF8892B0))),
                    const SizedBox(height: 24),
                    ElevatedButton(onPressed: _reset, child: const Text('Submit Another')),
                  ],
                ),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    "We'd love to hear from you.",
                    style: TextStyle(color: Color(0xFF8892B0), fontSize: 15),
                  ),
                  const SizedBox(height: 20),

                  const Text('Category', style: TextStyle(fontWeight: FontWeight.w500)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: _categories.map((cat) {
                      final selected = _category == cat['value'];
                      return ChoiceChip(
                        label: Text(cat['label']!),
                        selected: selected,
                        selectedColor: Theme.of(context).primaryColor,
                        onSelected: (_) => setState(() => _category = cat['value']!),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  if (_error != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Could not submit feedback. Please check your connection and try again.',
                        style: TextStyle(color: Colors.redAccent, fontSize: 14),
                      ),
                    ),

                  TextField(
                    controller: _subjectController,
                    decoration: const InputDecoration(labelText: 'Subject'),
                  ),
                  const SizedBox(height: 16),

                  TextField(
                    controller: _bodyController,
                    decoration: const InputDecoration(labelText: 'Details', alignLabelWithHint: true),
                    maxLines: 6,
                  ),
                  const SizedBox(height: 24),

                  ElevatedButton(
                    onPressed: _loading ? null : _submit,
                    child: _loading
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('Submit Feedback'),
                  ),
                ],
              ),
            ),
    );
  }
}
