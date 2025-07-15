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

// Key 컴포넌트를 포인터 이벤트로 수정합니다.
const Key: React.FC<KeyProps> = ({ note, type, style, isActive, onNoteDown, onNoteUp }) => {
    const noteName = note.slice(0, -1);

    const handlePointerDown = (e: React.PointerEvent) => {
        // 브라우저의 기본 동작(스크롤 등)을 막습니다.
        e.preventDefault();
        // 포인터를 캡처하여 해당 건반이 모든 후속 이벤트를 받도록 합니다.
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        onNoteDown(note);
    };

    const handlePointerUpOrLeave = (e: React.PointerEvent) => {
        // 캡처된 포인터가 있는 경우에만 해제합니다.
        if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
        onNoteUp(note);
    };

    return (
        <div
            className={`key ${type}-key ${isActive ? 'active' : ''}`}
            data-note={note}
            // 기존의 onMouseDown, onTouchStart 등을 onPointer* 이벤트로 교체합니다.
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            style={style}
        >
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