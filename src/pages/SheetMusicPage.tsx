import React from 'react';
import MultiLineSheetMusic from '../components/MultiLineSheetMusic';
import SongSelector from '../components/SongSelector';
import { Song } from '../songs';

interface SheetMusicPageProps {
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const SheetMusicPage: React.FC<SheetMusicPageProps> = ({ song, onSongChange }) => {
    return (
        <div>
            <h1>{song.title}</h1>
            <SongSelector selectedSongId={song.id} onSongChange={onSongChange} />
            <MultiLineSheetMusic song={song} />
        </div>
    );
};

export default SheetMusicPage;