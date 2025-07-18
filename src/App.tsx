// src/App.tsx
import { useState, lazy, Suspense, useEffect, useRef } from 'react'; // useRef 추가
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Song } from './songs/types';
import { getSongs } from './firebase/songs';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/ui/Header';
import { SettingsPopover } from './components/ui/SettingsPopover'; // [추가]

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

    // [추가] 설정 팝오버 상태와 버튼 ref를 최상위에서 관리합니다.
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsButtonRef = useRef<HTMLButtonElement>(null!);

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
            <SettingsProvider>
                <Router>
                    <ErrorBoundary>
                        {/* [수정] Header에 팝오버 제어 함수와 ref를 전달합니다. */}
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
                                </Routes>
                            </Suspense>
                        </main>
                        {/* [추가] 팝오버를 앱 레벨에서 렌더링하여 모든 페이지 위에 표시될 수 있게 합니다. */}
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