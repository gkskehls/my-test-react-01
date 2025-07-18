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
    const { showNoteNames, toggleNoteNames, guideMode, setGuideMode } = useSettings();
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

    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 768;

    // [수정] 데스크톱과 모바일의 위치 계산 로직을 분리합니다.
    const popoverStyle: React.CSSProperties = {};

    // 데스크톱일 경우에만 JS로 위치를 동적으로 계산합니다.
    if (!isMobile) {
        const rect = anchorEl.getBoundingClientRect();
        popoverStyle.top = `${rect.bottom + 8}px`;
        popoverStyle.right = `${window.innerWidth - rect.right}px`;
    }
    // 모바일에서는 인라인 스타일로 위치를 지정하지 않고, CSS 클래스에 위임합니다.

    const changeLanguage = (lang: 'ko' | 'en') => {
        i18n.changeLanguage(lang);
    };

    return (
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

                {/* 4. 가이드 모드 설정 */}
                <div className="setting-item-column">
                    <label>{t('settings.guideMode.title')}</label>
                    <div className="button-group-grid">
                        <button onClick={() => setGuideMode('full')} className={guideMode === 'full' ? 'active' : ''}>
                            {t('settings.guideMode.full')}
                        </button>
                        <button onClick={() => setGuideMode('sheet-only')} className={guideMode === 'sheet-only' ? 'active' : ''}>
                            {t('settings.guideMode.sheetOnly')}
                        </button>
                        <button onClick={() => setGuideMode('rhythm-only')} className={guideMode === 'rhythm-only' ? 'active' : ''}>
                            {t('settings.guideMode.rhythmOnly')}
                        </button>
                        <button onClick={() => setGuideMode('none')} className={guideMode === 'none' ? 'active' : ''}>
                            {t('settings.guideMode.none')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};