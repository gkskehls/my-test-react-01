import React from 'react';
import { Song, SONG_LIST } from '../../songs'; // 경로 수정
import './SongSelector.css';

interface SongSelectorProps {
    selectedSongId: string;
    onSongChange: (newSong: Song) => void;
}

const SongSelector: React.FC<SongSelectorProps> = ({ selectedSongId, onSongChange }) => {
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSongId = event.target.value;
        const newSong = SONG_LIST.find(song => song.id === newSongId);
        if (newSong) {
            onSongChange(newSong);
        }
    };

    return (
        <div className="song-selector-container">
            <label htmlFor="song-select">악보 선택: </label>
            <select id="song-select" value={selectedSongId} onChange={handleSelect}>
                {SONG_LIST.map(song => (
                    <option key={song.id} value={song.id}>
                        {song.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SongSelector;