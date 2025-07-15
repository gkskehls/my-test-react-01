import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SONG_LIST, Song } from './songs';

import Header from './components/ui/Header';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import SheetMusicPage from './pages/SheetMusicPage';
import ProfilePage from './pages/ProfilePage';

import './App.css';

function App() {
    const [currentSong, setCurrentSong] = useState<Song>(SONG_LIST[0]);

    const handleSongChange = (newSong: Song) => {
        setCurrentSong(newSong);
    };

    return (
        <Router>
            <Header />
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/practice" element={<PracticePage song={currentSong} />} />
                    <Route
                        path="/sheet-music"
                        element={<SheetMusicPage song={currentSong} onSongChange={handleSongChange} />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;