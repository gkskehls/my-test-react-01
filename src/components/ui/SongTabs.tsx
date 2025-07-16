// src/components/ui/SongTabs.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../../songs';
import './SongTabs.css';

interface SongTabsProps {
    songs: Song[];
    currentSongId: string;
    onSongChange: (newSong: Song) => void;
}

const SongTabs: React.FC<SongTabsProps> = ({ songs, currentSongId, onSongChange }) => {
    const { t } = useTranslation();

    return (
        <div className="song-tabs-container">
            {songs.map(song => (
                <button
                    key={song.id}
                    className={`song-tab ${song.id === currentSongId ? 'active' : ''}`}
                    onClick={() => onSongChange(song)}
                    aria-pressed={song.id === currentSongId}
                >
                    {t(song.titleKey)}
                </button>
            ))}
        </div>
    );
};

export default SongTabs;