// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. 훅 import

const HomePage: React.FC = () => {
    const { t } = useTranslation(); // 2. 훅 사용

    return (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            {/* 3. 하드코딩된 텍스트들을 모두 t 함수로 교체 */}
            <h2>{t('home.title')}</h2>
            <p>{t('home.welcome')}</p>
            <p>{t('home.description')}</p>
            <Link to="/practice" style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
            }}>
                {t('home.startPractice')}
            </Link>
        </div>
    );
};

export default HomePage;
