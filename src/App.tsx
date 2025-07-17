// src/App.tsx
import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // useTranslation 추가
import { Song } from './songs/types'; // SONG_LIST 대신 타입만 가져옵니다.
import { getSongs } from './firebase/songs'; // 새로 만든 데이터 조회 서비스를 가져옵니다.
import { ThemeProvider } from './context/ThemeContext';

import Header from './components/ui/Header';
// 페이지 컴포넌트들을 lazy를 사용해 동적으로 import 합니다.
const HomePage = lazy(() => import('./pages/HomePage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const SheetMusicPage = lazy(() => import('./pages/SheetMusicPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

import './App.css';

function App() {
    const { t, i18n } = useTranslation(); // useTranslation 훅 사용
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 언어가 변경될 때마다 문서 타이틀을 업데이트합니다.
    useEffect(() => {
        document.title = t('meta.documentTitle');
    }, [i18n.language, t]); // 언어나 t 함수가 변경될 때마다 실행

    // 컴포넌트가 마운트될 때 Firestore에서 곡 데이터를 가져옵니다.
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songList = await getSongs();
                setSongs(songList);
                if (songList.length > 0) {
                    setCurrentSong(songList[0]); // 첫 번째 곡을 기본값으로 설정
                }
            } catch (error) {
                console.error("Failed to fetch songs:", error);
                // 여기에 사용자에게 보여줄 오류 처리 로직을 추가할 수 있습니다.
            } finally {
                setIsLoading(false);
            }
        };

        fetchSongs();
    }, []); // 빈 배열을 전달하여 한 번만 실행되도록 합니다.

    const handleSongChange = (newSong: Song) => {
        setCurrentSong(newSong);
    };

    // 1. 데이터 로딩 중인 경우, 명확하게 로딩 상태를 표시합니다.
    if (isLoading) {
        return <div className="page-loading">{t('common.loading')}</div>;
    }

    // 2. 로딩이 끝났지만 표시할 곡이 없는 경우(예: Firestore에 데이터가 없을 때),
    // 사용자에게 적절한 메시지를 보여주어 앱이 멈춘 것처럼 보이지 않게 합니다.
    if (!currentSong) {
        return <div className="page-loading">{t('common.noSongsAvailable')}</div>;
    }

    return (
        <ThemeProvider>
            <Router>
                <Header />
                <main className="app-content">
                    {/* Routes를 Suspense로 감싸고, 로딩 중에 보여줄 UI를 fallback으로 지정합니다. */}
                    <Suspense fallback={<div className="page-loading">{t('common.loading')}</div>}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/practice"
                            element={<PracticePage songs={songs} song={currentSong} onSongChange={handleSongChange} />}
                        />
                        <Route
                            path="/sheet-music"
                            element={<SheetMusicPage songs={songs} song={currentSong} onSongChange={handleSongChange} />}
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                    </Suspense>
                </main>
            </Router>
        </ThemeProvider>
    );
}

export default App;