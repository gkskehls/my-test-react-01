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

// 페이지 컴포넌트 lazy loading
const HomePage = lazy(() => import('./pages/HomePage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const SheetMusicPage = lazy(() => import('./pages/SheetMusicPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

import './App.css';

function App() {
    const { t, i18n } = useTranslation();
    const songs = localSongs;
    const [currentSong, setCurrentSong] = useState<Song | null>(() => {
        if (localSongs.length === 0) return null;

        // 1. 기존에 선택한 노래가 있는지 localStorage에서 확인
        const savedSongId = localStorage.getItem('selectedSongId');
        if (savedSongId) {
            const savedSong = localSongs.find(s => s.id === savedSongId);
            if (savedSong) return savedSong;
        }

        // 2. 처음 접속했거나 저장된 노래가 없으면 "twinkle-twinkle" 찾기
        const defaultSong = localSongs.find(s => s.id === 'twinkle-twinkle');
        if (defaultSong) return defaultSong;

        // 3. 둘 다 없으면 첫 번째 노래 선택
        return localSongs[0];
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsButtonRef = useRef<HTMLButtonElement>(null!);

    useEffect(() => {
        document.title = t('meta.documentTitle');
    }, [i18n.language, t]);


    const handleSongChange = (newSong: Song) => {
        setCurrentSong(newSong);
        localStorage.setItem('selectedSongId', newSong.id);
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