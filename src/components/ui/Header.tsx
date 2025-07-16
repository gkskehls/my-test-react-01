// src/components/ui/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    // 각 드롭다운/메뉴의 DOM 요소를 참조하기 위해 ref를 생성합니다.
    const langSelectorRef = useRef<HTMLDivElement>(null);
    const mobileNavRef = useRef<HTMLElement>(null);
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 언어가 변경될 때마다 HTML 문서의 lang 속성을 업데이트합니다.
    useEffect(() => {
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const changeLanguage = (lng: 'ko' | 'en') => {
        i18n.changeLanguage(lng);
        // 모든 메뉴를 닫습니다.
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    // 메뉴 링크나 로고를 클릭하면 모바일 메뉴가 닫히도록 처리하는 함수
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // 모바일 메뉴가 열렸을 때 배경 스크롤을 막고, 외부 클릭 시 메뉴를 닫는 로직
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            // 언어 선택 메뉴 외부 클릭 감지
            if (langSelectorRef.current && !langSelectorRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false);
            }
            // 모바일 메뉴 외부 클릭 감지 (햄버거 버튼 자체는 제외)
            if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.mobile-menu-toggle')) {
                setMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // 외부 클릭 이벤트 리스너 추가
        document.addEventListener('mousedown', handleOutsideClick);

        // 컴포넌트가 언마운트되거나 의존성이 변경될 때 정리(cleanup) 함수 실행
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('mousedown', handleOutsideClick);
        };
        // isMobileMenuOpen 상태가 바뀔 때마다 스크롤 잠금/해제 로직이 실행됩니다.
        // isLangDropdownOpen은 외부 클릭을 감지하기 위해 의존성 배열에 추가합니다.
    }, [isMobileMenuOpen, isLangDropdownOpen]);


    return (
        <header className="app-header">
            <NavLink to="/" className="logo" onClick={closeMobileMenu}>My Piano</NavLink>

            {/* 4. 햄버거 아이콘 버튼 (모바일 화면에서만 보임) */}
            <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="main-nav"
                aria-label={t(isMobileMenuOpen ? 'nav.closeMenu' : 'nav.openMenu', 'Toggle navigation')}
            >
                <div className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {/* 5. isMobileMenuOpen 상태에 따라 'open' 클래스를 동적으로 부여 */}
            <nav id="main-nav" ref={mobileNavRef} className={isMobileMenuOpen ? 'open' : ''}>
                <NavLink to="/practice" onClick={closeMobileMenu}>{t('nav.practice')}</NavLink>
                <NavLink to="/sheet-music" onClick={closeMobileMenu}>{t('nav.sheetMusic')}</NavLink>
                <NavLink to="/profile" onClick={closeMobileMenu}>{t('nav.profile')}</NavLink>

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
            </nav>
        </header>
    );
};

export default Header;