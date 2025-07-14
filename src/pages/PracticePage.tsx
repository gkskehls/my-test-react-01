// src/pages/PracticePage.tsx
import React, { useState, useCallback } from 'react';
import Piano from '../components/Piano';
import SheetMusic from '../components/SheetMusic'; // 1. SheetMusic 컴포넌트 import
import { twinkleTwinkle, SongNote } from '../songs/twinkleTwinkle';
import './PracticePage.css';

const PracticePage: React.FC = () => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    // 피드백 상태는 이제 악보 하이라이트로 대체되므로 제거해도 됩니다.
    // const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const targetNote: SongNote | undefined = twinkleTwinkle[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= twinkleTwinkle.length;

    const handleNotePlayed = useCallback((playedNote: string) => {
        if (isSongFinished) return;

        if (playedNote === targetNote?.note) {
            // 정답일 때, 간단히 다음 노트 인덱스로 업데이트
            setCurrentNoteIndex(prev => prev + 1);
        } else {
            // 오답일 때의 로직 (예: 잠시 건반을 붉게 표시)은 나중에 추가할 수 있습니다.
            console.log("Wrong note!");
        }
    }, [currentNoteIndex, targetNote, isSongFinished]);

    return (
        <div className="practice-container">
            <h1>연습하기: 반짝반짝 작은 별</h1>

            {/* 2. 기존 가이드 박스 대신 SheetMusic 컴포넌트를 사용합니다. */}
            <div className="practice-sheet-wrapper">
                {isSongFinished ? (
                    <div className="congrats-message">
                        <h2>🎉 참 잘했어요! 🎉</h2>
                        <button onClick={() => setCurrentNoteIndex(0)}>다시하기</button>
                    </div>
                ) : (
                    <SheetMusic
                        song={twinkleTwinkle}
                        currentNoteIndex={currentNoteIndex} // 3. 현재 인덱스를 전달!
                    />
                )}
            </div>

            <Piano numOctaves={2} onNotePlayed={handleNotePlayed} />
        </div>
    );
};

export default PracticePage;