import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="app-header">
            <NavLink to="/" className="logo">My Piano</NavLink>
            <nav>
                <NavLink to="/practice">연습하기</NavLink>
                <NavLink to="/sheet-music">악보 보기</NavLink>
                <NavLink to="/profile">내 정보</NavLink>
            </nav>
        </header>
    );
};

export default Header;