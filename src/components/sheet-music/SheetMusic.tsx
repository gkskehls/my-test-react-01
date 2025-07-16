import React from 'react';
import { useTranslation } from 'react-i18next';
import { SongNote } from '../../songs';
import { getNoteStepDifference } from '../../lib/musicUtils';
import Note from './Note';
import './SheetMusic.css';

interface SheetMusicProps {
    notes: SongNote[];
    currentNoteIndex?: number;
    idPrefix?: string;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ notes, currentNoteIndex, idPrefix, }) => {
    const { t } = useTranslation();

    return (
        <div
            className="sheet-music-wrapper"
            style={{ '--note-count': notes.length } as React.CSSProperties}
        >
            <div className="clef">𝄞</div>
            <div className="staff">
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
                <div className="staff-line" />
            </div>
            <div className="notes-container">
                {notes.map((songNote, index) => {
                    // 음표와 가사에 사용할 고유 ID와 key를 생성합니다.
                    const noteId = idPrefix ? `${idPrefix}-${index}` : `${index}`;
                    const translatedLyric = songNote.lyricKey ? t(songNote.lyricKey) : null;

                    return (
                        // React.Fragment를 사용하여 음표와 가사를 하나의 그룹으로 묶습니다.
                        // 이렇게 하면 배열을 한 번만 순회하여 성능과 가독성을 높일 수 있습니다.
                        <React.Fragment key={`item-${noteId}`}>
                            <Note
                                id={noteId}
                                noteIndex={index}
                                stepDifference={getNoteStepDifference(songNote.note)}
                                isHighlighted={index === currentNoteIndex}
                                pitch={songNote.note}
                                duration={songNote.duration}
                            />
                            {translatedLyric && (
                                <span
                                    className="lyric"
                                    style={{ '--note-index': index } as React.CSSProperties}
                                >
                                    {translatedLyric}
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default SheetMusic;