import { twinkleTwinkle } from './twinkleTwinkle';
import { threeBlindMice } from './threeBlindMice';
import type { Song } from './types';

// 전체 노래 목록
export const SONG_LIST: Song[] = [
    {
        id: 'twinkle-twinkle',
        titleKey: 'songs.twinkle-twinkle', // title을 titleKey로 변경
        lines: twinkleTwinkle,
    },
    {
        id: 'three-blind-mice',
        titleKey: 'songs.three-blind-mice', // title을 titleKey로 변경
        lines: threeBlindMice,
    },
];

// 다른 파일에서 타입을 쉽게 가져올 수 있도록 다시 export 합니다.
export * from './types';