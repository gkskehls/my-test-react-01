import type { Song } from './types';

// data 폴더 하위의 모든 폴더에 속한 모든 .json 파일을 자동으로 읽어옵니다.
const songModules = import.meta.glob('./data/**/*.json', { eager: true });

// 불러온 파일들의 데이터 내용만 뽑아서 하나의 배열로 만듭니다.
export const songs: Song[] = Object.values(songModules).map((module: any) => module.default);

export * from './types';