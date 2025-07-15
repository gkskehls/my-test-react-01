import React from 'react';
import { SongNote } from '../../songs';
import { getNoteStepDifference } from '../../lib/musicUtils';
import Note from './Note';
import './SheetMusic.css';

interface SheetMusicProps {
    notes: SongNote[];
    currentNoteIndex?: number;
    idPrefix?: string; // === 추가: ID 접두사를 받기 위한 prop ===
}

const SheetMusic: React.FC<SheetMusicProps> = ({ notes, currentNoteIndex, idPrefix = '0' }) => {
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
                {/* 1. 음표만 먼저 렌더링합니다. */}
                {notes.map((songNote, index) => (
                    <Note
                        // === 수정: key와 id를 prefix와 조합하여 고유하게 만듭니다. ===
                        key={`${idPrefix}-note-${index}`}
                        id={`${idPrefix}-${index}`}
                        noteIndex={index}
                        stepDifference={getNoteStepDifference(songNote.note)}
                        isHighlighted={index === currentNoteIndex}
                        pitch={songNote.note}
                    />
                ))}
                {/* 2. 가사만 따로 모아서 렌더링합니다. */}
                {notes.map((songNote, index) => (
                    songNote.lyric && (
                        <span
                            key={`lyric-${idPrefix}-${index}`}
                            className="lyric"
                            style={{ '--note-index': index } as React.CSSProperties}
                        >
                            {songNote.lyric}
                        </span>
                    )
                ))}
            </div>
        </div>
    );
};

export default SheetMusic;