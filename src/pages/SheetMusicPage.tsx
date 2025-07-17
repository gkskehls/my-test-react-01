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
    // 레이아웃 값이 준비되지 않았으면 빈 배열을 반환하여 렌더링을 방지합니다.
    if (layout.containerWidth === 0) {
        return [];
    }

    // 1. CSS와 동일한 로직으로 각 마디의 너비를 계산합니다.
    //    음표 개수 * 음표 간격으로 계산하여, 기존의 부정확한 로직을 수정합니다.
    const barWidths = song.lines.map(bar => bar.length * layout.noteSpacing);

    const newGroupedLines: SongNote[][] = [];
    let currentLineNotes: SongNote[] = [];
    // 2. 한 줄에 들어갈 수 있는 전체 너비에서 좌우 여백을 제외하여 실제 콘텐츠 영역 너비를 계산합니다.
    const contentWidth = layout.containerWidth - layout.staffPaddingLeft - layout.staffPaddingRight;
    let currentLineWidth = 0;

    song.lines.forEach((bar, index) => {
        const barWidth = barWidths[index];
        // 현재 라인에 이미 마디가 있다면 마디 사이 간격을 추가합니다.
        const spacing = currentLineNotes.length > 0 ? layout.minBarSpacing : 0;

        // 3. 콘텐츠 영역 너비(contentWidth)를 기준으로 오버플로우를 확인합니다.
        if (currentLineNotes.length > 0 && currentLineWidth + spacing + barWidth > contentWidth) {
            newGroupedLines.push(currentLineNotes);
            currentLineNotes = bar; // 새 줄 시작
            currentLineWidth = barWidth;
        } else {
            // 현재 줄에 마디를 추가합니다.
            currentLineNotes = [...currentLineNotes, ...bar];
            currentLineWidth += spacing + barWidth;
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
