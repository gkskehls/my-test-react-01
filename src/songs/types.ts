export type NoteDuration = 'w' | 'h' | 'q' | '8'; // Whole, Half, Quarter, Eighth

export interface SongNote {
    note: string;
    duration: NoteDuration;
    lyric?: string; // 각 음표에 해당하는 가사를 위한 선택적 속성
}

export interface Song {
    id: string;
    title: string;
    lines: SongNote[][];
}
