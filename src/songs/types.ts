// 악보와 관련된 모든 타입을 이곳에서 중앙 관리합니다.
export interface SongNote {
    note: string;
    duration: string;
}

export interface Song {
    id: string;
    title: string;
    lines: SongNote[][];
}
