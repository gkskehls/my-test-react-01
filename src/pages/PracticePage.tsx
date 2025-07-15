import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Piano from '../components/piano/Piano'; // 경로 수정
import SheetMusic from '../components/sheet-music/SheetMusic'; // 경로 수정
import { Song } from '../songs'; // 경로 수정
import './PracticePage.css';

interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const flatNotes = useMemo(() => song.lines.flat(), [song]);

    // 곡이 바뀌면 처음부터 다시 시작
    useEffect(() => {
        setCurrentNoteIndex(0);
    }, [song]);

    // 현재 연주해야 할 음표로 스크롤
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
        if (isSongFinished) return;
        if (playedNote === targetNote?.note) {
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            console.log("틀렸습니다! 다시 시도하세요.");
            // 여기에 틀렸을 때의 시각적 피드백(예: 화면 흔들기)을 추가할 수 있습니다.
        }
    }, [currentNoteIndex, targetNote, isSongFinished]);

    return (
        <div className="practice-container">
            <h1>연습하기: {song.title}</h1>
            <div className={`practice-sheet-wrapper ${isSongFinished ? 'is-finished' : ''}`}>
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