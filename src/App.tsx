// src/App.tsx
import { useState } from 'react'; // 1. useState import
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import SheetMusicPage from './pages/SheetMusicPage';
import ProfilePage from './pages/ProfilePage';
import { SONG_LIST, Song } from './songs'; // 2. 중앙 악보집에서 노래 목록 가져오기

function App() {
    // 3. 어떤 노래가 선택되었는지 상태로 관리 (기본값: 첫 번째 노래)
    const [selectedSong, setSelectedSong] = useState<Song>(SONG_LIST[0]);

    return (
        <div className="App">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* 4. 각 페이지에 선택된 노래 정보와, 노래를 변경하는 함수를 props로 전달 */}
                    <Route
                        path="/practice"
                        element={<PracticePage song={selectedSong} />}
                    />
                    <Route
                        path="/sheet-music"
                        element={<SheetMusicPage song={selectedSong} onSongChange={setSelectedSong} />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;