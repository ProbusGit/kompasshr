/**
 * Color utility for the application
 * Contains color constants and helper functions
 */

// Base colors
export const BASE_COLORS = {
  // Primary colors
  primary: '#1976D2',
  primaryLight: '#42A5F5',
  primaryDark: '#0D47A1',

  // Secondary colors
  secondary: '#FF9800',
  secondaryLight: '#FFB74D',
  secondaryDark: '#F57C00',

  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  grey: '#9E9E9E',
  lightGrey: '#EEEEEE',
  darkGrey: '#616161',

  // Semantic colors
  success: '#67AE6E',
  warning: '#FFC107',
  error: '#E50046',
  info: '#2196F3',

  // Transparent
  transparent: 'transparent',
};

// Text colors
export const TEXT_COLORS = {
  primary: '#212121',
  secondary: '#757575',
  disabled: '#9E9E9E',
  hint: '#9E9E9E',
  light: '#FFFFFF',
  placeholderText: '#BDBDBD',
};

export const Gradient = {
    gradientStart: '#1976D2',
    gradientEnd: '#42A5F5',
    };

// Background colors
export const BACKGROUND_COLORS = {
  default: '#FFFFFF',
  paper: '#F5F5F5',
  disabled: '#E0E0E0',
};

/**
 * Helper functions for color manipulation
 */

/**
 * Convert HEX to RGBA
 * @param hex - Hex color code
 * @param alpha - Alpha channel value (0-1)
 * @returns RGBA color string
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Lighten a color by a percentage
 * @param color - Hex color code
 * @param amount - Amount to lighten (0-1)
 * @returns Lightened hex color
 */
export const lightenColor = (color: string, amount: number): string => {
  const clamp = (val: number) => Math.min(255, Math.max(0, val));

  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  r = clamp(r + Math.round(amount * 255));
  g = clamp(g + Math.round(amount * 255));
  b = clamp(b + Math.round(amount * 255));

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Darken a color by a percentage
 * @param color - Hex color code
 * @param amount - Amount to darken (0-1)
 * @returns Darkened hex color
 */
export const darkenColor = (color: string, amount: number): string => {
  return lightenColor(color, -amount);
};

// Export a default Color object with all color utilities
export default {
  ...BASE_COLORS,
  text: TEXT_COLORS,
  background: BACKGROUND_COLORS,
    gradient: Gradient,
  hexToRgba,
  lighten: lightenColor,
  darken: darkenColor,
};
