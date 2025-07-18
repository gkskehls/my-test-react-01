// src/App.tsx
import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Song } from './songs/types';
import { getSongs } from './firebase/songs';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext'; // [추가]

import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/ui/Header';

const HomePage = lazy(() => import('./pages/HomePage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const SheetMusicPage = lazy(() => import('./pages/SheetMusicPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

import './App.css';

function App() {
    const { t, i18n } = useTranslation();
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetchError, setHasFetchError] = useState(false);

    useEffect(() => {
        document.title = t('meta.documentTitle');
    }, [i18n.language, t]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songList = await getSongs();
                setSongs(songList);
                if (songList.length > 0) {
                    setCurrentSong(songList[0]);
                }
            } catch (error) {
                console.error("Failed to fetch songs:", error);
                setHasFetchError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const handleSongChange = (newSong: Song) => {
        setCurrentSong(newSong);
    };

    if (hasFetchError) {
        return <div className="page-loading">{t('common.fetchError')}</div>;
    }

    if (isLoading) {
        return <div className="page-loading">{t('common.loading')}</div>;
    }

    if (!currentSong) {
        return <div className="page-loading">{t('common.noSongsAvailable')}</div>;
    }

    return (
        <ThemeProvider>
            {/* [수정] SettingsProvider로 감싸 하위 모든 컴포넌트가 설정 값에 접근할 수 있게 합니다. */}
            <SettingsProvider>
                <Router>
                    <ErrorBoundary>
                        <Header />
                        <main className="app-content">
                            <Suspense fallback={<div className="page-loading">{t('common.loading')}</div>}>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/practice" element={<PracticePage songs={songs} song={currentSong} onSongChange={handleSongChange} />} />
                                    <Route path="/sheet-music" element={<SheetMusicPage songs={songs} song={currentSong} onSongChange={handleSongChange} />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Routes>
                            </Suspense>
                        </main>
                    </ErrorBoundary>
                </Router>
            </SettingsProvider>
        </ThemeProvider>
    );
}

export default App;
