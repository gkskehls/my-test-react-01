// src/pages/SheetMusicPage.tsx
import React, { useState, useRef, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import SheetMusic from '../components/sheet-music/SheetMusic';
import { Song, SongNote } from '../songs';
import './SheetMusicPage.css';
import { useSheetMusicLayout, type LayoutMetrics } from '../hooks/useSheetMusicLayout';

// [수정] React.lazy를 사용하여 SongLibraryModal을 동적으로 가져옵니다.
// 이렇게 하면 이 컴포넌트의 코드가 별도의 청크로 분리됩니다.
const SongLibraryModal = lazy(() => import('../components/library/SongLibraryModal'));

/**
 * 화면 너비에 따라 악보의 마디(bar)들을 여러 줄로 나누는 핵심 로직입니다.
 * @param song - 현재 표시할 곡 데이터
 * @param layout - useSheetMusicLayout 훅에서 제공하는 현재 레이아웃 측정값
 * @returns {SongNote[][]} 여러 줄로 그룹화된 음표 배열
 */
const groupBarsIntoLines = (song: Song, layout: LayoutMetrics): SongNote[][] => {
    // 레이아웃 값이 준비되지 않았으면(특히 noteSpacing) 계산을 중단합니다.
    if (layout.containerWidth === 0 || layout.noteSpacing === 0) {
        return [];
    }

    const SAFETY_MARGIN = 10;
    const contentWidth = layout.containerWidth - layout.staffPaddingLeft - layout.staffPaddingRight - SAFETY_MARGIN;

    // --- 1단계: 너무 긴 마디를 미리 분할하기 ---
    // 한 줄에 들어갈 수 있는 한 마디 안의 최대 음표 개수를 계산합니다.
    // 너비 공식: (k-1) * noteSpacing <= contentWidth  => k <= contentWidth / noteSpacing + 1
    const maxNotesInBarOnOneLine = Math.floor(contentWidth / layout.noteSpacing) + 1;

    const processedSongLines: SongNote[][] = [];
    song.lines.forEach(bar => {
        if (bar.length > maxNotesInBarOnOneLine) {
            // 마디가 너무 길면, 최대 너비에 맞게 여러 개의 작은 마디로 분할합니다.
            let remainingNotes = [...bar];
            while (remainingNotes.length > 0) {
                const chunk = remainingNotes.splice(0, maxNotesInBarOnOneLine);
                processedSongLines.push(chunk);
            }
        } else {
            // 마디 길이가 적절하면 그대로 사용합니다.
            processedSongLines.push(bar);
        }
    });

    // --- 2단계: 분할된 마디들을 가지고 줄 배치하기 ---
    const newGroupedLines: SongNote[][] = [];
    let currentLineNotes: SongNote[] = [];
    let barsInCurrentLine = 0;

    const calculateWidth = (notes: SongNote[], barCount: number): number => {
        if (barCount === 0 || notes.length === 0) return 0;
        const noteSpaces = notes.length - barCount;
        const barSpaces = barCount > 1 ? (barCount - 1) : 0;
        return (noteSpaces * layout.noteSpacing) + (barSpaces * layout.minBarSpacing);
    };

    processedSongLines.forEach(bar => {
        if (bar.length === 0) return;

        const potentialNotes = [...currentLineNotes, ...bar];
        const potentialBarsInLine = barsInCurrentLine + 1;
        const notesAreaWidth = calculateWidth(potentialNotes, potentialBarsInLine);

        if (currentLineNotes.length > 0 && notesAreaWidth > contentWidth) {
            newGroupedLines.push(currentLineNotes);
            currentLineNotes = bar;
            barsInCurrentLine = 1;
        } else {
            currentLineNotes.push(...bar);
            barsInCurrentLine++;
        }
    });

    // 마지막에 남은 라인을 추가합니다.
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

    // 4. 커스텀 훅을 사용하여 반응형 레이아웃 값들을 가져옵니다.
    const layout = useSheetMusicLayout(wrapperRef);

    // 5. useMemo를 사용하여 song이나 layout 값이 변경될 때만 그룹핑을 다시 계산합니다.
    const groupedLines = useMemo(() => groupBarsIntoLines(song, layout), [song, layout]);

    return (
        <div className="sheet-music-page-container">
            <div className="sheet-music-header">
                {/* 버튼 클래스명을 더 명확하게 바꾸고, 현재 곡 제목과 아이콘을 표시합니다. */}
                <button className="song-selector-button" onClick={() => setIsLibraryOpen(true)}>
                    <span>{t(song.titleKey)}</span>
                    <span className="dropdown-icon">▼</span>
                </button>
            </div>
            {/* ref를 연결하여 너비를 측정합니다. */}
            <div className="sheet-music-lines-wrapper" ref={wrapperRef}>
                {groupedLines.map((line, index) => (
                    // [수정] 각 줄을 div로 한 번 더 감싸서 정렬을 제어합니다.
                    <div key={index} className="sheet-music-row">
                        <SheetMusic
                            notes={line}
                            idPrefix={`row-${index}`}
                        />
                    </div>
                ))}
            </div>

            {/* [수정] Suspense로 모달을 감싸줍니다. */}
            {/* 모달 코드를 다운로드하는 동안 fallback(여기서는 아무것도 표시하지 않음)을 보여줍니다. */}
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
