import React from 'react';
import { SongNote } from '../songs/twinkleTwinkle';
import './SheetMusic.css';

// 음표가 기준음(G4)으로부터 몇 칸 떨어져 있는지 계산하는 함수
const getNoteStepDifference = (note: string): number => {
    const noteSteps: { [key: string]: number } = {
        C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
    };
    const noteName = note.slice(0, 1);
    const octave = parseInt(note.slice(1, 2));

    // 기준점: G4
    const baseNoteStep = noteSteps['G'] + 4 * 7;
    const currentNoteStep = noteSteps[noteName] + octave * 7;

    return baseNoteStep - currentNoteStep;
};

interface SheetMusicProps {
    notes: SongNote[];
    currentNoteIndex?: number;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ notes, currentNoteIndex }) => {
    // JS에서의 너비 계산 로직을 완전히 제거합니다.

    return (
        <div
            className="sheet-music-wrapper"
            // CSS가 너비를 계산할 수 있도록 전체 음표 개수를 변수로 전달합니다.
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
                {notes.map((songNote, index) => {
                    const stepDifference = getNoteStepDifference(songNote.note);
                    return (
                        <div
                            // 스크롤 로직이 이 ID를 사용해 음표를 찾습니다.
                            id={`note-${index}`}
                            key={index}
                            className={`note ${index === currentNoteIndex ? 'highlighted' : ''}`}
                            style={{
                                // CSS가 위치를 계산하는데 필요한 변수들만 전달합니다.
                                '--step-difference': stepDifference,
                                '--note-index': index,
                            } as React.CSSProperties}
                        >
                            <div className="note-head" />
                            <div className="stem" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SheetMusic;