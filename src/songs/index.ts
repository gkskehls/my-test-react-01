import { twinkleTwinkle } from './twinkleTwinkle';
import { threeBlindMice } from './threeBlindMice';
import type { Song } from './types';

// 전체 노래 목록
export const SONG_LIST: Song[] = [
    {
        id: 'twinkle-twinkle',
        title: '반짝반짝 작은 별',
        lines: twinkleTwinkle,
    },
    {
        id: 'three-blind-mice',
        title: 'Three Blind Mice',
        lines: threeBlindMice,
    },
];

// 다른 파일에서 타입을 쉽게 가져올 수 있도록 다시 export 합니다.
export * from './types';