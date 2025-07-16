// src/components/library/SongLibraryModal.tsx
import React from 'react';
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

    const handleSongCardClick = (song: Song) => {
        onSongSelect(song);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('sheetMusic.selectSong')}</h2>
                    <button className="modal-close-button" onClick={onClose} aria-label="Close">
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
};

export default SongLibraryModal;