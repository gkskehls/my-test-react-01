import React from 'react';
import { Song } from '../../songs'; // 경로 수정
import SheetMusic from './SheetMusic';
import './MultiLineSheetMusic.css';

interface MultiLineSheetMusicProps {
    song: Song;
}

const MultiLineSheetMusic: React.FC<MultiLineSheetMusicProps> = ({ song }) => {
    return (
        <div className="multi-line-sheet-container">
            {song.lines.map((line, index) => (
                <div key={index} className="sheet-line-wrapper">
                    <SheetMusic notes={line} />
                </div>
            ))}
        </div>
    );
};

export default MultiLineSheetMusic;