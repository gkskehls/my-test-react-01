import { twinkleTwinkle, SongNote } from './twinkleTwinkle';
import { threeBlindMice } from './threeBlindMice';

// 개별 노래의 전체 정보를 담을 타입
export interface Song {
    id: string;       // 고유 ID
    title: string;    // 노래 제목
    notes: SongNote[]; // 악보 데이터
}

// 전체 노래 목록
export const SONG_LIST: Song[] = [
    {
        id: 'twinkle-twinkle',
        title: '반짝반짝 작은 별',
        notes: twinkleTwinkle,
    },
    {
        id: 'three-blind-mice',
        title: 'Three Blind Mice',
        notes: threeBlindMice,
    },
    // 나중에 여기에 새로운 노래를 추가하기만 하면 됩니다.
];