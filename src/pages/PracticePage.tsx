import React, { useState, useCallback, useEffect } from 'react';
import Piano from '../components/Piano';
import SheetMusic from '../components/SheetMusic';
import { Song } from '../songs'; // 1. Song 타입 import
import './PracticePage.css';

// 2. 페이지가 받을 props 타입 정의
interface PracticePageProps {
    song: Song;
}

const PracticePage: React.FC<PracticePageProps> = ({ song }) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

    // 3. 노래가 바뀌면 연습 진행도를 초기화
    useEffect(() => {
        setCurrentNoteIndex(0);
    }, [song]);

    const targetNote = song.notes[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= song.notes.length;

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
            {/* 4. 제목을 동적으로 표시 */}
            <h1>연습하기: {song.title}</h1>

            <div className="practice-sheet-wrapper">
                {isSongFinished ? (
                    <div className="congrats-message">
                        <h2>🎉 참 잘했어요! 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>다시하기</button>
                    </div>
                ) : (
                    // 5. 선택된 노래의 악보 데이터와 진행도를 전달
                    <SheetMusic
                        song={song.notes}
                        currentNoteIndex={currentNoteIndex}
                    />
                )}
            </div>

            <Piano numOctaves={2} onNotePlayed={handleNotePlayed} />
        </div>
    );
};

export default PracticePage;