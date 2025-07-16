// src/components/ui/SongSelector.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../../songs'; // Song 타입만 import 합니다.
// import './SongSelector.css'; // CSS 파일이 있다면 그대로 둡니다.

// 1. props 인터페이스를 부모 컴포넌트와 일치하도록 수정합니다.
interface SongSelectorProps {
    songs: Song[]; // 부모로부터 곡 목록을 받습니다.
    currentSongId: string; // prop 이름을 일관성 있게 맞춥니다.
    onSongChange: (newSong: Song) => void;
    label: string; // 다국어 라벨을 받습니다.
}

const SongSelector: React.FC<SongSelectorProps> = ({
                                                       songs,
                                                       currentSongId,
                                                       onSongChange,
                                                       label,
                                                   }) => {
    const { t } = useTranslation();

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSongId = event.target.value;
        // 2. 내부 SONG_LIST 대신 props로 받은 songs 배열을 사용합니다.
        const newSong = songs.find(song => song.id === newSongId);
        if (newSong) {
            onSongChange(newSong);
        }
    };

    return (
        <div className="song-selector-container">
            {/* 3. 하드코딩된 텍스트 대신 props로 받은 label을 사용합니다. */}
            <label htmlFor="song-select">{label}: </label>
            <select id="song-select" value={currentSongId} onChange={handleSelect}>
                {/* 4. 내부 SONG_LIST 대신 props로 받은 songs 배열로 목록을 만듭니다. */}
                {songs.map(song => (
                    <option key={song.id} value={song.id}>
                        {t(song.titleKey)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SongSelector;