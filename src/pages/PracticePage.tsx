// src/pages/PracticePage.tsx
import { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
// [제거] import { SettingsPopover } from '../components/ui/SettingsPopover';
import { Song } from '../songs';
import './PracticePage.css';
import { useSheetMusicLayout } from '../hooks/useSheetMusicLayout';
import { useLyricWidths } from '../hooks/useLyricWidths';

const SongLibraryModal = lazy(() => import('../components/library/SongLibraryModal'));

interface PracticePageProps {
    songs: Song[];
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ songs, song, onSongChange }) => {
    const { t } = useTranslation();
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    // [제거] 팝오버 상태와 버튼 ref를 제거합니다.
    // const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    // const settingsButtonRef = useRef<HTMLButtonElement>(null);

    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const layout = useSheetMusicLayout(wrapperRef);
    const lyricWidths = useLyricWidths(song);

    const handleSongChange = (newSong: Song) => {
        onSongChange(newSong);
    };

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
            {/* [수정] 헤더에서 설정 버튼을 제거합니다. */}
            <div className="practice-header">
                <button className="song-selector-button" onClick={() => setIsLibraryOpen(true)}>
                    <span>{t(song.titleKey)}</span>
                    <span className="dropdown-icon">▼</span>
                </button>
            </div>

            {/* [제거] 팝오버 컴포넌트 렌더링 코드를 제거합니다. */}

            <div ref={wrapperRef} className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''} ${isShaking ? 'shake' : ''}`}>
                {isSongFinished ? (
                    <div className="congrats-message">
                        <h2>🎉 {t('congratsMessage')} 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>{t('retryButton')}</button>
                    </div>
                ) : (
                    <SheetMusic
                        notes={flatNotes}
                        currentNoteIndex={currentNoteIndex}
                        layout={layout}
                        lyricWidths={lyricWidths}
                    />
                )}
            </div>
            <div className="piano-wrapper">
                <Piano
                    numOctaves={2}
                    onNotePlayed={handleNotePlayed}
                    guideNote={targetNote?.note}
                />
            </div>

            <Suspense fallback={null}>
                {isLibraryOpen && (
                    <SongLibraryModal
                        songs={songs}
                        currentSong={song}
                        onClose={() => setIsLibraryOpen(false)}
                        onSongSelect={handleSongChange}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default PracticePage;