import 'package:go_router/go_router.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/signup_screen.dart';
import '../features/news/news_screen.dart';
import '../features/news/news_detail_screen.dart';
import '../features/trailers/trailers_screen.dart';
import '../features/trailers/trailer_detail_screen.dart';
import '../features/exclusive/exclusive_screen.dart';
import '../features/exclusive/exclusive_detail_screen.dart';
import '../features/feedback/feedback_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/home/home_shell.dart';

final router = GoRouter(
  initialLocation: '/news',
  routes: [
    ShellRoute(
      builder: (context, state, child) => HomeShell(child: child),
      routes: [
        GoRoute(
          path: '/news',
          builder: (context, state) => const NewsScreen(),
        ),
        GoRoute(
          path: '/trailers',
          builder: (context, state) => const TrailersScreen(),
        ),
        GoRoute(
          path: '/exclusive',
          builder: (context, state) => const ExclusiveScreen(),
        ),
        GoRoute(
          path: '/feedback',
          builder: (context, state) => const FeedbackScreen(),
        ),
      ],
    ),
    GoRoute(
      path: '/news/:slug',
      builder: (context, state) => NewsDetailScreen(
        slug: state.pathParameters['slug']!,
      ),
    ),
    GoRoute(
      path: '/trailers/:id',
      builder: (context, state) => TrailerDetailScreen(
        id: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/exclusive/:id',
      builder: (context, state) => ExclusiveDetailScreen(
        id: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/signup',
      builder: (context, state) => const SignUpScreen(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
  ],
);
