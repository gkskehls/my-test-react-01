import { useState, useCallback, useEffect, useMemo } from 'react';
import Piano from '../components/piano/Piano';
// === 수정: MultiLineSheetMusic 대신 다시 SheetMusic을 사용합니다. ===
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song } from '../songs';
import './PracticePage.css';

interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [isShaking, setIsShaking] = useState(false);

    // 전체 음표를 한 줄로 합친 배열은 그대로 사용합니다.
    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    // === 삭제: 여러 줄 계산 로직이 더 이상 필요 없으므로 삭제합니다. ===

    // 곡이 바뀌면 상태 초기화
    useEffect(() => {
        setCurrentNoteIndex(0);
        setIsShaking(false);
    }, [song]);

    // === 수정: 스크롤 로직을 단일 라인에 맞게 되돌립니다. ===
    useEffect(() => {
        // 이제 음표 ID는 'note-인덱스' 형태입니다.
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
    }, [targetNote, isSongFinished, isShaking]); // currentNoteIndex는 targetNote에 이미 의존하므로 제거 가능

    return (
        <div className="practice-container">
            <h1>연습하기: {song.title}</h1>
            <div className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''} ${isShaking ? 'shake' : ''}`}>
                {isSongFinished ? (
                    <div className="congrats-message">
                        <h2>🎉 참 잘했어요! 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>다시하기</button>
                    </div>
                ) : (
                    // === 수정: SheetMusic 컴포넌트를 직접 사용합니다. ===
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