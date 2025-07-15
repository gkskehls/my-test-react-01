// src/pages/PracticePage.tsx
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // 1. useTranslation 훅 import
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song } from '../songs';
import './PracticePage.css';

interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const { t } = useTranslation(); // 2. 훅 사용
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [isShaking, setIsShaking] = useState(false);

    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    useEffect(() => {
        setCurrentNoteIndex(0);
        setIsShaking(false);
    }, [song]);

    useEffect(() => {
        const currentNoteElement = document.getElementById(`note-${currentNoteIndex}`);
        if (currentNoteElement) {
            currentNoteElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [currentNoteIndex]);

    const targetNote = flatNotes[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= flatNotes.length;

    const handleNotePlayed = useCallback((playedNote: string) => {
        if (isShaking || isSongFinished) return;

        if (playedNote === targetNote?.note) {
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
            }, 500);
        }
    }, [targetNote, isSongFinished, isShaking]);

    return (
        <div className="practice-container">
            {/* 3. 하드코딩된 텍스트를 t 함수로 교체 */}
            <h1>{t('practicePageTitle', { title: song.title })}</h1>
            <div className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''} ${isShaking ? 'shake' : ''}`}>
                {isSongFinished ? (
                    <div className="congrats-message">
                        <h2>🎉 {t('congratsMessage')} 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>{t('retryButton')}</button>
                    </div>
                ) : (
                    <SheetMusic
                        notes={flatNotes}
                        currentNoteIndex={currentNoteIndex}
                    />
                )}
            </div>
            <div className="piano-wrapper">
                <Piano numOctaves={2} onNotePlayed={handleNotePlayed} />
            </div>
        </div>
    );
};

export default PracticePage;