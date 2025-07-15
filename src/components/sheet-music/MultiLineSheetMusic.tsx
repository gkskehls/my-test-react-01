import React from 'react';
import { Song } from '../../songs';
import SheetMusic from './SheetMusic';
import './MultiLineSheetMusic.css';

interface MultiLineSheetMusicProps {
    song: Song;
    currentLineIndex: number;
    noteIndexInLine: number;
}

const MultiLineSheetMusic: React.FC<MultiLineSheetMusicProps> = ({ song, currentLineIndex, noteIndexInLine }) => {
    return (
        <div className="multi-line-sheet-container">
            {song.lines.map((line, lineIndex) => (
                <div key={lineIndex} className="sheet-line-wrapper">
                    <SheetMusic
                        notes={line}
                        // 현재 라인에만 하이라이트 인덱스를 전달합니다.
                        currentNoteIndex={lineIndex === currentLineIndex ? noteIndexInLine : undefined}
                        // id가 중복되지 않도록 lineIndex를 prefix로 사용합니다.
                        idPrefix={`${lineIndex}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default MultiLineSheetMusic;