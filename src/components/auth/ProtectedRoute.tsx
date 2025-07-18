// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isAdmin, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // 인증 상태 확인 중에는 로딩 화면을 표시합니다.
        return <div className="page-loading">인증 확인 중...</div>;
    }

    if (!user || !isAdmin) {
        // 사용자가 없거나 관리자가 아니면 로그인 페이지로 리디렉션합니다.
        // 원래 가려던 경로를 state에 저장하여 로그인 후 돌아올 수 있도록 합니다.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 인증된 관리자일 경우 요청한 페이지를 보여줍니다.
    return children;
};

export default ProtectedRoute;