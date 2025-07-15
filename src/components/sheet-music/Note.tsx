import React from 'react';
import './SheetMusic.css'; // 같은 폴더 내의 CSS 참조

interface NoteProps {
    id: string;
    noteIndex: number;
    stepDifference: number;
    isHighlighted: boolean;
}

const Note: React.FC<NoteProps> = ({ id, noteIndex, stepDifference, isHighlighted }) => {
    const noteStyle: React.CSSProperties = {
        '--note-index': noteIndex,
        '--step-difference': stepDifference,
    } as React.CSSProperties;

    const noteClasses = `note ${isHighlighted ? 'highlighted' : ''}`;

    return (
        <div id={id} className={noteClasses} style={noteStyle}>
            <div className="note-head"></div>
            <div className="stem"></div>
        </div>
    );
};

export default Note;