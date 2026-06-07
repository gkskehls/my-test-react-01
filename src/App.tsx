// src/App.tsx
import { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Song, songs as localSongs } from './songs';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/ui/Header';
import { SettingsPopover } from './components/ui/SettingsPopover';
import ProtectedRoute from './components/auth/ProtectedRoute'; // [추가]

// 페이지 컴포넌트 lazy loading
const HomePage = lazy(() => import('./pages/HomePage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const SheetMusicPage = lazy(() => import('./pages/SheetMusicPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage')); // [추가]
const AdminPage = lazy(() => import('./pages/AdminPage')); // [추가]

import './App.css';

function App() {
    const { t, i18n } = useTranslation();
    const songs = localSongs;
    const [currentSong, setCurrentSong] = useState<Song | null>(localSongs.length > 0 ? localSongs[0] : null);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsButtonRef = useRef<HTMLButtonElement>(null!);

    useEffect(() => {
        document.title = t('meta.documentTitle');
    }, [i18n.language, t]);


    const handleSongChange = (newSong: Song) => {
        setCurrentSong(newSong);
    };

    if (!currentSong) {
        return <div className="page-loading">{t('common.noSongsAvailable')}</div>;
    }


    return (
        <ThemeProvider>
            <SettingsProvider>
                <Router>
                    <ErrorBoundary>
                        <Header
                            onSettingsClick={() => setIsSettingsOpen(prev => !prev)}
                            settingsButtonRef={settingsButtonRef}
                        />
                        <main className="app-content">
                            <Suspense fallback={<div className="page-loading">{t('common.loading')}</div>}>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/practice" element={<PracticePage songs={songs} song={currentSong} onSongChange={handleSongChange} />} />
                                    <Route path="/sheet-music" element={<SheetMusicPage songs={songs} song={currentSong} onSongChange={handleSongChange} />} />
                                    <Route path="/profile" element={<ProfilePage />} />

                                    {/* [추가] 로그인 및 관리자 페이지 라우트 */}
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route
                                        path="/admin"
                                        element={
                                            <ProtectedRoute>
                                                <AdminPage />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* 일치하는 경로가 없을 경우 홈으로 리디렉션 */}
                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <SettingsPopover
                            isOpen={isSettingsOpen}
                            onClose={() => setIsSettingsOpen(false)}
                            anchorEl={settingsButtonRef.current}
                        />
                    </ErrorBoundary>
                </Router>
            </SettingsProvider>
        </ThemeProvider>
    );
}

export default App;