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
            <SheetMusic notes={song.lines.flat()} />
        </div>
    );
};

export default SheetMusicPage;