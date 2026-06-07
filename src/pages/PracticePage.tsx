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

    // [추가] 리듬 모드 상태 및 카운트다운 상태 관리
    const [rhythmState, setRhythmState] = useState<'idle' | 'countdown' | 'playing' | 'paused'>('idle');
    const [countdownValue, setCountdownValue] = useState(3);

    const layout = useSheetMusicLayout(wrapperRef);
    const lyricWidths = useLyricWidths(song);

    const handleSongChange = (newSong: Song) => {
        onSongChange(newSong);
    };

    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    useEffect(() => {
        setCurrentNoteIndex(0);
        setIsShaking(false);
        setRhythmState('idle');
        setCountdownValue(3);
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

    // [추가] 리듬 모드 카운트다운 타이머
    useEffect(() => {
        if (guideMode !== 'rhythm-only' || rhythmState !== 'countdown') {
            return;
        }

        const msPerBeat = 60000 / RHYTHM_MODE_BPM;
        const intervalId = setInterval(() => {
            setCountdownValue(prev => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    setRhythmState('playing');
                    return 3; // 다음을 위해 초기화
                }
                return prev - 1;
            });
        }, msPerBeat);

        return () => {
            clearInterval(intervalId);
        };
    }, [guideMode, rhythmState]);

    // [추가] '리듬만' 모드를 위한 자동 진행 로직 (playing 상태일 때만)
    useEffect(() => {
        if (guideMode !== 'rhythm-only' || rhythmState !== 'playing' || isSongFinished) {
            return;
        }

        const currentNote = flatNotes[currentNoteIndex];
        if (!currentNote) return;

        // 현재 음표의 길이에 맞춰 다음 음표로 넘어갈 시간을 계산합니다.
        const durationMs = getNoteDurationInMs(currentNote.duration);

        const timerId = setTimeout(() => {
            setCurrentNoteIndex(prev => prev + 1);
        }, durationMs);

        // 컴포넌트가 언마운트되거나 상태가 바뀌면 타이머를 정리합니다.
        return () => {
            clearTimeout(timerId);
        };
    }, [guideMode, rhythmState, currentNoteIndex, isSongFinished, flatNotes]);


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
            {/* PracticePage.tsx의 return 문 내부 헤더 및 악보 래퍼 부분 */}
            <div className="practice-header">
                <button
                    className="song-selector-button"
                    onClick={() => setIsLibraryOpen(true)}
                >
                    <span>{t(song.titleKey)}</span>
                    <span className="dropdown-icon">▼</span>
                </button>

                {/* 리듬 모드 통합 제어 버튼 (아이콘 제거, 텍스트 중심) */}
                {guideMode === 'rhythm-only' && !isSongFinished && (
                    <button
                        className="rhythm-control-button"
                        onClick={() => {
                            if (rhythmState === 'playing') {
                                setRhythmState('paused');
                            } else if (
                                rhythmState === 'paused' ||
                                rhythmState === 'idle'
                            ) {
                                rhythmState === 'idle'
                                    ? setRhythmState('countdown')
                                    : setRhythmState('playing');
                            }
                        }}
                    >
                        {rhythmState === 'playing'
                            ? t('practice.pause')
                            : rhythmState === 'paused'
                              ? t('practice.resume')
                              : t('practice.start')}
                    </button>
                )}
            </div>
            <div
                ref={wrapperRef}
                className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''} ${isShaking ? 'shake' : ''}`}
            >
                {showCongrats ? (
                    <div className="congrats-message">
                        <h2>🎉 {t('practice.congratsMessage')} 🎉</h2>
                        <button
                            onClick={() => {
                                setCurrentNoteIndex(0);
                                setRhythmState('idle');
                            }}
                        >
                            {t('practice.retryButton')}
                        </button>
                    </div>
                ) : (
                    <>
                        <SheetMusic
                            notes={flatNotes}
                            currentNoteIndex={sheetMusicHighlightIndex}
                            layout={layout}
                            lyricWidths={lyricWidths}
                            idPrefix="practice-note"
                        />
                        {/* 카운트다운 숫자 레이어만 남김 (팝업 삭제) */}
                        {rhythmState === 'countdown' && (
                            <div className="rhythm-overlay">
                                <div className="countdown-number">
                                    {countdownValue}
                                </div>
                            </div>
                        )}
                    </>
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