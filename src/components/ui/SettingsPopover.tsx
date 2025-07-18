// src/components/ui/SettingsPopover.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import './SettingsPopover.css';

interface SettingsPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null; // 팝오버를 위치시킬 기준이 되는 요소
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({ isOpen, onClose, anchorEl }) => {
    const { t } = useTranslation();
    const { showNoteNames, toggleNoteNames } = useSettings();
    const popoverRef = useRef<HTMLDivElement>(null);

    // 팝오버 외부를 클릭했을 때 닫히도록 하는 로직
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // 팝오버 자신이나, 팝오버를 연 버튼을 클릭한게 아니라면 닫기
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

    // 기준 요소(anchorEl)를 바탕으로 팝오버 위치 계산
    const rect = anchorEl.getBoundingClientRect();
    const popoverStyle: React.CSSProperties = {
        top: `${rect.bottom + 8}px`, // 버튼 바로 아래에 약간의 간격을 두고 위치
        left: `${rect.left + rect.width / 2}px`, // 버튼의 가로 중앙에 위치
    };

    return (
        <div ref={popoverRef} className="settings-popover" style={popoverStyle}>
            <div className="popover-content">
                <div className="popover-item">
                    <label>
                        <span>{t('settings.showNoteNames', '계이름 표시')}</span>
                        <input
                            type="checkbox"
                            checked={showNoteNames}
                            onChange={toggleNoteNames}
                        />
                    </label>
                </div>
                {/* 나중에 '메트로놈 소리' 등 다른 설정을 여기에 쉽게 추가할 수 있습니다. */}
            </div>
        </div>
    );
};