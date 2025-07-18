// src/components/ui/SettingsPopover.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import './SettingsPopover.css';

interface SettingsPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({ isOpen, onClose, anchorEl }) => {
    const { t, i18n } = useTranslation();
    const { showNoteNames, toggleNoteNames } = useSettings();
    const { theme, setTheme } = useTheme();
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                anchorEl &&
                !anchorEl.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorEl]);

    if (!isOpen || !anchorEl) {
        return null;
    }

    const rect = anchorEl.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 768;

    // [수정] 데스크톱과 모바일의 위치 계산 로직을 분리합니다.
    const popoverStyle: React.CSSProperties = {
        top: `${rect.bottom + 8}px`,
    };

    // 데스크톱일 경우에만 right 속성을 동적으로 계산합니다.
    if (!isMobile) {
        popoverStyle.right = `${windowWidth - rect.right}px`;
    }

    const changeLanguage = (lang: 'ko' | 'en') => {
        i18n.changeLanguage(lang);
    };

    return (
        // [수정] 모바일 여부에 따라 클래스를 동적으로 추가합니다.
        <div
            ref={popoverRef}
            className={`settings-popover ${isMobile ? 'is-mobile' : ''}`}
            style={popoverStyle}
        >
            <h3 className="popover-title">{t('settings.title')}</h3>
            <div className="popover-content">
                {/* 1. 테마 설정 */}
                <div className="setting-item">
                    <label>{t('settings.theme')}</label>
                    <div className="button-group">
                        <button onClick={() => setTheme('light')} className={theme === 'light' ? 'active' : ''}>
                            {t('settings.light')}
                        </button>
                        <button onClick={() => setTheme('dark')} className={theme === 'dark' ? 'active' : ''}>
                            {t('settings.dark')}
                        </button>
                    </div>
                </div>

                {/* 2. 계이름 표시 설정 */}
                <div className="setting-item">
                    <label htmlFor="note-name-toggle">{t('settings.showNoteNames')}</label>
                    <label className="switch">
                        <input
                            id="note-name-toggle"
                            type="checkbox"
                            checked={showNoteNames}
                            onChange={toggleNoteNames}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                {/* 3. 언어 설정 */}
                <div className="setting-item">
                    <label>{t('settings.language')}</label>
                    <div className="button-group">
                        <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>
                            EN
                        </button>
                        <button onClick={() => changeLanguage('ko')} className={i18n.language === 'ko' ? 'active' : ''}>
                            KO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};