export type NoteDuration = 'w' | 'h' | 'q' | '8'; // Whole, Half, Quarter, Eighth

export interface SongNote {
    note: string;
    duration: NoteDuration;
    lyricKey?: string; // 각 음표에 해당하는 가사의 번역 키
}

export interface Song {
    id: string;
    title: string;
    lines: SongNote[][];
}
