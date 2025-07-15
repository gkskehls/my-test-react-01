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
    pitch: string; // 음높이(e.g., "C4")를 받기 위한 prop 추가
}

const Note: React.FC<NoteProps> = ({ id, noteIndex, stepDifference, isHighlighted, pitch }) => {
    const noteStyle: React.CSSProperties = {
        '--note-index': noteIndex,
        '--step-difference': stepDifference,
    } as React.CSSProperties;

    const noteClasses = `note ${isHighlighted ? 'highlighted' : ''}`;

    // 'C#4' -> 'C' 와 같이 #과 옥타브를 제거하여 기본 음이름을 얻습니다.
    const baseNoteName = pitch.slice(0, 1);
    const syllable = noteNameToSyllable[baseNoteName];

    return (
        <div id={id} className={noteClasses} style={noteStyle}>
            <div className="note-head">
                {/* 음표 머리 안에 계이름 표시 */}
                {syllable && <span className="note-syllable">{syllable}</span>}
            </div>
            <div className="stem"></div>
        </div>
    );
};

export default Note;