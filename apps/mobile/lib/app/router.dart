import 'package:go_router/go_router.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/signup_screen.dart';
import '../features/news/news_screen.dart';
import '../features/news/news_detail_screen.dart';
import '../features/trailers/trailers_screen.dart';
import '../features/trailers/trailer_detail_screen.dart';
import '../features/films/films_screen.dart';
import '../features/films/film_detail_screen.dart';
import '../features/exclusive/exclusive_screen.dart';
import '../features/exclusive/exclusive_detail_screen.dart';
import '../features/feedback/feedback_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/admin/admin_dashboard_screen.dart';
import '../features/admin/admin_news_screen.dart';
import '../features/admin/admin_news_form_screen.dart';
import '../features/admin/admin_trailers_screen.dart';
import '../features/admin/admin_trailer_form_screen.dart';
import '../features/admin/admin_films_screen.dart';
import '../features/admin/admin_film_form_screen.dart';
import '../features/admin/admin_feedback_screen.dart';
import '../features/home/home_shell.dart';

final router = GoRouter(
  initialLocation: '/films',
  routes: [
    ShellRoute(
      builder: (context, state, child) => HomeShell(child: child),
      routes: [
        GoRoute(
          path: '/films',
          builder: (context, state) => const FilmsScreen(),
        ),
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
      path: '/films/:id',
      builder: (context, state) => FilmDetailScreen(
        id: state.pathParameters['id']!,
      ),
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
    // Admin routes
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminDashboardScreen(),
    ),
    GoRoute(
      path: '/admin/news',
      builder: (context, state) => const AdminNewsScreen(),
    ),
    GoRoute(
      path: '/admin/news/form',
      builder: (context, state) => AdminNewsFormScreen(
        articleId: state.uri.queryParameters['id'],
      ),
    ),
    GoRoute(
      path: '/admin/trailers',
      builder: (context, state) => const AdminTrailersScreen(),
    ),
    GoRoute(
      path: '/admin/trailers/form',
      builder: (context, state) => AdminTrailerFormScreen(
        trailerId: state.uri.queryParameters['id'],
      ),
    ),
    GoRoute(
      path: '/admin/films',
      builder: (context, state) => const AdminFilmsScreen(),
    ),
    GoRoute(
      path: '/admin/films/form',
      builder: (context, state) => AdminFilmFormScreen(
        filmId: state.uri.queryParameters['id'],
      ),
    ),
    GoRoute(
      path: '/admin/feedback',
      builder: (context, state) => const AdminFeedbackScreen(),
    ),
  ],
);
