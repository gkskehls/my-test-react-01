// src/components/sheet-music/Note.tsx
/// <reference types="vite/client" />
import React from 'react';
import { useTranslation } from 'react-i18next';
import './SheetMusic.css';
import type { NoteDuration } from '../../songs/types';
import { useSettings } from '../../context/SettingsContext';

interface NoteProps {
    id: string;
    noteIndex: number;
    stepDifference: number;
    isHighlighted: boolean;
    pitch: string;
    duration: NoteDuration;
    style?: React.CSSProperties;
}

const Note = React.memo(({ id, noteIndex, stepDifference, isHighlighted, pitch, duration, style }: NoteProps) => {
    const { t } = useTranslation();
    const { showNoteNames } = useSettings();

    const finalNoteStyle: React.CSSProperties & {
        '--note-index': number;
        '--step-difference': number;
    } = {
        '--note-index': noteIndex,
        '--step-difference': stepDifference,
        ...style,
    };

    const noteClasses = [
        'note',
        isHighlighted && 'highlighted',
        `duration-${duration}`,
    ].filter(Boolean).join(' ');

    const noteName = pitch.replace(/\d/g, '');
    const translationKey = `notes.${noteName.replace('#', 'sharp')}`;
    const displayName = t(translationKey, noteName);

    return (
        // [수정] 불필요한 'note-' 접두사를 제거하고 전달받은 id를 그대로 사용합니다.
        <div id={id} className={noteClasses} style={finalNoteStyle}>
            <div className="note-head">
                {showNoteNames && displayName && <span className="note-syllable">{displayName}</span>}
            </div>
            {duration !== 'w' && <div className="stem"></div>}
            {duration === '8' && <div className="flag"></div>}
        </div>
    );
});

export default Note;