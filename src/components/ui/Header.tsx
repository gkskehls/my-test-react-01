// src/components/ui/Header.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    // 1. 모바일 메뉴의 열림/닫힘 상태를 관리할 state 추가
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const changeLanguage = (lng: 'ko' | 'en') => {
        i18n.changeLanguage(lng);
        setLangDropdownOpen(false);
        // 모바일 메뉴에서도 언어 변경 후 메뉴가 닫히도록 합니다.
        setMobileMenuOpen(false);
    };

    // 2. 메뉴 링크나 로고를 클릭하면 모바일 메뉴가 닫히도록 처리하는 함수
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // 3. 모바일 메뉴가 열렸을 때 배경 스크롤을 막는 로직 추가
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // 컴포넌트가 사라질 때 원래대로 되돌리는 정리(cleanup) 함수
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);


    return (
        <header className="app-header">
            <NavLink to="/" className="logo" onClick={closeMobileMenu}>My Piano</NavLink>

            {/* 4. 햄버거 아이콘 버튼 (모바일 화면에서만 보임) */}
            <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="메뉴 열기/닫기"
            >
                <div className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {/* 5. isMobileMenuOpen 상태에 따라 'open' 클래스를 동적으로 부여 */}
            <nav className={isMobileMenuOpen ? 'open' : ''}>
                <NavLink to="/practice" onClick={closeMobileMenu}>{t('nav.practice')}</NavLink>
                <NavLink to="/sheet-music" onClick={closeMobileMenu}>{t('nav.sheetMusic')}</NavLink>
                <NavLink to="/profile" onClick={closeMobileMenu}>{t('nav.profile')}</NavLink>

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