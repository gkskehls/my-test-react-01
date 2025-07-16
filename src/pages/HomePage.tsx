// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HomePage.css'; // CSS 파일을 import 합니다.

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        // 인라인 스타일 대신 CSS 클래스를 사용합니다.
        <div className="home-page-container">
            <h2>{t('home.title')}</h2>
            <p>{t('home.welcome')}</p>
            <p>{t('home.description')}</p>
            <Link to="/practice" className="start-practice-link">
                {t('home.startPractice')}
            </Link>
        </div>
    );
};

export default HomePage;
