// src/components/sheet-music/Note.tsx
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
    duration: NoteDuration;
    // [추가] 부모 컴포넌트로부터 동적 스타일을 전달받기 위한 속성
    style?: React.CSSProperties;
}

// React.memo를 사용하여 props가 변경되지 않은 음표의 불필요한 리렌더링을 방지합니다. (성능 최적화)
const Note = React.memo(({ id, noteIndex, stepDifference, isHighlighted, pitch, duration, style }: NoteProps) => {
    const { t } = useTranslation();

    // [수정] 컴포넌트 내부 스타일과 외부에서 주입된 스타일을 병합합니다.
    // 이렇게 하면 기존의 세로 위치 계산은 유지하면서, 외부에서 가로 위치(left)를 제어할 수 있습니다.
    const finalNoteStyle: React.CSSProperties & {
        '--note-index': number;
        '--step-difference': number;
    } = {
        '--note-index': noteIndex,
        '--step-difference': stepDifference,
        ...style, // 부모로부터 받은 style 객체를 여기에 병합합니다.
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
        <div id={`note-${id}`} className={noteClasses} style={finalNoteStyle}>
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