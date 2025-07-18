// src/components/sheet-music/SheetMusic.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SongNote } from '../../songs';
import { getNoteStepDifference } from '../../lib/musicUtils';
import Note from './Note';
import './SheetMusic.css';
import { LayoutMetrics } from '../../hooks/useSheetMusicLayout'; // [추가] 타입 임포트

interface SheetMusicProps {
    notes: SongNote[];
    currentNoteIndex?: number;
    idPrefix?: string;
    // [추가] 레이아웃 계산을 위해 아래 props를 받도록 수정합니다.
    layout: LayoutMetrics;
    lyricWidths: Record<string, number>;
}

// [추가] 각 음표의 실제 시각적 너비를 계산하는 헬퍼 함수
// SheetMusicPage.tsx에 있던 것을 가져와 이 컴포넌트가 직접 사용하도록 합니다.
const getNoteWidth = (note: SongNote, layout: LayoutMetrics, lyricWidths: Record<string, number>): number => {
    if (note.lyricKey && lyricWidths[note.lyricKey]) {
        const LYRIC_PADDING = 8; // 가사 좌우 여백
        return Math.max(layout.noteSpacing, lyricWidths[note.lyricKey] + LYRIC_PADDING);
    }
    return layout.noteSpacing;
};


const SheetMusic: React.FC<SheetMusicProps> = ({ notes, currentNoteIndex, idPrefix, layout, lyricWidths }) => {
    const { t } = useTranslation();

    // [수정] useMemo를 사용해 각 음표의 누적 left 위치와 전체 너비를 계산합니다.
    const { notePositions, totalWidth } = useMemo(() => {
        const positions: number[] = [];
        let currentOffset = layout.staffPaddingLeft; // 왼쪽 여백부터 시작

        notes.forEach(note => {
            positions.push(currentOffset);
            currentOffset += getNoteWidth(note, layout, lyricWidths); // 현재 음표의 너비를 더해 다음 위치를 계산
        });

        const finalWidth = currentOffset; // 마지막 음표의 끝 위치가 전체 너비가 됨 (오른쪽 여백은 필요시 여기에 더함)

        return { notePositions: positions, totalWidth: finalWidth };
    }, [notes, layout, lyricWidths]);


    // [수정] 컴포넌트의 전체 너비를 CSS가 아닌 계산된 totalWidth로 설정합니다.
    return (
        <div
            className="sheet-music-wrapper"
            style={{ width: `${totalWidth}px` }}
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
                    const noteId = idPrefix ? `${idPrefix}-${index}` : `${index}`;
                    const translatedLyric = songNote.lyricKey ? t(songNote.lyricKey) : null;
                    const leftPosition = notePositions[index]; // 계산된 위치 사용

                    return (
                        <React.Fragment key={`item-${noteId}`}>
                            <Note
                                id={noteId}
                                noteIndex={index}
                                stepDifference={getNoteStepDifference(songNote.note)}
                                isHighlighted={index === currentNoteIndex}
                                pitch={songNote.note}
                                duration={songNote.duration}
                                // [수정] CSS 변수 대신 직접 left 스타일을 적용합니다.
                                style={{ left: `${leftPosition}px` }}
                            />
                            {translatedLyric && (
                                <span
                                    className="lyric"
                                    // [수정] 가사에도 동일하게 계산된 위치를 적용합니다.
                                    style={{ left: `${leftPosition}px` }}
                                >
                                    {translatedLyric}
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default SheetMusic;