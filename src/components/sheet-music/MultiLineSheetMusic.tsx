import React from 'react';
import { Song } from '../../songs';
import SheetMusic from './SheetMusic';
import './MultiLineSheetMusic.css';

interface MultiLineSheetMusicProps {
    song: Song;
    // === 수정: prop들을 선택적(optional)으로 변경합니다. (?) 추가 ===
    currentLineIndex?: number;
    noteIndexInLine?: number;
}

const MultiLineSheetMusic: React.FC<MultiLineSheetMusicProps> = ({ song, currentLineIndex, noteIndexInLine }) => {
    return (
        <div className="multi-line-sheet-container">
            {song.lines.map((line, lineIndex) => (
                <div key={lineIndex} className="sheet-line-wrapper">
                    <SheetMusic
                        notes={line}
                        // 현재 라인에만 하이라이트 인덱스를 전달합니다.
                        // currentLineIndex가 undefined이면 이 조건은 항상 false가 되어 아무것도 하이라이트되지 않습니다.
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