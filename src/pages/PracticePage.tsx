// src/pages/PracticePage.tsx
import { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song } from '../songs';
import './PracticePage.css';
import { useSheetMusicLayout } from '../hooks/useSheetMusicLayout';
import { useLyricWidths } from '../hooks/useLyricWidths';
import { useSettings } from '../context/SettingsContext';

const SongLibraryModal = lazy(() => import('../components/library/SongLibraryModal'));

interface PracticePageProps {
    songs: Song[];
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ songs, song, onSongChange }) => {
    const { t } = useTranslation();
    const { guideMode } = useSettings();
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
    }, [song, guideMode]);

    // [핵심 수정 1] 악보 스크롤 로직: 가이드 모드와 상관없이 항상 동작합니다.
    // currentNoteIndex가 변경될 때마다 실행되어, 현재 음표를 화면 중앙으로 스크롤합니다.
    useEffect(() => {
        const container = wrapperRef.current;
        // 현재 음표가 유효한 범위에 있을 때만 실행합니다.
        if (!container || currentNoteIndex < 0 || currentNoteIndex >= flatNotes.length) return;

        // SheetMusic 컴포넌트에서 생성된 고유 ID로 현재 음표 요소를 찾습니다.
        const currentNoteElement = container.querySelector(`#practice-note-${currentNoteIndex}`);

        if (currentNoteElement) {
            // scrollIntoView를 사용하여 해당 음표를 화면 중앙으로 부드럽게 스크롤합니다.
            currentNoteElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [currentNoteIndex, flatNotes.length]); // 현재 음표 인덱스가 바뀔 때마다 실행

    const targetNote = flatNotes[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= flatNotes.length;

    // [핵심 수정 2] 음표 판정 로직: '리듬만' 모드를 제외한 모든 모드에서 동작합니다.
    // 이 로직이 '끄기' 모드에서도 실행되어야 currentNoteIndex가 증가하고 스크롤이 발생합니다.
    const handleNotePlayed = useCallback((playedNote: string) => {
        // '리듬만' 모드는 향후 타이머 기반의 자동 진행을 위해 남겨둡니다.
        if (guideMode === 'rhythm-only') return;

        if (isShaking || isSongFinished) return;

        if (playedNote === targetNote?.note) {
            // 음표를 맞히면 다음 음표로 진행합니다.
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            // 틀리면 흔들리는 효과를 줍니다.
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
            }, 500);
        }
    }, [targetNote, isSongFinished, isShaking, guideMode]);

    // 가이드 모드에 따라 Piano와 SheetMusic에 전달할 props를 결정합니다.
    const pianoGuideNote = guideMode === 'full' ? targetNote?.note : undefined;
    const sheetMusicHighlightIndex = (guideMode === 'full' || guideMode === 'sheet-only') ? currentNoteIndex : -1;

    // '리듬만' 모드를 제외하고 곡이 끝나면 완료 메시지를 보여줍니다.
    const showCongrats = isSongFinished && guideMode !== 'rhythm-only';

    return (
        <div className="practice-container">
            <div className="practice-header">
                <button className="song-selector-button" onClick={() => setIsLibraryOpen(true)}>
                    <span>{t(song.titleKey)}</span>
                    <span className="dropdown-icon">▼</span>
                </button>
            </div>

            <div ref={wrapperRef} className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''} ${isShaking ? 'shake' : ''}`}>
                {showCongrats ? (
                    <div className="congrats-message">
                        <h2>🎉 {t('practice.congratsMessage')} 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>{t('practice.retryButton')}</button>
                    </div>
                ) : (
                    <SheetMusic
                        notes={flatNotes}
                        currentNoteIndex={sheetMusicHighlightIndex}
                        layout={layout}
                        lyricWidths={lyricWidths}
                        idPrefix="practice-note" // 스크롤을 위한 ID 접두사
                    />
                )}
            </div>
            <div className="piano-wrapper">
                <Piano
                    numOctaves={2}
                    onNotePlayed={handleNotePlayed}
                    guideNote={pianoGuideNote}
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