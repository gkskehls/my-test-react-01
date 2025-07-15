// src/pages/SheetMusicPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import SheetMusic from '../components/sheet-music/SheetMusic';
import SongSelector from '../components/ui/SongSelector';
import { Song, SONG_LIST } from '../songs';
import './SheetMusicPage.css';

interface SheetMusicPageProps {
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const SheetMusicPage: React.FC<SheetMusicPageProps> = ({ song, onSongChange }) => {
    const { t } = useTranslation();

    return (
        <div className="sheet-music-page-container">
            <h2>{t('sheetMusicTitle')}</h2>
            <SongSelector
                songs={SONG_LIST}
                currentSongId={song.id}
                onSongChange={onSongChange}
                label={t('sheetMusic.selectSong')}
            />
            {/* ▼▼▼ 이 부분이 수정되었습니다 ▼▼▼ */}
            <div className="sheet-music-lines-wrapper">
                {/* song.lines 배열을 순회하며 각 줄마다 별도의 SheetMusic 컴포넌트를 렌더링합니다. */}
                {song.lines.map((line, index) => (
                    <SheetMusic
                        key={`line-${index}`}
                        notes={line}
                        // 각 컴포넌트 내부의 노트 ID가 중복되지 않도록 고유한 접두사를 전달합니다.
                        idPrefix={`line-${index}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SheetMusicPage;