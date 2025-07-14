// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // 1. <a> 대신 Link를 import
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="app-header">
            {/* 2. 로고도 Link로 감싸서 홈으로 가게 만듭니다. */}
            <Link to="/" className="logo">My Piano App</Link>
            <nav>
                {/* 3. <a> 태그는 Link로, href는 to로 바꿉니다. */}
                <Link to="/practice">연습하기</Link>
                <Link to="/sheet-music">악보 보기</Link>
                <Link to="/profile">내 정보</Link>
            </nav>
        </header>
    );
};

export default Header;