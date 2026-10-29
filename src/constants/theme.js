// Kaynes Technology Corporate Identity Design System
// Reference: https://www.kaynestechnology.co.in/
export const COLORS = {
  // Kaynes Corporate Palette
  primary: '#D91E2A',          // Kaynes Crimson Red
  primaryDark: '#B91C1C',      // Deep Red for pressed states / borders
  primaryLight: '#FEE2E2',     // Soft Red badge tint
  secondary: '#111827',        // Obsidian / Deep Black
  cardDark: '#1F2937',         // Charcoal dark card surface
  background: '#F9FAFB',       // Crisp light industrial background
  surface: '#FFFFFF',          // Surface white
  surfaceSubtle: '#F3F4F6',    // Soft grey surface tint
  border: '#E5E7EB',           // Clean divider border
  borderDark: '#D1D5DB',       // Medium metallic border

  // Typography
  textPrimary: '#111827',      // Near black for crisp readability
  textSecondary: '#4B5563',    // Muted slate text
  textMuted: '#9CA3AF',        // Light muted placeholder/meta text
  textLight: '#FFFFFF',        // Pure white text
  textInverse: '#FFFFFF',      // Inverse white text

  // Brand Accents
  brandAccent: '#D91E2A',      // Kaynes Crimson Red
  brandAccentDark: '#B91C1C',  // Deep Crimson Red
  metallicSilver: '#9CA3AF',   // Silver metallic accent
  metallicBorder: '#374151',   // Dark frame border

  // Status Indicators (Functional EMS plant standards)
  active: '#10B981',           // Emerald Green (Operational)
  activeBg: '#D1FAE5',
  activeText: '#065F46',
  activeBorder: '#A7F3D0',

  maintenance: '#F59E0B',       // Warning Amber (Maintenance Required)
  maintenanceBg: '#FEF3C7',
  maintenanceText: '#92400E',
  maintenanceBorder: '#FDE68A',

  down: '#D91E2A',             // Kaynes Red (Critical Breakdown / Down)
  downBg: '#FEE2E2',
  downText: '#991B1B',
  downBorder: '#FECACA',

  // Roles
  roleAdmin: '#D91E2A',        // Kaynes Red accent for Admin
  roleOperator: '#10B981',     // Emerald accent for Operator
  roleViewer: '#4B5563',       // Charcoal slate for Viewer
};

export const DEPARTMENTS = [
  'All',
  'SMT Lines',
  'Testing & Inspection',
  'Soldering & Assembly',
  'Cleanroom',
];

export const MACHINE_STATUS = {
  ACTIVE: 'ACTIVE',
  MAINTENANCE: 'MAINTENANCE',
  DOWN: 'DOWN',
};
