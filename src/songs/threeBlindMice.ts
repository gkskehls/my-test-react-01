import { SongNote } from './types';

export const threeBlindMice: SongNote[][] = [
  // 1소절: Three blind mice, Three blind mice
  [
    { note: 'E4', duration: 'q', lyric: 'Three' }, { note: 'D4', duration: 'q', lyric: 'blind' },
    { note: 'C4', duration: 'h', lyric: 'mice' }, { note: 'E4', duration: 'q', lyric: 'Three' },
    { note: 'D4', duration: 'q', lyric: 'blind' }, { note: 'C4', duration: 'h', lyric: 'mice' },
  ],
  // 2소절: See how they run, See how they run
  [
    { note: 'G4', duration: 'q', lyric: 'See' }, { note: 'F4', duration: 'q', lyric: 'how' },
    { note: 'E4', duration: 'h', lyric: 'they run' }, { note: 'G4', duration: 'q', lyric: 'See' },
    { note: 'F4', duration: 'q', lyric: 'how' }, { note: 'E4', duration: 'h', lyric: 'they run' },
  ],
];