// src/pages/PracticePage.tsx
import { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
// [추가] NoteDuration 타입을 임포트하여 음표 길이를 참조합니다.
import { Song, NoteDuration } from '../songs';
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

// [추가] 리듬 모드를 위한 BPM(분당 비트 수) 설정. 나중에 설정에서 조절할 수도 있습니다.
const RHYTHM_MODE_BPM = 100;

// [추가] 음표 길이를 시간(밀리초)으로 변환하는 헬퍼 함수
const getNoteDurationInMs = (duration: NoteDuration): number => {
    const msPerBeat = 60000 / RHYTHM_MODE_BPM;
    switch (duration) {
        case 'w': return msPerBeat * 4; // 온음표
        case 'h': return msPerBeat * 2; // 2분음표
        case 'q': return msPerBeat;     // 4분음표
        case '8': return msPerBeat / 2; // 8분음표
        default: return msPerBeat;
    }
};


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

    // 악보 자동 스크롤 로직
    useEffect(() => {
        const container = wrapperRef.current;
        if (!container || currentNoteIndex < 0 || currentNoteIndex >= flatNotes.length) return;

        const currentNoteElement = container.querySelector(`#practice-note-${currentNoteIndex}`);

        if (currentNoteElement) {
            currentNoteElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [currentNoteIndex, flatNotes.length]);

    const targetNote = flatNotes[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= flatNotes.length;

    // 음표 판정 로직
    const handleNotePlayed = useCallback((playedNote: string) => {
        if (guideMode === 'rhythm-only') return; // 리듬 모드에서는 피아노 입력 무시
        if (isShaking || isSongFinished) return;

        if (playedNote === targetNote?.note) {
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
            }, 500);
        }
    }, [targetNote, isSongFinished, isShaking, guideMode]);

    // [추가] '리듬만' 모드를 위한 자동 진행 로직
    useEffect(() => {
        // '리듬만' 모드가 아니거나 곡이 끝나면 타이머를 실행하지 않습니다.
        if (guideMode !== 'rhythm-only' || isSongFinished) {
            return;
        }

        const currentNote = flatNotes[currentNoteIndex];
        if (!currentNote) return;

        // 현재 음표의 길이에 맞춰 다음 음표로 넘어갈 시간을 계산합니다.
        const durationMs = getNoteDurationInMs(currentNote.duration);

        const timerId = setTimeout(() => {
            setCurrentNoteIndex(prev => prev + 1);
        }, durationMs);

        // 컴포넌트가 언마운트되거나, 모드/곡이 바뀌면 타이머를 정리합니다.
        return () => {
            clearTimeout(timerId);
        };
    }, [guideMode, currentNoteIndex, isSongFinished, flatNotes]);


    // [수정] '리듬만' 모드에서도 악보 하이라이트가 동작하도록 추가합니다.
    const sheetMusicHighlightIndex = (guideMode === 'full' || guideMode === 'sheet-only' || guideMode === 'rhythm-only')
        ? currentNoteIndex
        : -1;

    // 피아노 가이드는 '전체' 모드에서만 동작합니다.
    const pianoGuideNote = guideMode === 'full' ? targetNote?.note : undefined;

    // [수정] 모든 모드에서 곡이 끝나면 완료 메시지를 보여줍니다.
    const showCongrats = isSongFinished;

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
                        idPrefix="practice-note"
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