import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Piano from '../components/Piano';
import SheetMusic from '../components/SheetMusic';
import { Song } from '../songs';
import './PracticePage.css';

interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    // scrollContainerRef는 이제 필요 없습니다.

    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    useEffect(() => {
        setCurrentNoteIndex(0);
    }, [song]);

    // 스크롤 로직을 훨씬 더 간단하고 안정적인 방식으로 개선합니다.
    useEffect(() => {
        // 현재 연주해야 할 음표의 DOM 요소를 ID로 직접 찾습니다.
        const currentNoteElement = document.getElementById(`note-${currentNoteIndex}`);

        if (currentNoteElement) {
            // 해당 요소를 화면 중앙으로 부드럽게 스크롤합니다.
            currentNoteElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', // 세로 스크롤은 최소화
                inline: 'center', // 가로 스크롤 시 중앙에 위치
            });
        }
    }, [currentNoteIndex]); // currentNoteIndex가 바뀔 때마다 실행

    const targetNote = flatNotes[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= flatNotes.length;

    const handleNotePlayed = useCallback((playedNote: string) => {
        if (isSongFinished) return;
        if (playedNote === targetNote?.note) {
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            console.log("Wrong note!");
        }
    }, [currentNoteIndex, targetNote, isSongFinished]);

    return (
        <div className="practice-container">
            <h1>연습하기: {song.title}</h1>

            <div
                // ref는 더 이상 필요 없으므로 제거합니다.
                className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''}`}
            >
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