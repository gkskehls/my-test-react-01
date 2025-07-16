// src/components/library/SongLibraryModal.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Song, SONG_LIST } from '../../songs';
import SongCard from './SongCard';
import './SongLibraryModal.css';

interface SongLibraryModalProps {
    onClose: () => void;
    onSongSelect: (song: Song) => void;
}

const SongLibraryModal: React.FC<SongLibraryModalProps> = ({ onClose, onSongSelect }) => {
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
                        {SONG_LIST.map(song => (
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