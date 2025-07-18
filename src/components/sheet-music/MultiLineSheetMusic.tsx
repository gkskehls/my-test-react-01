// src/components/sheet-music/MultiLineSheetMusic.tsx
import React, { useRef } from 'react';
import { Song } from '../../songs';
import SheetMusic from './SheetMusic';
import './MultiLineSheetMusic.css';
// [추가] 레이아웃 계산에 필요한 훅들을 임포트합니다.
import { useSheetMusicLayout } from '../../hooks/useSheetMusicLayout';
import { useLyricWidths } from '../../hooks/useLyricWidths';

interface MultiLineSheetMusicProps {
    song: Song;
    currentLineIndex?: number;
    noteIndexInLine?: number;
}

const MultiLineSheetMusic: React.FC<MultiLineSheetMusicProps> = ({ song, currentLineIndex, noteIndexInLine }) => {
    // [추가] 레이아웃 계산을 위한 로직을 추가합니다.
    const containerRef = useRef<HTMLDivElement>(null);
    const layout = useSheetMusicLayout(containerRef);
    const lyricWidths = useLyricWidths(song);

    return (
        // [수정] 최상위 div에 ref를 연결하여 컨테이너의 너비를 측정할 수 있도록 합니다.
        <div className="multi-line-sheet-container" ref={containerRef}>
            {song.lines.map((line, lineIndex) => (
                <div key={lineIndex} className="sheet-line-wrapper">
                    <SheetMusic
                        notes={line}
                        currentNoteIndex={lineIndex === currentLineIndex ? noteIndexInLine : undefined}
                        idPrefix={`${lineIndex}`}
                        // [추가] 계산된 layout과 lyricWidths를 SheetMusic 컴포넌트에 전달합니다.
                        layout={layout}
                        lyricWidths={lyricWidths}
                    />
                </div>
            ))}
        </div>
    );
};

export default MultiLineSheetMusic;
