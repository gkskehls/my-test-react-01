import React from 'react';
import { SongNote } from '../../songs'; // 경로 수정
import { getNoteStepDifference } from '../../lib/musicUtils'; // 경로 수정
import Note from './Note';
import './SheetMusic.css';

interface SheetMusicProps {
    notes: SongNote[];
    currentNoteIndex?: number;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ notes, currentNoteIndex }) => {
    return (
        <div
            className="sheet-music-wrapper"
            style={{ '--note-count': notes.length } as React.CSSProperties}
        >
            <div className="clef">𝄞</div>
            <div className="staff">
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
            </div>
            <div className="notes-container">
                {notes.map((songNote, index) => (
                    <Note
                        key={index}
                        id={`note-${index}`}
                        noteIndex={index}
                        stepDifference={getNoteStepDifference(songNote.note)}
                        isHighlighted={index === currentNoteIndex}
                        pitch={songNote.note} // Note 컴포넌트에 pitch 값 전달
                    />
                ))}
            </div>
        </div>
    );
};

export default SheetMusic;