// src/components/Piano.tsx

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import './Piano.css';

// --- Key 컴포넌트 (변경 없음) ---
interface KeyProps {
    note: string;
    type: 'white' | 'black';
    style?: React.CSSProperties;
    isActive: boolean;
    onNoteDown: (note: string) => void;
    onNoteUp: (note: string) => void;
}

const Key: React.FC<KeyProps> = ({ note, type, style, isActive, onNoteDown, onNoteUp }) => {
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        onNoteDown(note);
    };

    return (
        <div
            className={`key ${type}-key ${isActive ? 'active' : ''}`}
            data-note={note}
            onMouseDown={() => onNoteDown(note)}
            onMouseUp={() => onNoteUp(note)}
            onMouseLeave={() => onNoteUp(note)}
            onTouchStart={handleTouchStart}
            onTouchEnd={() => onNoteUp(note)}
            style={style}
        >
        </div>
    );
};


// --- Piano 컴포넌트 (수정됨) ---

const KEY_MAP: { [key: string]: string } = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
    'k': 'C5', 'o': 'C#5', 'l': 'D5', 'p': 'D#5', ';': 'E5',
};

interface PianoProps {
    numOctaves?: number;
    onNotePlayed?: (note: string) => void;
}

const Piano: React.FC<PianoProps> = ({ numOctaves = 2, onNotePlayed }) => {
    const synth = useRef<Tone.Synth | null>(null);
    // 1. 오디오가 활성화(잠금 해제)되었는지 추적하기 위한 ref 추가
    const isAudioUnlocked = useRef(false);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);

    useEffect(() => {
        synth.current = new Tone.Synth().toDestination();
        return () => {
            synth.current?.dispose();
        };
    }, []);

    // 2. playNote 함수를 더 안정적으로 수정
    const playNote = useCallback(async (note: string) => {
        if (!synth.current) return;

        // 오디오가 아직 잠금 해제되지 않았다면, 첫 터치 시에만 실행
        if (!isAudioUnlocked.current) {
            await Tone.start();
            isAudioUnlocked.current = true; // 잠금 해제되었음을 기록
        }

        // 소리 재생
        synth.current.triggerAttackRelease(note, '0.5');
    }, []); // 이 함수는 이제 의존성이 없습니다.

    const handleNoteDown = useCallback((note: string) => {
        // 이미 눌린 건반은 다시 처리하지 않음
        if (activeNotes.includes(note)) {
            return;
        }
        // 소리 재생과 시각 효과를 동시에 처리
        playNote(note);
        setActiveNotes(prev => [...prev, note]);
        // 3. 건반을 누를 때마다 부모에게 알려주는 코드를 추가합니다.
        if (onNotePlayed) {
            onNotePlayed(note);
        }
    }, [activeNotes, playNote, onNotePlayed]); // activeNotes에 의존하여 항상 최신 상태를 참조

    const handleNoteUp = useCallback((note: string) => {
        setActiveNotes(prev => prev.filter(n => n !== note));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return;
            const note = KEY_MAP[event.key.toLowerCase()];
            if (note) {
                handleNoteDown(note);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const note = KEY_MAP[event.key.toLowerCase()];
            if (note) {
                handleNoteUp(note);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleNoteDown, handleNoteUp]);

    const pianoKeys = useMemo(() => {
        const keys: { note: string; type: 'white' | 'black'; style?: React.CSSProperties }[] = [];
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const startOctave = 4;
        let whiteKeyIndex = 0;

        for (let octave = startOctave; octave < startOctave + numOctaves; octave++) {
            for (const noteName of noteNames) {
                const note = `${noteName}${octave}`;
                const isBlackKey = noteName.includes('#');
                const keyInfo: { note: string; type: 'white' | 'black'; style?: React.CSSProperties } = {
                    note,
                    type: isBlackKey ? 'black' : 'white',
                };
                if (isBlackKey) {
                    const leftPosition = whiteKeyIndex * 60;
                    keyInfo.style = { left: `${leftPosition}px` };
                } else {
                    whiteKeyIndex++;
                }
                keys.push(keyInfo);
            }
        }
        return keys;
    }, [numOctaves]);

    return (
        <div className="piano">
            {pianoKeys
                .filter(key => key.type === 'white')
                .map(({ note, type }) => (
                    <Key
                        key={note} note={note} type={type}
                        isActive={activeNotes.includes(note)}
                        onNoteDown={handleNoteDown}
                        onNoteUp={handleNoteUp}
                    />
                ))}
            {pianoKeys
                .filter(key => key.type === 'black')
                .map(({ note, type, style }) => (
                    <Key
                        key={note} note={note} type={type} style={style}
                        isActive={activeNotes.includes(note)}
                        onNoteDown={handleNoteDown}
                        onNoteUp={handleNoteUp}
                    />
                ))}
        </div>
    );
};

export default Piano;