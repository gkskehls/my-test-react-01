import React from 'react';
import { useTranslation } from 'react-i18next';
import './SheetMusic.css';

interface NoteProps {
    id: string;
    noteIndex: number;
    stepDifference: number;
    isHighlighted: boolean;
    pitch: string;
}

// React.FC 대신, props를 직접 타이핑하는 현대적인 함수 컴포넌트 선언 방식을 사용합니다.
const Note = ({ id, noteIndex, stepDifference, isHighlighted, pitch }: NoteProps) => {
    const { t, i18n } = useTranslation();

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
    const noteClasses = ['note', isHighlighted && 'highlighted']
        .filter(Boolean)
        .join(' ');

    // i18n을 사용하여 음이름을 번역합니다.
    const noteName = pitch.replace(/\d/g, ''); // 'C#4' -> 'C#'
    const translationKey = `notes.${noteName.replace('#', 'sharp')}`;

    // 기존처럼 한국어일 때만 계이름을 표시하도록 합니다.
    // 영어일 때도 표시하고 싶다면 이 조건문을 제거하면 됩니다.
    const displayName = i18n.language === 'ko' ? t(translationKey, noteName) : null;

    return (
        <div id={`note-${id}`} className={noteClasses} style={noteStyle}>
            <div className="note-head">
                {displayName && <span className="note-syllable">{displayName}</span>}
            </div>
            <div className="stem"></div>
        </div>
    );
};

export default Note;