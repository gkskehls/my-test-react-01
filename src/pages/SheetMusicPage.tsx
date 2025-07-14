// src/pages/SheetMusicPage.tsx

import React from 'react';
import './SheetMusicPage.css'; // 1. 페이지를 꾸미기 위한 CSS 파일을 import 합니다.

const SheetMusicPage: React.FC = () => {
    return (
        <div className="sheet-music-container">
            <h1>반짝반짝 작은 별</h1>
            <p>아래 악보를 보고 연습해보세요.</p>
            <div className="sheet-image-wrapper">
                {/* 2. public 폴더에 넣은 이미지를 img 태그로 보여줍니다. */}
                <img src="/twinkle-sheet.png" alt="반짝반짝 작은 별 악보" />
            </div>
        </div>
    );
};

export default SheetMusicPage;