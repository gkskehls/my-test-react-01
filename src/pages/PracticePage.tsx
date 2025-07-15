import { useState, useCallback, useEffect, useMemo } from 'react'; // React import는 그대로 둡니다.
import Piano from '../components/piano/Piano';
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song } from '../songs';
import './PracticePage.css';

interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [isShaking, setIsShaking] = useState(false); // 흔들림 효과를 위한 상태 추가
    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    // 곡이 바뀌면 상태 초기화
    useEffect(() => {
        setCurrentNoteIndex(0);
        setIsShaking(false);
    }, [song]);

    // ... (스크롤 useEffect는 변경 없음) ...
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
        // 이미 흔들리는 중이거나 곡이 끝났으면 입력을 무시
        if (isShaking || isSongFinished) return;

        if (playedNote === targetNote?.note) {
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            // 틀렸을 때: 흔들림 상태를 true로 변경
            setIsShaking(true);
            // 0.5초(애니메이션 길이) 후에 상태를 다시 false로 되돌려 다음에도 애니메이션이 동작하게 함
            setTimeout(() => {
                setIsShaking(false);
            }, 500);
        }
    }, [currentNoteIndex, targetNote, isSongFinished, isShaking]);

    return (
        <div className="practice-container">
            <h1>연습하기: {song.title}</h1>
            {/* isShaking 상태에 따라 'shake' 클래스를 동적으로 추가 */}
            <div className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''} ${isShaking ? 'shake' : ''}`}>
                {isSongFinished ? (
                    <div className="congrats-message">
                        <h2>🎉 참 잘했어요! 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>다시하기</button>
                    </div>
                ) : (
                    <SheetMusic
                        notes={flatNotes}
                        currentNoteIndex={currentNoteIndex}
                    />
                )}
            </div>
            <Piano numOctaves={2} onNotePlayed={handleNotePlayed} />
        </div>
    );
};

export default PracticePage;