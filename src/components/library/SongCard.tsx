// src/components/library/SongCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../../songs';
import './SongCard.css';

interface SongCardProps {
    song: Song;
    onSelect: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect }) => {
    const { t } = useTranslation();

    return (
        <button className="song-card" onClick={onSelect}>
            <div className="song-card-artwork">
                <span>🎵</span>
            </div>
            <div className="song-card-title">{t(song.titleKey)}</div>
        </button>
    );
};

export default SongCard;