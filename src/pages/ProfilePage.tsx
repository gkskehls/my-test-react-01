import React from 'react';

const ProfilePage: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>내 정보</h2>
            <p>이 페이지에서는 사용자의 연습 기록, 성취도 등을 보여줄 수 있습니다.</p>
            <p>Firebase와 같은 데이터베이스를 연동하여 기능을 확장해 보세요!</p>
        </div>
    );
};

export default ProfilePage;