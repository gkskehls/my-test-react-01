// src/pages/PracticePage.tsx
import React, { useState, useCallback } from 'react';
import Piano from '../components/Piano';
import { twinkleTwinkle, SongNote } from '../songs/twinkleTwinkle'; // 1. 노래 데이터 가져오기
import './PracticePage.css'; // 2. 스타일을 위한 CSS 파일 가져오기

const PracticePage: React.FC = () => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const targetNote: SongNote | undefined = twinkleTwinkle[currentNoteIndex];
    const isSongFinished = currentNoteIndex >= twinkleTwinkle.length;

    // 피아노 건반이 눌렸을 때 호출될 함수
    const handleNotePlayed = useCallback((playedNote: string) => {
        if (isSongFinished) return; // 노래가 끝났으면 아무것도 안 함

        if (playedNote === targetNote?.note) {
            // 정답일 때
            setFeedback('correct');
            setTimeout(() => {
                setCurrentNoteIndex(prev => prev + 1); // 다음 노트로 이동
                setFeedback(null);
            }, 300);
        } else {
            // 오답일 때
            setFeedback('wrong');
            setTimeout(() => {
                setFeedback(null);
            }, 500);
        }
    }, [currentNoteIndex, targetNote, isSongFinished]);

    return (
        <div className="practice-container">
            <h1>연습하기: 반짝반짝 작은 별</h1>
            <div className="guide-box">
                {isSongFinished ? (
                    <h2>🎉 참 잘했어요! 🎉</h2>
                ) : (
                    <>
                        <p>다음에 누를 건반:</p>
                        {/* 정답/오답에 따라 배경색이 바뀝니다 */}
                        <div className={`target-note ${feedback ?? ''}`}>
                            {targetNote?.displayName}
                        </div>
                    </>
                )}
            </div>
            {/* Piano에 onNotePlayed 함수를 전달합니다 */}
            <Piano numOctaves={2} onNotePlayed={handleNotePlayed} />
        </div>
    );
};

export default PracticePage;