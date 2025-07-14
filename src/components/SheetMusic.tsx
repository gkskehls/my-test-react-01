import React from 'react';
import { SongNote } from '../songs/twinkleTwinkle';
import './SheetMusic.css';

// 음표의 수직 위치를 계산하는 헬퍼 함수
// (G4 음을 기준으로 각 음표가 얼마나 떨어져 있는지 계산합니다)
const getNotePosition = (note: string): number => {
    const noteSteps: { [key: string]: number } = {
        C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
    };
    // 'C4'에서 'C'와 '4'를 분리합니다.
    const noteName = note.slice(0, 1);
    const octave = parseInt(note.slice(1, 2));

    // 기준점: G4는 오선지의 두 번째 줄에 위치합니다. (top: 68px)
    const baseNoteStep = noteSteps['G'] + 4 * 7;
    const baseTopPosition = 68;

    const currentNoteStep = noteSteps[noteName] + octave * 7;

    // 기준점과의 차이를 계산하여 최종 위치를 결정합니다.
    const stepDifference = baseNoteStep - currentNoteStep;
    const stepHeight = 8; // 한 칸(줄-칸 사이)의 높이

    return baseTopPosition + stepDifference * stepHeight;
};

interface SheetMusicProps {
    song: SongNote[];
    currentNoteIndex?: number;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ song, currentNoteIndex }) => {
    return (
        <div className="sheet-music-wrapper">
            {/* 높은음자리표 */}
            <div className="clef">𝄞</div>

            {/* 오선지 */}
            <div className="staff">
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
            </div>

            {/* 음표들 */}
            <div className="notes-container">
                {song.map((songNote, index) => (
                    <div
                        key={index}
                        className={`note ${index === currentNoteIndex ? 'highlighted' : ''}`}
                        style={{
                            // getNotePosition 함수로 계산된 수직 위치
                            top: `${getNotePosition(songNote.note)}px`,
                            // 음표들을 수평으로 나열
                            left: `${60 + index * 45}px`,
                        }}
                    >
                        <div className="note-head" />
                        <div className="stem" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SheetMusic;