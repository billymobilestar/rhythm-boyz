import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeShell extends StatelessWidget {
  final Widget child;
  const HomeShell({super.key, required this.child});

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    if (location.startsWith('/news')) return 1;
    if (location.startsWith('/trailers')) return 2;
    if (location.startsWith('/exclusive')) return 3;
    if (location.startsWith('/feedback')) return 4;
    return 0; // films
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex(context),
        onTap: (index) {
          switch (index) {
            case 0:
              context.go('/films');
            case 1:
              context.go('/news');
            case 2:
              context.go('/trailers');
            case 3:
              context.go('/exclusive');
            case 4:
              context.go('/feedback');
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.movie_outlined), label: 'Films'),
          BottomNavigationBarItem(icon: Icon(Icons.newspaper), label: 'News'),
          BottomNavigationBarItem(icon: Icon(Icons.play_circle_outline), label: 'Trailers'),
          BottomNavigationBarItem(icon: Icon(Icons.star_outline), label: 'Exclusive'),
          BottomNavigationBarItem(icon: Icon(Icons.feedback_outlined), label: 'Feedback'),
        ],
      ),
    );
  }
}
