import React from 'react';
import './SheetMusic.css';

// 음이름의 기본 타입을 정의하여 타입 안정성을 높입니다.
type BaseNoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// 영어 음이름을 한국어 계이름으로 변환하는 맵
// 상수는 대문자 스네이크 케이스로 명명하고, Record 타입을 사용하여 키를 제한합니다.
const NOTE_NAME_TO_SYLLABLE: Record<BaseNoteName, string> = {
    'C': '도', 'D': '레', 'E': '미', 'F': '파', 'G': '솔', 'A': '라', 'B': '시',
};

interface NoteProps {
    id: string;
    noteIndex: number;
    stepDifference: number;
    isHighlighted: boolean;
    pitch: string;
}

// React.FC 대신, props를 직접 타이핑하는 현대적인 함수 컴포넌트 선언 방식을 사용합니다.
const Note = ({ id, noteIndex, stepDifference, isHighlighted, pitch }: NoteProps) => {
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

    // pitch 문자열(예: 'C4', 'G5')에서 첫 글자(음이름)를 추출합니다.
    // 현재 구현은 샵(#)이나 플랫(b)을 고려하지 않습니다.
    const baseNoteName = pitch.charAt(0) as BaseNoteName;
    const syllable = NOTE_NAME_TO_SYLLABLE[baseNoteName];

    return (
        <div id={`note-${id}`} className={noteClasses} style={noteStyle}>
            <div className="note-head">
                {syllable && <span className="note-syllable">{syllable}</span>}
            </div>
            <div className="stem"></div>
        </div>
    );
};

export default Note;