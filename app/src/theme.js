import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    shadows: {
        primary: '0px 4px 32px -8px #1976D2',
    },
    palette: {
        mode: 'light',

        // Kolory główne
        primary: {
            main: '#1976D2',
            light: '#42A5F5',
            dark: '#1565C0',
            contrastText: '#FFFFFF',
            contrastTextInactive: '#c2c2c2ff',
        },

        // Kolory drugorzędne
        secondary: {
            main: '#FFE083',
            light: '#FFEB99',
            dark: '#E6C76E',
            contrastText: '#1A1A2E',
            contrastTextInactive: '#24242eff',
        },

        // Kolory statusów
        error: {
            main: '#D32F2F',
            light: '#FFEBEE',
            dark: '#C62828',
        },
        success: {
            main: '#2E7D32',
            light: '#E8F5E9',
            dark: '#1B5E20',
        },
        warning: {
            main: '#ED6C02',
            light: '#FFF3E0',
            dark: '#E65100',
        },
        info: {
            main: '#0288D1',
            light: '#E1F5FE',
            dark: '#01579B',
        },

        // Tła
        background: {
            default: '#E8EEF4',
            paper: '#FFFFFF',
        },

        // Tekst
        text: {
            primary: '#1A1A2E',
            secondary: '#5A6A7A',
        },

        // Separatory
        divider: '#E0E7EF',

        // ========================================
        // Custom palette extensions
        // ========================================
        border: '#D0D9E3',
        borderLight: '#E8EEF4',
        surface: '#FFFFFF88',
        surfaceAlt: '#F0F4F8',
        codeBackground: '#F5F5F5',
        inputBackground: '#FFFFFF',
        inputBorder: '#D0D9E3',
        gradientStart: '#E8EEF4',
        gradientEnd: '#D4E0EC',
    },
});

// ============================================
// Dark Theme
// ============================================

export const darkTheme = createTheme({
    shadows: {
        primary: '0px 7px 8px -4px #4DA3FF',
    },
    palette: {
        mode: 'dark',

        // Kolory główne
        primary: {
            main: '#4DA3FF',
            light: '#6BB5FF',
            dark: '#2D8BF0',
            contrastText: '#0A0A14',
            contrastTextInactive: '#32323dff',
        },

        // Kolory drugorzędne
        secondary: {
            main: '#FFE083',
            light: '#FFEB99',
            dark: '#E6C76E',
            contrastText: '#0A0A14',
            contrastTextInactive: '#32323dff',
        },

        // Kolory statusów
        error: {
            main: '#FF6B6B',
            light: '#2A1A1A',
            dark: '#E64545',
        },
        success: {
            main: '#4CAF50',
            light: '#1A2A1A',
            dark: '#388E3C',
        },
        warning: {
            main: '#FFB74D',
            light: '#2A2A1A',
            dark: '#F9A825',
        },
        info: {
            main: '#4FC3F7',
            light: '#1A2A2A',
            dark: '#29B6F6',
        },

        // Tła
        background: {
            default: '#0A0A14',
            paper: '#141428',
        },

        // Tekst
        text: {
            primary: '#E8EEF4',
            secondary: '#8A9CB5',
        },

        // Separatory
        divider: '#252540',

        // ========================================
        // Custom palette extensions
        // ========================================
        border: '#2A2A45',
        borderLight: '#1F1F38',
        surface: '#14142888',
        surfaceAlt: '#1A1A35',
        codeBackground: '#1E1E35',
        inputBackground: '#1A1A30',
        inputBorder: '#2A2A45',
        gradientStart: '#0A0A14',
        gradientEnd: '#0F1525',
        gradientGlow: 'radial-gradient(ellipse at center top, rgba(77, 163, 255, 0.15) 0%, transparent 50%)',
    },
});
