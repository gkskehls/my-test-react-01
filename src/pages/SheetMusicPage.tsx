import React from 'react';
import MultiLineSheetMusic from '../components/sheet-music/MultiLineSheetMusic';
import SongSelector from '../components/ui/SongSelector';
import { Song } from '../songs';
import './SheetMusicPage.css';

interface SheetMusicPageProps {
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const SheetMusicPage: React.FC<SheetMusicPageProps> = ({ song, onSongChange }) => {
    return (
        <div className="sheet-music-page-container">
            <h1>악보 보기</h1>
            <SongSelector selectedSongId={song.id} onSongChange={onSongChange} />
            <MultiLineSheetMusic song={song} />
        </div>
    );
};

export default SheetMusicPage;