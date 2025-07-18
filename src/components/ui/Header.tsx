// src/components/ui/Header.tsx
import React, { useState, useEffect, useRef, RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';
// [제거] ThemeToggleButton은 더 이상 헤더에서 직접 사용하지 않습니다.

interface HeaderProps {
    onSettingsClick: () => void;
    settingsButtonRef: RefObject<HTMLButtonElement>;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, settingsButtonRef }) => {
    const { t } = useTranslation();
    const mobileNavRef = useRef<HTMLElement>(null);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
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
    }, [isMobileMenuOpen]);


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

                {/* [수정] 헤더 컨트롤 영역을 단순화하여 설정 버튼만 남깁니다. */}
                <div className="header-controls">
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