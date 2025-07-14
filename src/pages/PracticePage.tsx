import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'; // useMemo 추가
import Piano from '../components/Piano';
import SheetMusic from '../components/SheetMusic';
import { Song } from '../songs';
import './PracticePage.css';

interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // ▼▼▼ useMemo를 사용해 여러 줄의 악보(song.lines)를 하나의 배열로 합칩니다. ▼▼▼
    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    // 노래가 바뀌면 연습 진행도를 초기화
    useEffect(() => {
        setCurrentNoteIndex(0);
    }, [song]);

    useEffect(() => {
        // ref가 가리키는 실제 div 요소가 있는지 확인
        if (scrollContainerRef.current) {
            // 악보의 음표 위치 계산에 사용된 값들 (SheetMusic.tsx와 동일)
            const noteStartOffset = 60; // 시작 여백
            const noteWidth = 45;       // 음표당 너비

            // 현재 음표의 가로 위치 계산
            const notePosition = noteStartOffset + (currentNoteIndex * noteWidth);

            // 스크롤 컨테이너의 너비와 중앙 위치 계산
            const containerWidth = scrollContainerRef.current.offsetWidth;
            const containerCenter = containerWidth / 2;

            // 음표가 컨테이너 중앙에 오도록 목표 스크롤 위치 계산
            const targetScrollLeft = notePosition - containerCenter;

            // 계산된 위치로 부드럽게 스크롤
            scrollContainerRef.current.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth',
            });
        }
    }, [currentNoteIndex]); // currentNoteIndex가 바뀔 때마다 이 효과를 실행

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
                className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''}`}
                ref={scrollContainerRef}
            >
                {isSongFinished ? (
                    <div className="congrats-message">
                        <h2>🎉 참 잘했어요! 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>다시하기</button>
                    </div>
                ) : (
                    <SheetMusic
                        // ▼▼▼ song.notes 대신 flatNotes를 전달합니다.
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