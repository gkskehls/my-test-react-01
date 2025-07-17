// src/components/library/SongLibraryModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Song } from '../../songs'; // 정적 SONG_LIST import를 제거합니다.
import SongCard from './SongCard';
import './SongLibraryModal.css';

interface SongLibraryModalProps {
    songs: Song[]; // 부모로부터 동적 곡 목록을 받도록 prop을 추가합니다.
    currentSong: Song; // 현재 선택된 곡 정보를 받습니다.
    onClose: () => void;
    onSongSelect: (song: Song) => void;
}

const SongLibraryModal: React.FC<SongLibraryModalProps> = ({ songs, currentSong, onClose, onSongSelect }) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);

    // [추가] 현재 선택된 카테고리를 관리하는 상태. 'All'이 기본값입니다.
    const [selectedCategory, setSelectedCategory] = useState('All');

    // [추가] 전체 곡 목록에서 중복되지 않는 카테고리 목록을 생성합니다. (e.g., ["All", "동요", "클래식"])
    // useMemo를 사용해 songs prop이 바뀔 때만 재계산합니다.
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(songs.map(s => t(s.categoryKey)))];
        return ['All', ...uniqueCategories];
    }, [songs, t]);

    // [추가] 선택된 카테고리에 따라 보여줄 곡 목록을 필터링합니다.
    const filteredSongs = useMemo(() => (selectedCategory === 'All' ? songs : songs.filter(s => t(s.categoryKey) === selectedCategory)), [songs, selectedCategory, t]);

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
                    {/* [추가] 카테고리 필터(태그) 영역 */}
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {/* 'All'은 공통 번역 키를 사용하고, 나머지는 카테고리명을 그대로 표시합니다. */}
                                {category === 'All' ? t('common.all') : category}
                            </button>
                        ))}
                    </div>
                    <div className="song-grid">
                        {/* [수정] 전체 songs 배열 대신 필터링된 filteredSongs 배열을 사용합니다. */}
                        {filteredSongs.map(song => (
                            <SongCard
                                key={song.id}
                                song={song}
                                isActive={song.id === currentSong.id}
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