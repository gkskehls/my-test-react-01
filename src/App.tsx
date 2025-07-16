// src/App.tsx
import { useState, lazy, Suspense, useEffect } from 'react'; // useEffect 추가import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // useTranslation 추가
import { SONG_LIST, Song } from './songs';

import Header from './components/ui/Header';
// 페이지 컴포넌트들을 lazy를 사용해 동적으로 import 합니다.
const HomePage = lazy(() => import('./pages/HomePage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const SheetMusicPage = lazy(() => import('./pages/SheetMusicPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

import './App.css';

function App() {
    const { t, i18n } = useTranslation(); // useTranslation 훅 사용
    const [currentSong, setCurrentSong] = useState<Song>(SONG_LIST[0]);

    // 언어가 변경될 때마다 문서 타이틀을 업데이트합니다.
    useEffect(() => {
        document.title = t('documentTitle');
    }, [i18n.language, t]); // 언어나 t 함수가 변경될 때마다 실행

    const handleSongChange = (newSong: Song) => {
        setCurrentSong(newSong);
    };

    return (
        <Router>
            <Header />
            <main className="app-content">
                {/* Routes를 Suspense로 감싸고, 로딩 중에 보여줄 UI를 fallback으로 지정합니다. */}
                <Suspense fallback={<div className="page-loading">Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        {/* PracticePage에도 onSongChange 핸들러를 전달하여 상태를 동기화합니다. */}
                        <Route
                            path="/practice"
                            element={<PracticePage song={currentSong} onSongChange={handleSongChange} />}
                        />
                        <Route
                            path="/sheet-music"
                            element={<SheetMusicPage song={currentSong} onSongChange={handleSongChange} />}
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Suspense>
            </main>
        </Router>
    );
}

export default App;