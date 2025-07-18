// src/pages/SheetMusicPage.tsx
import React, { useState, useRef, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song, SongNote } from '../songs';
import './SheetMusicPage.css';
import { useSheetMusicLayout, type LayoutMetrics } from '../hooks/useSheetMusicLayout';
import { useLyricWidths } from '../hooks/useLyricWidths';

const SongLibraryModal = lazy(() => import('../components/library/SongLibraryModal'));

const groupBarsIntoLines = (
    song: Song,
    layout: LayoutMetrics,
    lyricWidths: Record<string, number>
): SongNote[][] => {
    if (layout.containerWidth === 0 || layout.noteSpacing === 0 || Object.keys(lyricWidths).length === 0) {
        return [];
    }

    const SAFETY_MARGIN = 10;
    const contentWidth = layout.containerWidth - layout.staffPaddingLeft - layout.staffPaddingRight - SAFETY_MARGIN;

    const getNoteWidth = (note: SongNote): number => {
        if (note.lyricKey && lyricWidths[note.lyricKey]) {
            const LYRIC_PADDING = 8;
            return Math.max(layout.noteSpacing, lyricWidths[note.lyricKey] + LYRIC_PADDING);
        }
        return layout.noteSpacing;
    };

    const getBarWidth = (bar: SongNote[]): number => {
        return bar.reduce((sum, note) => sum + getNoteWidth(note), 0);
    };

    const processedSongLines: SongNote[][] = [];
    song.lines.forEach(originalBar => {
        if (getBarWidth(originalBar) > contentWidth) {
            let chunk: SongNote[] = [];
            let chunkWidth = 0;
            originalBar.forEach(note => {
                const noteWidth = getNoteWidth(note);
                if (chunk.length > 0 && chunkWidth + noteWidth > contentWidth) {
                    processedSongLines.push(chunk);
                    chunk = [note];
                    chunkWidth = noteWidth;
                } else {
                    chunk.push(note);
                    chunkWidth += noteWidth;
                }
            });
            if (chunk.length > 0) {
                processedSongLines.push(chunk);
            }
        } else {
            processedSongLines.push(originalBar);
        }
    });

    const newGroupedLines: SongNote[][] = [];
    let currentLineNotes: SongNote[] = [];
    let barsInCurrentLine = 0;

    const calculateLineWidth = (notes: SongNote[], barCount: number): number => {
        if (barCount === 0 || notes.length === 0) return 0;
        const notesWidth = notes.reduce((sum, note) => sum + getNoteWidth(note), 0);
        const barSpacesWidth = barCount > 1 ? (barCount - 1) * layout.minBarSpacing : 0;
        return notesWidth + barSpacesWidth;
    };

    processedSongLines.forEach(bar => {
        if (bar.length === 0) return;
        const potentialWidth = calculateLineWidth([...currentLineNotes, ...bar], barsInCurrentLine + 1);
        if (currentLineNotes.length > 0 && potentialWidth > contentWidth) {
            newGroupedLines.push(currentLineNotes);
            currentLineNotes = [...bar];
            barsInCurrentLine = 1;
        } else {
            currentLineNotes.push(...bar);
            barsInCurrentLine++;
        }
    });

    if (currentLineNotes.length > 0) {
        newGroupedLines.push(currentLineNotes);
    }
    return newGroupedLines;
};

interface SheetMusicPageProps {
    songs: Song[];
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const SheetMusicPage: React.FC<SheetMusicPageProps> = ({ songs, song, onSongChange }) => {
    const { t } = useTranslation();
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const layout = useSheetMusicLayout(wrapperRef);
    const lyricWidths = useLyricWidths(song);
    const groupedLines = useMemo(() => groupBarsIntoLines(song, layout, lyricWidths), [song, layout, lyricWidths]);

    return (
        <div className="sheet-music-page-container">
            <div className="sheet-music-header">
                <button className="song-selector-button" onClick={() => setIsLibraryOpen(true)}>
                    <span>{t(song.titleKey)}</span>
                    <span className="dropdown-icon">▼</span>
                </button>
            </div>
            <div className="sheet-music-lines-wrapper" ref={wrapperRef}>
                {groupedLines.map((line, index) => (
                    <div key={index} className="sheet-music-row">
                        <SheetMusic
                            notes={line}
                            idPrefix={`row-${index}`}
                            // [수정] 위치 계산에 필요한 props를 전달합니다.
                            layout={layout}
                            lyricWidths={lyricWidths}
                        />
                    </div>
                ))}
            </div>

            <Suspense fallback={null}>
                {isLibraryOpen && (
                    <SongLibraryModal
                        currentSong={song}
                        songs={songs}
                        onClose={() => setIsLibraryOpen(false)}
                        onSongSelect={onSongChange}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default SheetMusicPage;