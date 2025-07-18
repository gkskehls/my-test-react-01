// src/components/ui/Header.tsx
import React, { useState, useEffect, useRef, RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

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
            const target = event.target as HTMLElement;

            // [수정] 클릭된 지점이 설정 팝업 내부인지 확인합니다.
            const isClickInsidePopover = target.closest('.settings-popover');

            // 만약 팝업 내부를 클릭했다면, 메뉴를 닫지 않고 즉시 함수를 종료합니다.
            if (isClickInsidePopover) {
                return;
            }

            // 기존 로직: 팝업 내부가 아닐 경우에만, 메뉴 바깥 클릭 여부를 판단합니다.
            if (mobileNavRef.current && !mobileNavRef.current.contains(target) && !target.closest('.mobile-menu-toggle')) {
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