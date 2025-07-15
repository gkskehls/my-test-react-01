import { useState, useCallback, useEffect, useMemo } from 'react';
import Piano from '../components/piano/Piano';
// SheetMusic 대신 MultiLineSheetMusic을 사용합니다.
import MultiLineSheetMusic from '../components/sheet-music/MultiLineSheetMusic';
import { Song } from '../songs';
import './PracticePage.css';

interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [isShaking, setIsShaking] = useState(false);

    // 전체 음표를 한 줄로 합친 배열은 그대로 유지합니다. (진행도 계산에 편리)
    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    // === 추가: 현재 음표가 몇 번째 줄, 몇 번째 음표인지 계산 ===
    const { currentLineIndex, noteIndexInLine } = useMemo(() => {
        let noteCounter = 0;
        for (let lineIndex = 0; lineIndex < song.lines.length; lineIndex++) {
            const line = song.lines[lineIndex];
            if (currentNoteIndex < noteCounter + line.length) {
                return {
                    currentLineIndex: lineIndex,
                    noteIndexInLine: currentNoteIndex - noteCounter,
                };
            }
            noteCounter += line.length;
        }
        // 곡이 끝났거나 범위를 벗어난 경우
        return { currentLineIndex: -1, noteIndexInLine: -1 };
    }, [currentNoteIndex, song.lines]);

    // 곡이 바뀌면 상태 초기화
    useEffect(() => {
        setCurrentNoteIndex(0);
        setIsShaking(false);
    }, [song]);

    // 스크롤 로직은 그대로 유지합니다.
    useEffect(() => {
        const currentNoteElement = document.getElementById(`note-${currentLineIndex}-${noteIndexInLine}`);
        if (currentNoteElement) {
            currentNoteElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [currentLineIndex, noteIndexInLine]);

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
    }, [currentNoteIndex, targetNote, isSongFinished, isShaking]);

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
                    // === 수정: SheetMusic 대신 MultiLineSheetMusic을 렌더링 ===
                    <MultiLineSheetMusic
                        song={song}
                        currentLineIndex={currentLineIndex}
                        noteIndexInLine={noteIndexInLine}
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