import 'package:flutter/material.dart';

class CustomerAvatarWidget extends StatelessWidget {
  final String name;
  final String? gender;
  final double radius;
  final bool showBorder;
  final Color? borderColor;

  const CustomerAvatarWidget({
    super.key,
    required this.name,
    this.gender,
    this.radius = 20,
    this.showBorder = true,
    this.borderColor,
  });

  bool get _isMale {
    final g = (gender ?? '').trim().toLowerCase();
    if (g == 'male' || g == 'm' || g == 'man' || g == 'boy') return true;
    if (g == 'female' || g == 'f' || g == 'woman' || g == 'girl') return false;

    // Common male first names fallback heuristic
    final firstName = name.trim().split(' ').first.toLowerCase();
    const maleNames = {
      'rahul', 'rohit', 'vikram', 'amit', 'sunil', 'darshan', 'arjun',
      'rohan', 'suresh', 'ramesh', 'rajesh', 'ajay', 'vijay', 'karan',
      'varun', 'aditya', 'vivek', 'manish', 'deepak', 'gaurav', 'sachin',
      'kabir', 'dev', 'samir', 'kunal', 'nikhil', 'alok', 'harsh'
    };
    if (maleNames.contains(firstName)) return true;

    // Check by name hash if unspecified for balanced visual distribution
    return name.hashCode % 2 == 0;
  }

  String get _avatarAsset {
    return _isMale ? 'assets/images/customer-male.jpg' : 'assets/images/customer-female.jpg';
  }

  String get _initials {
    final parts = name.trim().split(' ').where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return 'C';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final border = borderColor ?? const Color(0xFF22C55E).withOpacity(0.35);

    return Container(
      width: radius * 2,
      height: radius * 2,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: showBorder ? Border.all(color: border, width: 1.5) : null,
        boxShadow: showBorder
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.4),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                )
              ]
            : null,
      ),
      child: ClipOval(
        child: Image.asset(
          _avatarAsset,
          width: radius * 2,
          height: radius * 2,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Container(
              color: _isMale ? const Color(0xFF1B2A38) : const Color(0xFF2E1B2D),
              alignment: Alignment.center,
              child: Text(
                _initials,
                style: TextStyle(
                  color: _isMale ? const Color(0xFF60A5FA) : const Color(0xFFF472B6),
                  fontWeight: FontWeight.bold,
                  fontSize: radius * 0.75,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

