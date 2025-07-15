// src/pages/ProfilePage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h2>{t('profile.title')}</h2>
            <p>{t('profile.inPreparation')}</p>
        </div>
    );
};

export default ProfilePage;