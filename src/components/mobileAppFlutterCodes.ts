// ─── Flutter UI Code for Driver App Screens ───

export const selectLanguageFlutterCode = `import 'package:flutter/material.dart';
import 'dart:math';

class SelectLanguagePage extends StatefulWidget {
  const SelectLanguagePage({super.key});

  @override
  State<SelectLanguagePage> createState() => _SelectLanguagePageState();
}

class _SelectLanguagePageState extends State<SelectLanguagePage> {
  int? selectedIndex;

  final List<Map<String, String>> languages = [
    {
      'flag': '\u{1F1EC}\u{1F1E7}',
      'name': 'English',
      'native': 'English',
      'tag': 'International',
    },
    {
      'flag': '\u{1F1F2}\u{1F1F2}',
      'name': 'Myanmar',
      'native': '\\u1019\\u103C\\u1014\\u103A\\u1019\\u102C',
      'tag': 'Native Language',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // ── Red gradient background ──
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment(-0.6, -0.8),
                end: Alignment(0.6, 0.8),
                colors: [
                  Color(0xFFB71C1C),
                  Color(0xFFC62828),
                  Color(0xFFE53935),
                  Color(0xFFEF5350),
                ],
                stops: [0.085, 0.375, 0.666, 0.915],
              ),
            ),
          ),

          // ── Decorative circles ──
          Positioned(
            left: 185, top: -80,
            child: Container(
              width: 288, height: 288,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.1),
                  width: 2,
                ),
              ),
            ),
          ),
          Positioned(
            left: 225, top: -40,
            child: Container(
              width: 208, height: 208,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.08),
                ),
              ),
            ),
          ),
          Positioned(
            left: -40, top: 96,
            child: Container(
              width: 128, height: 128,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
            ),
          ),
          Positioned(
            left: 8, top: 144,
            child: Container(
              width: 64, height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.08),
                ),
              ),
            ),
          ),

          // ── Small decorative dots ──
          ...List.generate(6, (i) {
            final positions = [
              [360.0, 60.0, 5.0],
              [340.0, 74.0, 7.0],
              [356.0, 88.0, 9.0],
              [342.0, 102.0, 5.0],
              [358.0, 116.0, 7.0],
              [338.0, 130.0, 9.0],
            ];
            return Positioned(
              left: positions[i][0],
              top: positions[i][1],
              child: Container(
                width: positions[i][2],
                height: positions[i][2],
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
              ),
            );
          }),

          // ── Center divider line ──
          Positioned(
            left: 196, top: 0,
            child: Container(
              width: 1, height: 852,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.white.withValues(alpha: 0.06),
                    Colors.white.withValues(alpha: 0.06),
                    Colors.transparent,
                  ],
                  stops: const [0.0, 0.3, 0.7, 1.0],
                ),
              ),
            ),
          ),

          // ── Glow effect ──
          Positioned(
            left: 84.5, top: 96,
            child: Container(
              width: 224, height: 224,
              decoration: BoxDecoration(
                color: const Color(0xFFFFC8C8)
                    .withValues(alpha: 0.18),
                shape: BoxShape.circle,
              ),
              child: const SizedBox.shrink(),
            ),
          ),

          // ── Header content ──
          _buildHeaderContent(),

          // ── Bottom sheet ──
          Positioned(
            left: 0, right: 0, bottom: 0,
            child: _buildBottomSheet(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderContent() {
    return Positioned(
      top: 0, left: 0, right: 0,
      height: 364,
      child: Column(
        children: [
          const SizedBox(height: 64),

          // "Driver Partner" badge
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 13, vertical: 1,
            ),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.15),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 6, height: 6,
                  decoration: const BoxDecoration(
                    color: Color(0xFF7BF1A8),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  'DRIVER PARTNER',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 10,
                    color: Colors.white.withValues(alpha: 0.7),
                    letterSpacing: 1.5,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // App logo
          Stack(
            clipBehavior: Clip.none,
            children: [
              // Glow behind logo
              Positioned(
                left: -12, top: -12,
                child: Container(
                  width: 108, height: 108,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(28),
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withValues(alpha: 0.25),
                        Colors.white.withValues(alpha: 0.05),
                      ],
                    ),
                  ),
                ),
              ),
              // Outer container
              Container(
                width: 84, height: 84,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.95),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.2),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.25),
                      blurRadius: 48, offset: const Offset(0, 16),
                    ),
                  ],
                ),
                child: Center(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(18),
                    child: Image.asset(
                      'assets/images/logo.png',
                      width: 56, height: 56,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
              // Sparkle dots
              Positioned(
                left: 78, top: -6,
                child: Container(
                  width: 12, height: 12,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.4),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.6),
                    ),
                  ),
                ),
              ),
              Positioned(
                left: -4, top: 80,
                child: Container(
                  width: 8, height: 8,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.3),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          // "InnoTaxi" title
          Text(
            'InnoTaxi',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 30,
              fontWeight: FontWeight.w500,
              color: Colors.white,
              letterSpacing: -0.75,
              shadows: [
                Shadow(
                  color: Colors.black.withValues(alpha: 0.15),
                  blurRadius: 8, offset: const Offset(0, 4),
                ),
              ],
            ),
          ),

          const SizedBox(height: 6),

          // "Driver Partner App" subtitle
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _gradientLine(toRight: true),
              const SizedBox(width: 12),
              Text(
                'DRIVER PARTNER APP',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 10,
                  color: Colors.white.withValues(alpha: 0.5),
                  letterSpacing: 2.2,
                ),
              ),
              const SizedBox(width: 12),
              _gradientLine(toRight: false),
            ],
          ),

          const SizedBox(height: 16),

          // Drive / Earn / Grow pills
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _tagPill('Drive'),
              const SizedBox(width: 8),
              _tagPill('Earn'),
              const SizedBox(width: 8),
              _tagPill('Grow'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _gradientLine({required bool toRight}) {
    return Container(
      width: 32, height: 1,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: toRight
              ? [Colors.transparent, Colors.white.withValues(alpha: 0.3)]
              : [Colors.white.withValues(alpha: 0.3), Colors.transparent],
        ),
      ),
    );
  }

  Widget _tagPill(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 13, vertical: 5,
      ),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.15),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 10,
          color: Colors.white.withValues(alpha: 0.8),
        ),
      ),
    );
  }

  Widget _buildBottomSheet() {
    return Container(
      height: 488,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(36),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x2E000000),
            blurRadius: 60, offset: Offset(0, -12),
          ),
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 12, offset: Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Drag handle
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(999),
              ),
            ),
          ),

          const SizedBox(height: 12),

          // ── Header row ──
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                // Globe icon
                Container(
                  width: 32, height: 32,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    gradient: const LinearGradient(
                      colors: [
                        Color(0xFFFFEBEE),
                        Color(0xFFFFCDD2),
                      ],
                    ),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.language,
                      size: 15,
                      color: Color(0xFFE53935),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                // Title
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Choose Language',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF1A1A2E),
                        ),
                      ),
                      Text(
                        'Select your preferred language',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 10.5,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ],
                  ),
                ),
                // "2 langs" badge
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 11, vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF0F0),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: const Color(0xFFFFCDD2)
                          .withValues(alpha: 0.6),
                    ),
                  ),
                  child: Text(
                    '2 langs',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 10,
                      color: const Color(0xFFE53935)
                          .withValues(alpha: 0.6),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Divider
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              height: 1,
              color: const Color(0xFFF3F4F6),
            ),
          ),

          const SizedBox(height: 16),

          // ── Language cards ──
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: List.generate(languages.length, (i) {
                return Padding(
                  padding: EdgeInsets.only(
                    bottom: i < languages.length - 1 ? 12 : 0,
                  ),
                  child: _languageCard(i),
                );
              }),
            ),
          ),

          const Spacer(),

          // ── "Get Started" button ──
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: SizedBox(
              width: double.infinity,
              height: 52.5,
              child: ElevatedButton(
                onPressed: selectedIndex != null
                    ? () { /* Navigate */ }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: selectedIndex != null
                      ? const Color(0xFFE53935)
                      : const Color(0xFFF3F4F6),
                  foregroundColor: selectedIndex != null
                      ? Colors.white
                      : const Color(0xFFC0C4CE),
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Get Started',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: selectedIndex != null
                            ? Colors.white
                            : const Color(0xFFC0C4CE),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      Icons.arrow_forward,
                      size: 17,
                      color: selectedIndex != null
                          ? Colors.white
                          : const Color(0xFFC0C4CE),
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 14),

          // ── Settings hint ──
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.settings,
                size: 9,
                color: const Color(0xFFD1D5DB),
              ),
              const SizedBox(width: 4),
              const Text(
                'You can change this later in Settings',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 10,
                  color: Color(0xFFC0C4CE),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _languageCard(int index) {
    final lang = languages[index];
    final isSelected = selectedIndex == index;

    return GestureDetector(
      onTap: () => setState(() => selectedIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: 88,
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFFFFF5F5)
              : const Color(0xFFFAFAFA),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected
                ? const Color(0xFFE53935)
                : const Color(0xFFF0F0F4),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 4, offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              // Flag container
              Container(
                width: 52, height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Text(
                    lang['flag']!,
                    style: const TextStyle(fontSize: 30),
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Name + subtitle
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      lang['name']!,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF1A1A2E),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Text(
                          lang['native']!,
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          '\\u00B7',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 9,
                            color: Color(0xFFD1D5DB),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          lang['tag']!,
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 10.5,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFFB0B5BE),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Radio indicator
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 26, height: 26,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isSelected
                      ? const Color(0xFFE53935)
                      : Colors.transparent,
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFFE53935)
                        : const Color(0xFFE5E7EB),
                    width: 2,
                  ),
                ),
                child: isSelected
                    ? const Icon(
                        Icons.check,
                        size: 16,
                        color: Colors.white,
                      )
                    : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}`;

