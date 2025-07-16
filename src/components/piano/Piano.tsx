import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import { useTranslation } from 'react-i18next';
import './Piano.css';

// Key 컴포넌트는 변경 없습니다.
interface KeyProps {
    note: string;
    type: 'white' | 'black';
    style?: React.CSSProperties;
    isActive: boolean;
    onNoteDown: (note: string) => void;
    onNoteUp: (note: string) => void;
}

// 컴포넌트 선언 방식을 최신 스타일로 변경하고 이벤트 핸들러 타입을 명확히 합니다.
// ✨ 1. React.memo로 컴포넌트를 감싸 불필요한 리렌더링을 방지합니다.
const Key = React.memo(({ note, type, style, isActive, onNoteDown, onNoteUp }: KeyProps) => {
    const { t } = useTranslation();

    // 'C#4' -> 'C#', 'C4' -> 'C' 와 같이 옥타브를 제거하여 순수 음이름을 추출합니다.
    const noteName = note.replace(/\d/g, '');
    // i18next 키 형식에 맞게 '#'을 'sharp'로 변경합니다. (예: 'notes.Csharp')
    const translationKey = `notes.${noteName.replace('#', 'sharp')}`;
    const translatedNoteName = t(translationKey, noteName);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onNoteDown(note);
    };

    const handlePointerUpOrLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        onNoteUp(note);
    };

    // ✨ 2. 스크린 리더가 읽을 명확한 ARIA 레이블을 생성합니다. (예: "C# 4")
    const ariaLabel = `${translatedNoteName} ${note.slice(-1)}`;

    return (
        // ✨ 3. <div>를 <button>으로 변경하여 접근성과 시맨틱을 개선합니다.
        // 참고: Piano.css에서 button의 기본 스타일(border, background 등)을 리셋해야 할 수 있습니다.
        <button
            className={`key ${type}-key ${isActive ? 'active' : ''}`}
            data-note={note}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            style={style}
            aria-label={ariaLabel}
        >
            {/* 번역된 음이름을 표시합니다. 번역 키가 없으면 noteName을 그대로 보여줍니다. */}
            <span className="key-note-name">{translatedNoteName}</span>
        </button>
    );
});

const KEY_MAP: { [key: string]: string } = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
    'k': 'C5', 'o': 'C#5', 'l': 'D5', 'p': 'D#5', ';': 'E5',
};

interface PianoProps {
    numOctaves?: number;
    onNotePlayed?: (note: string) => void;
}

// 컴포넌트 선언 방식을 최신 스타일로 통일합니다.
const Piano = ({ numOctaves = 2, onNotePlayed }: PianoProps) => {
    // ... (다른 state와 hook들은 변경 없음) ...
    const synth = useRef<Tone.Synth | null>(null);
    const isAudioUnlocked = useRef(false);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);

    useEffect(() => {
        synth.current = new Tone.Synth().toDestination();
        return () => {
            synth.current?.dispose();
        };
    }, []);

    const playNote = useCallback(async (note: string) => {
        if (!synth.current) return;
        if (!isAudioUnlocked.current) {
            await Tone.start();
            isAudioUnlocked.current = true;
        }
        synth.current.triggerAttackRelease(note, '0.5');
    }, []);

    const handleNoteDown = useCallback((note: string) => {
        if (activeNotes.includes(note)) return;
        playNote(note);
        setActiveNotes(prev => [...prev, note]);
        if (onNotePlayed) {
            onNotePlayed(note);
        }
    }, [activeNotes, playNote, onNotePlayed]);

    const handleNoteUp = useCallback((note: string) => {
        setActiveNotes(prev => prev.filter(n => n !== note));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return;
            const note = KEY_MAP[event.key.toLowerCase()];
            if (note) handleNoteDown(note);
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            const note = KEY_MAP[event.key.toLowerCase()];
            if (note) handleNoteUp(note);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleNoteDown, handleNoteUp]);

    const pianoKeyGroups = useMemo(() => {
        const groups: { whiteKey: string; blackKey: string | null }[] = [];
        const whiteNoteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const startOctave = 4;

        for (let octave = startOctave; octave < startOctave + numOctaves; octave++) {
            for (const noteName of whiteNoteNames) {
                const whiteKey = `${noteName}${octave}`;
                let blackKey = null;
                // E와 B 다음에는 검은 건반이 없습니다.
                if (noteName !== 'E' && noteName !== 'B') {
                    blackKey = `${noteName}#${octave}`;
                }
                groups.push({ whiteKey, blackKey });
            }
        }
        return groups;
    }, [numOctaves]);

    // CSS 변수로 흰 건반의 개수를 전달하여 반응형 너비를 계산합니다.
    // ✨ 이 부분이 TypeScript에 사용자 정의 속성을 알려주어 타입 오류를 해결하는 핵심입니다.
    const pianoStyle: React.CSSProperties & {
        '--num-white-keys'?: number;
    } = {
        '--num-white-keys': pianoKeyGroups.length,
    };

    return (
        <div className="piano" style={pianoStyle}>
            {pianoKeyGroups.map(({ whiteKey, blackKey }) => (
                <div key={whiteKey} className="key-container">
                    <Key
                        note={whiteKey}
                        type="white"
                        isActive={activeNotes.includes(whiteKey)}
                        onNoteDown={handleNoteDown}
                        onNoteUp={handleNoteUp}
                    />
                    {blackKey && (
                        <Key
                            note={blackKey}
                            type="black"
                            isActive={activeNotes.includes(blackKey)}
                            onNoteDown={handleNoteDown}
                            onNoteUp={handleNoteUp}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Piano;