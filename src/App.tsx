// src/App.tsx
import { Routes, Route } from 'react-router-dom'; // 1. Routes, Route import
import './App.css';
import Header from './components/Header';
// 2. 방금 만든 페이지 컴포넌트들 import
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import SheetMusicPage from './pages/SheetMusicPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <div className="App">
            <Header />
            <main className="main-content">
                {/* 3. URL 경로에 따라 다른 컴포넌트를 보여주도록 설정 */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/practice" element={<PracticePage />} />
                    <Route path="/sheet-music" element={<SheetMusicPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
    