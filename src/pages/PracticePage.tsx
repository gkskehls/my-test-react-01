// src/pages/PracticePage.tsx
import React from 'react';
import Piano from '../components/Piano';

const PracticePage: React.FC = () => {
    return (
        <div>
            <h1>연습하기 페이지</h1>
            <p>아래 건반을 클릭해보세요.</p>
            {/* 2개의 옥타브를 표시하도록 설정합니다. 숫자를 바꾸면 옥타브 수가 바뀝니다. */}
            <Piano numOctaves={2} />
        </div>
    );
};

export default PracticePage;