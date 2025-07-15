// src/components/ui/Header.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);

    const changeLanguage = (lng: 'ko' | 'en') => {
        i18n.changeLanguage(lng);
        setLangDropdownOpen(false); // 언어 변경 후 드롭다운 닫기
    };

    return (
        <header className="app-header">
            <NavLink to="/" className="logo">My Piano</NavLink>
            <nav>
                <NavLink to="/practice">{t('nav.practice')}</NavLink>
                <NavLink to="/sheet-music">{t('nav.sheetMusic')}</NavLink>
                <NavLink to="/profile">{t('nav.profile')}</NavLink>

                {/* 언어 변경 드롭다운 */}
                <div className="language-selector">
                    <button
                        className="language-button"
                        onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                    >
                        {i18n.language.toUpperCase()}
                        <span className="arrow-down"></span>
                    </button>
                    {isLangDropdownOpen && (
                        <ul className="language-dropdown">
                            <li onClick={() => changeLanguage('en')}>EN</li>
                            <li onClick={() => changeLanguage('ko')}>KO</li>
                        </ul>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;