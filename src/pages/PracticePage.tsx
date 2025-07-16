// src/pages/PracticePage.tsx
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
import SongLibraryModal from '../components/library/SongLibraryModal'; // 1. 라이브러리 모달 import
import { Song } from '../songs'; // SONG_LIST를 직접 사용하지 않으므로 제거합니다.
import './PracticePage.css';

// 1. App.tsx로부터 song과 onSongChange를 props로 받도록 인터페이스를 정의합니다.
interface PracticePageProps {
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ song, onSongChange }) => {
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
            <h1>{t('practicePageTitle', { title: t(song.titleKey) })}</h1>

            {/* '악보 보기' 페이지와 동일한 곡 선택 UI를 추가합니다. */}
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
                <Piano numOctaves={2} onNotePlayed={handleNotePlayed} />
            </div>

            {/* 라이브러리 모달 렌더링 로직 추가 */}
            {isLibraryOpen && (
                <SongLibraryModal
                    onClose={() => setIsLibraryOpen(false)}
                    onSongSelect={handleSongChange}
                />
            )}
        </div>
    );
};

export default PracticePage;