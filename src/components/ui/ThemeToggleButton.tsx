// src/components/ui/ThemeToggleButton.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggleButton.css';

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle-button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <span className="icon-wrapper">
                <span className="sun-icon">☀️</span>
                <span className="moon-icon">🌙</span>
            </span>
        </button>
    );
};

export default ThemeToggleButton;