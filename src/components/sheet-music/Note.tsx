import React from 'react';
import './SheetMusic.css';

// 영어 음이름을 한국어 계이름으로 변환하는 맵
const noteNameToSyllable: { [key: string]: string } = {
    'C': '도', 'D': '레', 'E': '미', 'F': '파', 'G': '솔', 'A': '라', 'B': '시',
};

interface NoteProps {
    id: string;
    noteIndex: number;
    stepDifference: number;
    isHighlighted: boolean;
    pitch: string;
    // lyric prop 제거
}

const Note: React.FC<NoteProps> = ({ id, noteIndex, stepDifference, isHighlighted, pitch }) => {
    const noteStyle: React.CSSProperties = {
        '--note-index': noteIndex,
        '--step-difference': stepDifference,
    } as React.CSSProperties;

    const noteClasses = `note ${isHighlighted ? 'highlighted' : ''}`;

    const baseNoteName = pitch.slice(0, 1);
    const syllable = noteNameToSyllable[baseNoteName];

    return (
        <div id={`note-${id}`} className={noteClasses} style={noteStyle}>
            <div className="note-head">
                {syllable && <span className="note-syllable">{syllable}</span>}
            </div>
            <div className="stem"></div>
            {/* 가사 렌더링 로직 제거 */}
        </div>
    );
};

export default Note;