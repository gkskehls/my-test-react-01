export type NoteDuration = 'w' | 'h' | 'q' | '8'; // Whole, Half, Quarter, Eighth

export interface SongNote {
    note: string;
    duration: NoteDuration;
    lyricKey?: string; // 각 음표에 해당하는 가사의 번역 키
}

export interface Song {
    id: string;
    titleKey: string; // 번역 키를 사용하도록 title을 titleKey로 변경
    categoryKey: string; // "category.childrens", "category.classical" 같은 번역 키
    difficultyKey: string; // "difficulty.beginner" 같은 난이도 번역 키
    lines: SongNote[][];
}
