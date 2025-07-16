/// <reference types="vite/client" />
import React from 'react';
import { useTranslation } from 'react-i18next';
import './SheetMusic.css';
import type { NoteDuration } from '../../songs/types';

interface NoteProps {
    id: string;
    noteIndex: number;
    stepDifference: number;
    isHighlighted: boolean;
    pitch: string;
    duration: NoteDuration; // 8분음표, 4분음표, 2분음표, 온음표 등
}

// React.memo를 사용하여 props가 변경되지 않은 음표의 불필요한 리렌더링을 방지합니다. (성능 최적화)
const Note = React.memo(({ id, noteIndex, stepDifference, isHighlighted, pitch, duration }: NoteProps) => {
    const { t } = useTranslation();

    // CSS 변수를 사용하여 음표의 동적 위치를 지정합니다.
    // --note-index: 음표의 가로 위치 (순서)
    // --step-difference: 음표의 세로 위치 (음높이)
    const noteStyle: React.CSSProperties & {
        '--note-index': number;
        '--step-difference': number;
    } = {
        '--note-index': noteIndex,
        '--step-difference': stepDifference,
    };

    // 조건부 클래스를 더 명확하고 확장 가능하게 관리합니다.
    const noteClasses = [
        'note',
        isHighlighted && 'highlighted',
        // 음표 길이에 따른 클래스를 추가합니다. (예: duration-q, duration-h)
        `duration-${duration}`,
    ].filter(Boolean).join(' ');

    // i18n을 사용하여 음이름을 번역합니다.
    const noteName = pitch.replace(/\d/g, ''); // 'C#4' -> 'C#'
    const translationKey = `notes.${noteName.replace('#', 'sharp')}`;

    // 언어 설정에 관계없이 항상 번역된 음이름을 가져옵니다.
    // (영어: C, D, E... / 한국어: 도, 레, 미...)
    const displayName = t(translationKey, noteName);

    return (
        <div id={`note-${id}`} className={noteClasses} style={noteStyle}>
            <div className="note-head">
                {displayName && <span className="note-syllable">{displayName}</span>}
            </div>
            {/* 온음표('w')는 기둥(stem)이 없으므로 렌더링하지 않습니다. */}
            {duration !== 'w' && <div className="stem"></div>}
            {/* 8분음표('8')는 깃발(flag)을 가집니다. */}
            {duration === '8' && <div className="flag"></div>}
        </div>
    );
});

export default Note;