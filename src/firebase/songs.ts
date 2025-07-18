import {
  collection,
  getDocs,
  query,
  orderBy,
  type FirestoreDataConverter,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Song, SongNote } from '../songs/types';
// [추가] 음표 이름 표준화 함수를 가져옵니다.
import { normalizeNoteName } from '../lib/musicUtils';

const songConverter: FirestoreDataConverter<Song> = {
  toFirestore(song: Song): DocumentData {
    // ... (toFirestore는 변경 없음)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = song;
    const linesMap = song.lines.reduce((acc, line, index) => {
      acc[index.toString()] = line;
      return acc;
    }, {} as Record<string, SongNote[]>);
    return { ...data, lines: linesMap };
  },
  fromFirestore(snapshot, options): Song {
    const data = snapshot.data(options);
    const linesMap = data.lines as Record<string, SongNote[]>;

    const sortedLines: SongNote[][] = Object.entries(linesMap)
        .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
        // [수정] 각 음표를 순회하며 note 값을 표준화합니다.
        .map(([, line]) =>
            line.map(note => ({
              ...note,
              note: normalizeNoteName(note.note), // 여기서 자동 변환이 일어납니다.
            }))
        );

    return {
      id: snapshot.id,
      titleKey: data.titleKey,
      categoryKey: data.categoryKey ?? 'category.unknown',
      difficultyKey: data.difficultyKey ?? 'difficulty.unknown',
      lines: sortedLines,
    };
  },
};

export async function getSongs(): Promise<Song[]> {
  const songsCollection = collection(db, 'songs').withConverter(songConverter);
  const q = query(songsCollection, orderBy('titleKey'));
  const songSnapshot = await getDocs(q);
  return songSnapshot.docs.map(doc => doc.data());
}