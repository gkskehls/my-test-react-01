// src/components/piano/Piano.tsx
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext'; // [추가]
import './Piano.css';

interface KeyProps {
    note: string;
    type: 'white' | 'black';
    style?: React.CSSProperties;
    isActive: boolean;
    isGuide: boolean;
    onNoteDown: (note: string) => void;
    onNoteUp: (note: string) => void;
}

const Key = React.memo(({ note, type, style, isActive, isGuide, onNoteDown, onNoteUp }: KeyProps) => {
    const { t } = useTranslation();
    const { showNoteNames } = useSettings(); // [추가] 설정 값 가져오기

    const noteName = note.replace(/\d/g, '');
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

    const ariaLabel = `${translatedNoteName} ${note.slice(-1)}`;

    return (
        <button
            className={`key ${type}-key ${isActive ? 'active' : ''} ${isGuide && !isActive ? 'guide' : ''}`}
            data-note={note}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            style={style}
            aria-label={ariaLabel}
        >
            {/* [수정] showNoteNames가 true일 때만 계이름을 표시합니다. */}
            {showNoteNames && <span className="key-note-name">{translatedNoteName}</span>}
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
    guideNote?: string;
}

const Piano = ({ numOctaves = 2, onNotePlayed, guideNote }: PianoProps) => {
    const synth = useRef<Tone.PolySynth | null>(null);
    const isAudioUnlocked = useRef(false);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);

    useEffect(() => {
        synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
        synth.current.set({
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1,
            },
        });

        return () => {
            synth.current?.dispose();
        };
    }, []);

    const handleNoteDown = useCallback(async (note: string) => {
        if (activeNotes.includes(note) || !synth.current) return;

        if (!isAudioUnlocked.current) {
            await Tone.start();
            isAudioUnlocked.current = true;
        }

        synth.current.triggerAttack(note);

        setActiveNotes(prev => [...prev, note]);
        if (onNotePlayed) {
            onNotePlayed(note);
        }
    }, [activeNotes, onNotePlayed]);

    const handleNoteUp = useCallback((note: string) => {
        if (!synth.current) return;
        synth.current.triggerRelease(note);
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
                if (noteName !== 'E' && noteName !== 'B') {
                    blackKey = `${noteName}#${octave}`;
                }
                groups.push({ whiteKey, blackKey });
            }
        }
        return groups;
    }, [numOctaves]);

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
                        isGuide={whiteKey === guideNote}
                        onNoteDown={handleNoteDown}
                        onNoteUp={handleNoteUp}
                    />
                    {blackKey && (
                        <Key
                            note={blackKey}
                            type="black"
                            isActive={activeNotes.includes(blackKey)}
                            isGuide={blackKey === guideNote}
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