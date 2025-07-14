import React from 'react';
import SheetMusic from '../components/SheetMusic';
import SongSelector from '../components/SongSelector'; // 1. SongSelector import
import { Song } from '../songs'; // 2. Song 타입 import
import './SheetMusicPage.css';

// 3. 페이지가 받을 props 타입 정의
interface SheetMusicPageProps {
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const SheetMusicPage: React.FC<SheetMusicPageProps> = ({ song, onSongChange }) => {
    return (
        <div className="sheet-music-container">
            {/* 4. 제목을 동적으로 표시 */}
            <h1>{song.title}</h1>

            {/* 5. 노래 선택 컴포넌트 추가 */}
            <SongSelector selectedSongId={song.id} onSongChange={onSongChange} />

            <div className="sheet-image-wrapper">
                {/* 6. 선택된 노래의 악보 데이터를 전달 */}
                <SheetMusic song={song.notes} />
            </div>
        </div>
    );
};

export default SheetMusicPage;
