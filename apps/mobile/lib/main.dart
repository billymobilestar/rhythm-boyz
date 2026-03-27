import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'app/router.dart';
import 'app/theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await dotenv.load(fileName: '.env');
  } catch (e) {
    debugPrint('Failed to load .env: $e');
  }

  final url = dotenv.env['SUPABASE_URL'] ?? '';
  final key = dotenv.env['SUPABASE_ANON_KEY'] ?? '';

  debugPrint('Supabase URL: $url');
  debugPrint('Supabase Key length: ${key.length}');

  if (url.isNotEmpty && url.startsWith('http')) {
    await Supabase.initialize(url: url, anonKey: key);
  } else {
    debugPrint('WARNING: Invalid Supabase URL. App will run without backend.');
  }

  runApp(const ProviderScope(child: RBZApp()));
}

class RBZApp extends StatelessWidget {
  const RBZApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'RBZ Studios',
      theme: rbzTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