export const selectLanguageWidgetTestCode = `// widget: select_language_page_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:innotaxi_driver/pages/select_language_page.dart';

void main() {
  testWidgets('renders language options', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: SelectLanguagePage()),
    );

    expect(find.text('Choose Language'), findsOneWidget);
    expect(find.text('English'), findsOneWidget);
    expect(find.text('Myanmar'), findsOneWidget);
    expect(find.text('Get Started'), findsOneWidget);
    expect(find.text('2 langs'), findsOneWidget);
  });

  testWidgets('selects language on tap', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: SelectLanguagePage()),
    );

    // Tap Myanmar card
    await tester.tap(find.text('Myanmar'));
    await tester.pumpAndSettle();

    // Verify selection (check icon appears)
    expect(find.byIcon(Icons.check), findsOneWidget);
  });
}`;

export const loginWithEmailFlutterCode = `import 'package:flutter/material.dart';

class LoginEmailPage extends StatefulWidget {
  const LoginEmailPage({super.key});

  @override
  State<LoginEmailPage> createState() => _LoginEmailPageState();
}

class _LoginEmailPageState extends State<LoginEmailPage> {
  int _activeTab = 0; // 0 = Email, 1 = Mobile OTP, 2 = PIN Code
  bool _obscurePassword = true;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  final List<Map<String, dynamic>> _tabs = [
    {'icon': Icons.mail_outline, 'label': 'Email'},
    {'icon': Icons.smartphone, 'label': 'Mobile OTP'},
    {'icon': Icons.shield_outlined, 'label': 'PIN Code'},
  ];

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // ── Red gradient background ──
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment(-0.6, -0.8),
                end: Alignment(0.6, 0.8),
                colors: [
                  Color(0xFFB71C1C),
                  Color(0xFFC62828),
                  Color(0xFFE53935),
                  Color(0xFFEF5350),
                ],
                stops: [0.085, 0.375, 0.666, 0.915],
              ),
            ),
          ),

          // ── Decorative circles ──
          Positioned(
            left: 201, top: -64,
            child: Container(
              width: 256, height: 256,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.1),
                  width: 2,
                ),
              ),
            ),
          ),
          Positioned(
            left: 249, top: -32,
            child: Container(
              width: 176, height: 176,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.08),
                ),
              ),
            ),
          ),
          Positioned(
            left: -32, top: 80,
            child: Container(
              width: 112, height: 112,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
            ),
          ),
          Positioned(
            left: 16, top: 128,
            child: Container(
              width: 48, height: 48,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.08),
                ),
              ),
            ),
          ),

          // ── Glow effect ──
          Positioned(
            left: 108.5, top: 64,
            child: Container(
              width: 176, height: 176,
              decoration: BoxDecoration(
                color: const Color(0xFFFFC8C8)
                    .withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // ── Header content ──
          _buildHeader(),

          // ── Bottom sheet ──
          Positioned(
            left: 0, right: 0, bottom: 0,
            child: _buildBottomSheet(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Positioned(
      top: 0, left: 0, right: 0,
      height: 239,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 48),

          // App logo with glow
          Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned(
                left: -12, top: -12,
                child: Container(
                  width: 100, height: 100,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(26),
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withValues(alpha: 0.22),
                        Colors.white.withValues(alpha: 0.04),
                      ],
                    ),
                  ),
                ),
              ),
              Container(
                width: 76, height: 76,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.96),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.2),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.22),
                      blurRadius: 40, offset: const Offset(0, 16),
                    ),
                  ],
                ),
                child: Center(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.asset(
                      'assets/images/logo.png',
                      width: 48, height: 48,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
              // Sparkle dots
              Positioned(
                left: 68, top: -4,
                child: Container(
                  width: 12, height: 12,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.4),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.6),
                    ),
                  ),
                ),
              ),
              Positioned(
                left: -2, top: 70,
                child: Container(
                  width: 8, height: 8,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.25),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 4),

          // "Welcome Back"
          const Text(
            'Welcome Back',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 26,
              fontWeight: FontWeight.w500,
              color: Colors.white,
              letterSpacing: -0.65,
            ),
          ),

          const SizedBox(height: 4),

          // Subtitle
          Text(
            'Sign in to start driving and earning',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12,
              color: Colors.white.withValues(alpha: 0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSheet() {
    return Container(
      height: 613,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(36),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x2E000000),
            blurRadius: 60, offset: Offset(0, -12),
          ),
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 12, offset: Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Drag handle
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(999),
              ),
            ),
          ),

          const SizedBox(height: 16),

          // ── Tab Switcher (Email / Mobile OTP / PIN Code) ──
          _buildTabSwitcher(),

          const SizedBox(height: 20),

          // ── Form ──
          Expanded(child: _buildEmailForm()),
        ],
      ),
    );
  }

  Widget _buildTabSwitcher() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Container(
        height: 41.75,
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Stack(
          children: [
            // Animated slider
            AnimatedPositioned(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              left: 3 + _activeTab * (353 / 3),
              top: 3,
              child: Container(
                width: 353 / 3 - 3,
                height: 35.75,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: 8,
                    ),
                  ],
                ),
              ),
            ),
            // Tab buttons
            Row(
              children: List.generate(3, (i) {
                final isActive = _activeTab == i;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _activeTab = i),
                    child: Container(
                      height: 41.75,
                      color: Colors.transparent,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _tabs[i]['icon'] as IconData,
                            size: 12,
                            color: isActive
                                ? const Color(0xFFE53935)
                                : const Color(0xFF9CA3AF),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _tabs[i]['label'] as String,
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 10.5,
                              fontWeight: FontWeight.w500,
                              color: isActive
                                  ? const Color(0xFFE53935)
                                  : const Color(0xFF9CA3AF),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmailForm() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Email field ──
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'EMAIL ADDRESS',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 10.5,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF6B7280),
                  letterSpacing: 0.525,
                ),
              ),
              // Demo badge
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8, vertical: 3,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF5F5),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: const Color(0xFFFFCDD2),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text(
                      '\\u26A1',
                      style: TextStyle(fontSize: 9),
                    ),
                    SizedBox(width: 2),
                    Text(
                      'Demo',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFFE53935),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          _buildTextField(
            controller: _emailController,
            hint: 'you@example.com',
            prefixIcon: Icons.mail_outline,
          ),

          const SizedBox(height: 14),

          // ── Password field ──
          Text(
            'PASSWORD',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 10.5,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF6B7280),
              letterSpacing: 0.525,
            ),
          ),
          const SizedBox(height: 6),
          _buildTextField(
            controller: _passwordController,
            hint: 'Enter your password',
            prefixIcon: Icons.lock_outline,
            isPassword: true,
          ),

          // Forgot Password
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () {},
              child: Text(
                'Forgot Password?',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFFE53935)
                      .withValues(alpha: 0.7),
                ),
              ),
            ),
          ),

          // ── Sign In button ──
          SizedBox(
            width: double.infinity,
            height: 52.5,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
              child: Ink(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFFEF5350),
                      Color(0xFFE53935),
                      Color(0xFFC62828),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFE53935)
                          .withValues(alpha: 0.32),
                      blurRadius: 28,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Container(
                  alignment: Alignment.center,
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Sign In',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(width: 4),
                      Icon(
                        Icons.arrow_forward,
                        size: 17,
                        color: Colors.white,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 20),

          // ── Divider with "New to InnoTaxi?" ──
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 1,
                  color: const Color(0xFFF0F0F4),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Text(
                  'NEW TO INNOTAXI?',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 10,
                    color: const Color(0xFFC4C9D4),
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              Expanded(
                child: Container(
                  height: 1,
                  color: const Color(0xFFF0F0F4),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // ── Register Now button ──
          SizedBox(
            width: double.infinity,
            height: 53,
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                backgroundColor: const Color(0xFFFAFAFA),
                side: const BorderSide(
                  color: Color(0xFFF0F0F4),
                  width: 2,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Text(
                    'Register Now',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      color: Color(0xFFE53935),
                    ),
                  ),
                  SizedBox(width: 4),
                  Icon(
                    Icons.arrow_forward,
                    size: 15,
                    color: Color(0xFFE53935),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 8),

          // "Don't have an account?" hint
          Center(
            child: Text(
              "Don't have an account?",
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 10.5,
                color: const Color(0xFFC4C9D4),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData prefixIcon,
    bool isPassword = false,
  }) {
    return Container(
      height: 53,
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: const Color(0xFFE9EAEC),
          width: 2,
        ),
      ),
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 14),
            child: Icon(
              prefixIcon,
              size: 15,
              color: const Color(0xFFC4C9D4),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: TextField(
              controller: controller,
              obscureText: isPassword && _obscurePassword,
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  color: Color(0xFFC4C9D4),
                ),
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
                isDense: true,
              ),
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 14,
                color: Color(0xFF1A1A2E),
              ),
            ),
          ),
          if (isPassword)
            GestureDetector(
              onTap: () => setState(
                () => _obscurePassword = !_obscurePassword,
              ),
              child: Padding(
                padding: const EdgeInsets.only(right: 14),
                child: Icon(
                  _obscurePassword
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                  size: 15,
                  color: const Color(0xFFC4C9D4),
                ),
              ),
            ),
        ],
      ),
    );
  }
}`;

