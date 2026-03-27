import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

const _primary = Color(0xFFE94560);
const _background = Color(0xFF0A0A0F);
const _card = Color(0xFF12121A);
const _secondary = Color(0xFF1A1A2E);
const _border = Color(0xFF2A2A3E);
const _muted = Color(0xFF8892B0);

final rbzTheme = ThemeData(
  brightness: Brightness.dark,
  scaffoldBackgroundColor: _background,
  primaryColor: _primary,
  colorScheme: const ColorScheme.dark(
    primary: _primary,
    surface: _card,
    onSurface: Colors.white,
    secondary: _secondary,
    outline: _border,
  ),
  textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
  appBarTheme: const AppBarTheme(
    backgroundColor: _secondary,
    elevation: 0,
    centerTitle: false,
    titleTextStyle: TextStyle(
      color: Colors.white,
      fontSize: 20,
      fontWeight: FontWeight.bold,
    ),
  ),
  cardTheme: CardThemeData(
    color: _card,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
      side: const BorderSide(color: _border),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: _card,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: _border),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: _border),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: _primary),
    ),
    hintStyle: const TextStyle(color: _muted),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: _primary,
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
    ),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: _secondary,
    selectedItemColor: _primary,
    unselectedItemColor: _muted,
    type: BottomNavigationBarType.fixed,
  ),
);
