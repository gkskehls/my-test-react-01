// src/pages/PracticePage.tsx
import { useState, useCallback, useEffect, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song } from '../songs'; // SONG_LIST를 직접 사용하지 않으므로 제거합니다.
import './PracticePage.css';

// SheetMusicPage와 동일하게, Modal을 동적으로 로드하여 성능을 최적화합니다.
const SongLibraryModal = lazy(() => import('../components/library/SongLibraryModal'));

// 1. App.tsx로부터 song과 onSongChange를 props로 받도록 인터페이스를 정의합니다.
interface PracticePageProps {
    songs: Song[];
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ songs, song, onSongChange }) => {
    const { t } = useTranslation();
    // 2. song 상태는 이제 props로 받으므로, 모달 표시 여부만 내부 상태로 관리합니다.
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [isShaking, setIsShaking] = useState(false);

    // 3. 곡이 변경되면 부모(App.tsx)의 상태를 업데이트하는 함수를 호출합니다.
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
            {/* 페이지 제목을 제거하고, 곡 선택 버튼을 유일한 컨트롤로 사용합니다. */}
            <div className="practice-header">
                <button className="song-selector-button" onClick={() => setIsLibraryOpen(true)}>
                    <span>{t(song.titleKey)}</span>
                    <span className="dropdown-icon">▼</span>
                </button>
            </div>
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
                <Piano
                    numOctaves={2}
                    onNotePlayed={handleNotePlayed}
                    // ✨ 다음에 연주할 음표 정보를 Piano 컴포넌트로 전달합니다.
                    guideNote={targetNote?.note}
                />
            </div>

            {/* 라이브러리 모달 렌더링 로직 추가 */}
            <Suspense fallback={null}>
                {isLibraryOpen && (
                    <SongLibraryModal
                        songs={songs} // 전체 곡 목록을 모달에 전달합니다.
                        currentSong={song} // [수정] 현재 선택된 곡 정보를 전달하여 오류를 해결합니다.
                        onClose={() => setIsLibraryOpen(false)}
                        onSongSelect={handleSongChange}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default PracticePage;