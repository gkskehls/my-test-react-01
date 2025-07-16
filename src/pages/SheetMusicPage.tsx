// src/pages/SheetMusicPage.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'; // `SongTabs`가 제거되었으므로 관련 import는 필요 없습니다.
import { useTranslation } from 'react-i18next';
import SheetMusic from '../components/sheet-music/SheetMusic';
import SongLibraryModal from '../components/library/SongLibraryModal'; // 새로 만든 모달 컴포넌트를 가져옵니다.
import { Song, SongNote } from '../songs'; // SONG_LIST는 이제 모달 내부에서 사용됩니다.
import './SheetMusicPage.css';

// --- 추가된 부분: 계산을 위한 상수 정의 ---
// 각 음표 길이에 따른 너비 값을 정의합니다. (SheetMusic.css와 동기화)
const DURATION_WIDTHS: { [key: string]: number } = {
    'q': 45, // 4분음표
    'h': 60, // 2분음표
    'w': 80, // 온음표
};
const DEFAULT_NOTE_WIDTH = DURATION_WIDTHS['q'];

// 악보의 좌우 여백과 최소 마디 간 간격입니다.
const STAFF_PADDING_LEFT = 80;
const STAFF_PADDING_RIGHT = 40;
const MIN_BAR_SPACING = 20; // 마디와 마디 사이의 최소 간격

// --- 여기까지 ---

interface SheetMusicPageProps {
    songs: Song[];
    song: Song;
    onSongChange: (newSong: Song) => void;
}

const SheetMusicPage: React.FC<SheetMusicPageProps> = ({ songs, song, onSongChange }) => {
    const { t } = useTranslation();
    const [groupedLines, setGroupedLines] = useState<SongNote[][]>([]);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false); // 모달의 표시 여부를 관리하는 상태
    const wrapperRef = useRef<HTMLDivElement>(null);

    // useMemo를 사용해 각 마디의 너비를 미리 계산해 둡니다. (성능 최적화)
    const barWidths = useMemo(() => {
        return song.lines.map(line => {
            const notesWidth = line.reduce((total, note) => {
                return total + (DURATION_WIDTHS[note.duration] || DEFAULT_NOTE_WIDTH);
            }, 0);
            // 각 마디의 너비는 음표 너비 합 + 좌우 여백입니다.
            return notesWidth + STAFF_PADDING_LEFT + STAFF_PADDING_RIGHT;
        });
    }, [song.lines]);

    // useCallback을 사용해 마디 그룹핑 함수를 메모이제이션합니다.
    const groupBarsIntoLines = useCallback(() => {
        if (!wrapperRef.current || barWidths.length === 0) return;

        const containerWidth = wrapperRef.current.offsetWidth;

        const newGroupedLines: SongNote[][] = [];
        let currentLineNotes: SongNote[] = [];
        let currentLineWidth = 0;

        song.lines.forEach((bar, index) => {
            const barWidth = barWidths[index];

            if (currentLineNotes.length > 0 && currentLineWidth + MIN_BAR_SPACING + barWidth > containerWidth) {
                // 현재 라인에 더 이상 마디가 들어갈 수 없으면 라인을 확정합니다.
                newGroupedLines.push(currentLineNotes);
                // 새 라인을 시작합니다.
                currentLineNotes = bar;
                currentLineWidth = barWidth;
            } else {
                // 현재 라인에 마디를 추가합니다.
                currentLineNotes = [...currentLineNotes, ...bar];
                // 너비를 업데이트 (첫 마디가 아닐 경우에만 간격 추가)
                currentLineWidth += (currentLineNotes.length > bar.length ? MIN_BAR_SPACING : 0) + barWidth;
            }
        });

        // 마지막에 남은 라인이 있다면 추가합니다.
        if (currentLineNotes.length > 0) {
            newGroupedLines.push(currentLineNotes);
        }

        // 실제 그룹 구성이 변경되었을 때만 상태를 업데이트하여 불필요한 리렌더링을 방지합니다.
        setGroupedLines(prev => {
            if (JSON.stringify(prev) === JSON.stringify(newGroupedLines)) {
                return prev;
            }
            return newGroupedLines;
        });

    }, [song.lines, barWidths]);

    // ResizeObserver를 설정하여 컨테이너 너비 변경을 감지합니다.
    useEffect(() => {
        const wrapperElement = wrapperRef.current;
        if (!wrapperElement) return;

        const observer = new ResizeObserver(groupBarsIntoLines);
        observer.observe(wrapperElement);

        groupBarsIntoLines(); // 초기 계산 실행

        return () => observer.disconnect();
    }, [groupBarsIntoLines]);

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

            {isLibraryOpen && (
                <SongLibraryModal
                    songs={songs}
                    onClose={() => setIsLibraryOpen(false)}
                    onSongSelect={onSongChange}
                />
            )}
        </div>
    );
};

export default SheetMusicPage;
