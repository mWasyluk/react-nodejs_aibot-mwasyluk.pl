/**
 * Color utility functions for working with theme colors and opacity
 * 
 * These helpers solve the problem of appending hex opacity to theme colors
 * which doesn't work when palette values are objects (MUI theme structure).
 */

/**
 * Converts hex color to rgba with specified opacity
 * @param {string} hex - Hex color (e.g., '#1976D2')
 * @param {number} opacity - Opacity value between 0 and 1
 * @returns {string} RGBA color string
 */
export function hexToRgba(hex, opacity) {
    if (!hex || typeof hex !== 'string') {
        console.warn('hexToRgba: Invalid hex color', hex);
        return `rgba(0, 0, 0, ${opacity})`;
    }

    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Handle shorthand hex (e.g., #FFF)
    const fullHex = cleanHex.length === 3
        ? cleanHex.split('').map(char => char + char).join('')
        : cleanHex;

    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        console.warn('hexToRgba: Invalid hex format', hex);
        return `rgba(0, 0, 0, ${opacity})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Creates a color with alpha/opacity from theme color
 * Works with both string colors and MUI palette objects
 * 
 * @param {string|object} color - Color string or palette object with .main
 * @param {number} opacity - Opacity value between 0 and 1
 * @returns {string} RGBA color string
 */
export function alpha(color, opacity) {
    // Handle MUI palette objects (e.g., theme.palette.primary)
    const colorString = typeof color === 'object' && color?.main
        ? color.main
        : color;

    return hexToRgba(colorString, opacity);
}

/**
 * Shorthand opacity levels for common use cases
 * Maps descriptive names to opacity values
 */
export const opacityLevels = {
    // Backgrounds and surfaces
    subtle: 0.05,      // Very light background tint
    light: 0.1,        // Light background (10% = hex '1A')
    medium: 0.2,       // Medium overlay
    strong: 0.4,       // Strong overlay

    // Borders
    borderLight: 0.15,
    borderMedium: 0.25,
    borderStrong: 0.4,

    // Text
    textMuted: 0.6,
    textDisabled: 0.38,
    textSecondary: 0.7,

    // Hover/Focus states
    hover: 0.08,
    focus: 0.12,
    selected: 0.16,
    activated: 0.24,
};

/**
 * Pre-built alpha functions for common use cases
 * Use these instead of hardcoding hex opacity suffixes like '1A', '40', etc.
 */
export const withAlpha = {
    // Background variants
    subtle: (color) => alpha(color, opacityLevels.subtle),
    light: (color) => alpha(color, opacityLevels.light),
    medium: (color) => alpha(color, opacityLevels.medium),
    strong: (color) => alpha(color, opacityLevels.strong),

    // Border variants
    borderLight: (color) => alpha(color, opacityLevels.borderLight),
    borderMedium: (color) => alpha(color, opacityLevels.borderMedium),
    borderStrong: (color) => alpha(color, opacityLevels.borderStrong),

    // State variants
    hover: (color) => alpha(color, opacityLevels.hover),
    focus: (color) => alpha(color, opacityLevels.focus),
    selected: (color) => alpha(color, opacityLevels.selected),
    activated: (color) => alpha(color, opacityLevels.activated),
};
