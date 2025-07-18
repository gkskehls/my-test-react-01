// src/components/ui/Header.tsx
import React, { useState, useEffect, useRef, RefObject } from 'react'; // RefObject 추가
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';
import ThemeToggleButton from './ThemeToggleButton';

// [추가] Header가 받을 props 타입을 정의합니다.
interface HeaderProps {
    onSettingsClick: () => void;
    settingsButtonRef: RefObject<HTMLButtonElement>;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, settingsButtonRef }) => { // [수정] props를 받도록 변경
    const { t, i18n } = useTranslation();
    const langSelectorRef = useRef<HTMLDivElement>(null);
    const mobileNavRef = useRef<HTMLElement>(null);
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const changeLanguage = (lng: 'ko' | 'en') => {
        i18n.changeLanguage(lng);
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (langSelectorRef.current && !langSelectorRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false);
            }
            if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.mobile-menu-toggle')) {
                setMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isMobileMenuOpen, isLangDropdownOpen]);


    return (
        <header className="app-header">
            <NavLink to="/" className="logo" onClick={closeMobileMenu}>My Piano</NavLink>

            <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="main-nav"
                aria-label={t(isMobileMenuOpen ? 'nav.closeMenu' : 'nav.openMenu')}
            >
                <div className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            <nav id="main-nav" ref={mobileNavRef} className={isMobileMenuOpen ? 'open' : ''}>
                <NavLink to="/practice" onClick={closeMobileMenu}>{t('nav.practice')}</NavLink>
                <NavLink to="/sheet-music" onClick={closeMobileMenu}>{t('nav.sheetMusic')}</NavLink>
                <NavLink to="/profile" onClick={closeMobileMenu}>{t('nav.profile')}</NavLink>

                {/* [수정] 언어, 테마, 설정 버튼을 그룹으로 묶어 정렬을 용이하게 합니다. */}
                <div className="header-controls">
                    {/* 언어 변경 드롭다운 */}
                    <div className="language-selector" ref={langSelectorRef}>
                        <button
                            className="language-button"
                            onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                            aria-haspopup="listbox"
                            aria-expanded={isLangDropdownOpen}
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

                    {/* 테마 변경 버튼 */}
                    <ThemeToggleButton />

                    {/* [추가] 연습 페이지의 설정 버튼을 이곳으로 이동시킵니다. */}
                    <button
                        ref={settingsButtonRef}
                        className="settings-button icon-button"
                        onClick={onSettingsClick}
                        aria-label={t('settings.title', '설정')}
                        title={t('settings.title', '설정')}
                    >
                        ⚙️
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;