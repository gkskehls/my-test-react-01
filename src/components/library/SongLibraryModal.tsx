// src/components/library/SongLibraryModal.tsx
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Song } from '../../songs'; // 정적 SONG_LIST import를 제거합니다.
import SongCard from './SongCard';
import './SongLibraryModal.css';

interface SongLibraryModalProps {
    songs: Song[]; // 부모로부터 동적 곡 목록을 받도록 prop을 추가합니다.
    onClose: () => void;
    onSongSelect: (song: Song) => void;
}

const SongLibraryModal: React.FC<SongLibraryModalProps> = ({ songs, onClose, onSongSelect }) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);

    const handleSongCardClick = (song: Song) => {
        onSongSelect(song);
        onClose();
    };

    // 키보드 접근성(Escape 키) 및 포커스 관리를 위한 Effect
    useEffect(() => {
        // Escape 키로 모달을 닫는 기능 추가
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // 모달이 열릴 때, 모달 내부의 첫 번째 버튼에 포커스 설정
        // 이는 키보드 사용성과 스크린 리더 사용성을 크게 향상시킵니다.
        const focusableElement = modalRef.current?.querySelector('button');
        focusableElement?.focus();

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // ReactDOM.createPortal을 사용하여 모달을 body의 최상단에 렌더링합니다.
    // 이는 z-index나 부모의 CSS 스타일에 의한 문제를 원천적으로 방지합니다.
    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal-header">
                    <h2 id="modal-title">{t('sheetMusic.selectSong')}</h2>
                    {/* aria-label도 번역 키를 사용하면 더 좋습니다. */}
                    <button className="modal-close-button" onClick={onClose} aria-label={t('common.close')}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="song-grid">
                        {songs.map(song => ( // 정적 SONG_LIST 대신 props로 받은 songs를 사용합니다.
                            <SongCard
                                key={song.id}
                                song={song}
                                onSelect={() => handleSongCardClick(song)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default SongLibraryModal;