export const loginWithEmailWidgetTestCode = `// widget: login_email_page_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:innotaxi_driver/pages/login_email_page.dart';

void main() {
  testWidgets('renders login form with email tab active', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: LoginEmailPage()),
    );

    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Sign in to start driving and earning'), findsOneWidget);
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Mobile OTP'), findsOneWidget);
    expect(find.text('PIN Code'), findsOneWidget);
    expect(find.text('EMAIL ADDRESS'), findsOneWidget);
    expect(find.text('PASSWORD'), findsOneWidget);
    expect(find.text('Sign In'), findsOneWidget);
  });

  testWidgets('shows email and password fields', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: LoginEmailPage()),
    );

    expect(find.text('you@example.com'), findsOneWidget);
    expect(find.text('Enter your password'), findsOneWidget);
    expect(find.text('Forgot Password?'), findsOneWidget);
  });

  testWidgets('switches between auth tabs', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: LoginEmailPage()),
    );

    // Tap Mobile OTP tab
    await tester.tap(find.text('Mobile OTP'));
    await tester.pumpAndSettle();

    // Tap PIN Code tab
    await tester.tap(find.text('PIN Code'));
    await tester.pumpAndSettle();

    // Tap back to Email
    await tester.tap(find.text('Email'));
    await tester.pumpAndSettle();
  });

  testWidgets('shows register option', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: LoginEmailPage()),
    );

    expect(find.text('Register Now'), findsOneWidget);
    expect(find.text("Don\\'t have an account?"), findsOneWidget);
  });

  testWidgets('toggles password visibility', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: LoginEmailPage()),
    );

    // Find the eye icon button
    final eyeIcon = find.byIcon(Icons.visibility_outlined);
    expect(eyeIcon, findsOneWidget);

    // Tap to toggle
    await tester.tap(eyeIcon);
    await tester.pumpAndSettle();

    expect(
      find.byIcon(Icons.visibility_off_outlined),
      findsOneWidget,
    );
  });
}`;