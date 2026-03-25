// ============================================
// LPG App — Unified Theme
// Deep Navy + Warm Orange accent color palette
// ============================================

export const COLORS = {
  // Primary palette
  primary: '#1B2838',        // Deep navy blue
  primaryDark: '#0F1923',    // Darker navy for backgrounds
  primaryLight: '#263B50',   // Lighter navy for cards

  // Accent
  accent: '#FF6B35',         // Warm orange
  accentLight: '#FF8C5A',    // Light orange for hover/press states
  accentDark: '#E05A2B',     // Darker orange for active states

  // Surface & Card
  surface: '#1E3044',        // Card background
  surfaceLight: '#24394E',   // Elevated card
  surfaceBorder: '#2E4A63',  // Card border color

  // Text
  textPrimary: '#FFFFFF',    // Primary text on dark
  textSecondary: '#A0B4C8',  // Secondary / label text
  textMuted: '#6B8299',      // Muted text
  textDark: '#1B2838',       // Text on light backgrounds

  // Status colors
  success: '#4ADE80',
  successBg: 'rgba(74, 222, 128, 0.12)',
  warning: '#FBBF24',
  warningBg: 'rgba(251, 191, 36, 0.12)',
  error: '#F87171',
  errorBg: 'rgba(248, 113, 113, 0.12)',
  info: '#60A5FA',
  infoBg: 'rgba(96, 165, 250, 0.12)',

  // Misc
  inputBg: 'rgba(255, 255, 255, 0.06)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
  inputBorderFocused: '#FF6B35',
  overlay: 'rgba(15, 25, 35, 0.7)',
  divider: 'rgba(255, 255, 255, 0.08)',

  // Status badge colors
  pending: '#FBBF24',
  confirmed: '#60A5FA',
  dispatched: '#A78BFA',
  delivered: '#4ADE80',
  cancelled: '#F87171',
};

export const FONTS = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Helper: get status color
export const getStatusColor = (status) => {
  const map = {
    pending: COLORS.pending,
    confirmed: COLORS.confirmed,
    dispatched: COLORS.dispatched,
    delivered: COLORS.delivered,
    cancelled: COLORS.cancelled,
  };
  return map[status?.toLowerCase()] || COLORS.textMuted;
};

// Helper: get status background
export const getStatusBg = (status) => {
  const map = {
    pending: COLORS.warningBg,
    confirmed: COLORS.infoBg,
    dispatched: 'rgba(167, 139, 250, 0.12)',
    delivered: COLORS.successBg,
    cancelled: COLORS.errorBg,
  };
  return map[status?.toLowerCase()] || 'rgba(255,255,255,0.05)';
};
