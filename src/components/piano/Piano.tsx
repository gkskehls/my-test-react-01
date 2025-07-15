// 코드는 이전과 동일하며, 경로 이동만 반영됩니다.
// (이전 답변의 Piano.tsx 코드와 동일)
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import './Piano.css';

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

    // "C4"에서 "C" 또는 "C#" 처럼 옥타브를 제외한 음이름만 추출합니다.
    const noteName = note.slice(0, -1);

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
            {/* 건반에 음이름을 표시하는 span 태그 추가 */}
            <span className="key-note-name">{noteName}</span>
        </div>
    );
};



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
                    const leftPosition = whiteKeyIndex * 60 - 19; // 위치 조정
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
            {pianoKeys.filter(key => key.type === 'white').map(keyProps => (
                <Key {...keyProps} key={keyProps.note} isActive={activeNotes.includes(keyProps.note)} onNoteDown={handleNoteDown} onNoteUp={handleNoteUp} />
            ))}
            {pianoKeys.filter(key => key.type === 'black').map(keyProps => (
                <Key {...keyProps} key={keyProps.note} isActive={activeNotes.includes(keyProps.note)} onNoteDown={handleNoteDown} onNoteUp={handleNoteUp} />
            ))}
        </div>
    );
};

export default Piano;