// src/pages/PracticePage.tsx
import { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song } from '../songs';
import './PracticePage.css';
import { useSheetMusicLayout } from '../hooks/useSheetMusicLayout';
import { useLyricWidths } from '../hooks/useLyricWidths';
import { useSettings } from '../context/SettingsContext'; // [추가]

const SongLibraryModal = lazy(() => import('../components/library/SongLibraryModal'));

interface PracticePageProps {
    songs: Song[];
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ songs, song, onSongChange }) => {
    const { t } = useTranslation();
    const { guideMode } = useSettings(); // [추가] 설정 컨텍스트에서 가이드 모드를 가져옵니다.
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
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
    }, [song, guideMode]); // [수정] 가이드 모드가 변경될 때도 초기화합니다.

    // ... (useEffect for scrollIntoView)

    const targetNote = flatNotes[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= flatNotes.length;

    const handleNotePlayed = useCallback((playedNote: string) => {
        // [수정] '리듬만' 또는 '끄기' 모드에서는 정답 체크 로직을 건너뜁니다.
        if (guideMode === 'rhythm-only' || guideMode === 'none') return;

        if (isShaking || isSongFinished) return;

        if (playedNote === targetNote?.note) {
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
            }, 500);
        }
    }, [targetNote, isSongFinished, isShaking, guideMode]); // [수정] 의존성 배열에 guideMode 추가

    // [추가] 가이드 모드에 따라 Piano와 SheetMusic에 전달할 props를 결정합니다.
    const pianoGuideNote = guideMode === 'full' ? targetNote?.note : undefined;
    const sheetMusicHighlightIndex = (guideMode === 'full' || guideMode === 'sheet-only') ? currentNoteIndex : -1;

    return (
        <div className="practice-container">
            <div className="practice-header">
                <button className="song-selector-button" onClick={() => setIsLibraryOpen(true)}>
                    <span>{t(song.titleKey)}</span>
                    <span className="dropdown-icon">▼</span>
                </button>
            </div>

            <div ref={wrapperRef} className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''} ${isShaking ? 'shake' : ''}`}>
                {isSongFinished && (guideMode === 'full' || guideMode === 'sheet-only') ? (
                    <div className="congrats-message">
                        <h2>🎉 {t('practice.congratsMessage')} 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>{t('practice.retryButton')}</button>
                    </div>
                ) : (
                    <SheetMusic
                        notes={flatNotes}
                        currentNoteIndex={sheetMusicHighlightIndex} // [수정]
                        layout={layout}
                        lyricWidths={lyricWidths}
                    />
                )}
            </div>
            <div className="piano-wrapper">
                <Piano
                    numOctaves={2}
                    onNotePlayed={handleNotePlayed}
                    guideNote={pianoGuideNote} // [수정]
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