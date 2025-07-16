// src/pages/ProfilePage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './ProfilePage.css'; // CSS 파일을 import 합니다.

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="profile-page-container">
            <h2>{t('profile.title')}</h2>
            <p>{t('profile.inPreparation')}</p>
        </div>
    );
};

export default ProfilePage;