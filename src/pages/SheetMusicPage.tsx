// src/pages/SheetMusicPage.tsx
import React from 'react';
import SheetMusic from '../components/SheetMusic'; // 1. 새로 만든 SheetMusic 컴포넌트를 import
import { twinkleTwinkle } from '../songs/twinkleTwinkle'; // 2. 노래 데이터를 import
import './SheetMusicPage.css';

const SheetMusicPage: React.FC = () => {
    return (
        <div className="sheet-music-container">
            <h1>반짝반짝 작은 별</h1>
            <p>아래 악보를 보고 연습해보세요.</p>

            {/* 3. 기존 img 태그 대신 SheetMusic 컴포넌트를 사용합니다. */}
            <div className="sheet-image-wrapper">
                <SheetMusic song={twinkleTwinkle} />
            </div>
        </div>
    );
};

export default SheetMusicPage;