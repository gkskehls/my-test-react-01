import React from 'react';
import { SongNote } from '../../songs';
import { getNoteStepDifference } from '../../lib/musicUtils';
import Note from './Note';
import './SheetMusic.css';

interface SheetMusicProps {
    notes: SongNote[];
    currentNoteIndex?: number;
    idPrefix?: string;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ notes, currentNoteIndex, idPrefix }) => {
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
                {/* 1. 음표 렌더링 */}
                {notes.map((songNote, index) => {
                    // === 수정: idPrefix 유무에 따라 ID와 key를 유연하게 생성합니다. ===
                    const noteId = idPrefix ? `${idPrefix}-${index}` : `${index}`;
                    const key = `note-${noteId}`;

                    return (
                        <Note
                            key={key}
                            id={noteId}
                            noteIndex={index}
                            stepDifference={getNoteStepDifference(songNote.note)}
                            isHighlighted={index === currentNoteIndex}
                            pitch={songNote.note}
                            duration={songNote.duration}
                        />
                    );
                })}
                {/* 2. 가사 렌더링 */}
                {notes.map((songNote, index) => {
                    // === 수정: key를 고유하게 만듭니다. ===
                    const lyricId = idPrefix ? `${idPrefix}-${index}` : `${index}`;
                    const key = `lyric-${lyricId}`;

                    return (
                        songNote.lyric && (
                            <span
                                key={key}
                                className="lyric"
                                style={{ '--note-index': index } as React.CSSProperties}
                            >
                                {songNote.lyric}
                            </span>
                        )
                    );
                })}
            </div>
        </div>
    );
};

export default SheetMusic;