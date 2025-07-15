import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h2>My Piano App</h2>
            <p>피아노 연습 프로젝트에 오신 것을 환영합니다!</p>
            <p>상단 메뉴를 통해 원하는 기능으로 이동하세요.</p>
            <Link to="/practice" style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
            }}>
                연습 시작하기
            </Link>
        </div>
    );
};

export default HomePage;