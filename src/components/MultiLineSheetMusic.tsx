import React from 'react';
import { Song } from '../songs';
import SheetMusic from './SheetMusic';
import './MultiLineSheetMusic.css';

interface MultiLineSheetMusicProps {
    song: Song;
    // notesPerLine prop은 더 이상 필요 없으므로 삭제합니다.
}

const MultiLineSheetMusic: React.FC<MultiLineSheetMusicProps> = ({ song }) => {
    // useMemo와 chunk를 만드는 로직을 모두 삭제합니다.

    return (
        <div className="multi-line-sheet-container">
            {/* song.notes 대신 song.lines를 직접 map으로 순회합니다. */}
            {song.lines.map((line, index) => (
                <div key={index} className="sheet-line-wrapper">
                    {/* 각 줄(line)을 SheetMusic 컴포넌트에 전달합니다. */}
                    <SheetMusic notes={line} />
                </div>
            ))}
        </div>
    );
};

export default MultiLineSheetMusic;