// src/firebase/songs.ts
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc, // [추가]
  type FirestoreDataConverter,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Song, SongNote } from '../songs/types';
import { normalizeNoteName } from '../lib/musicUtils';

const songConverter: FirestoreDataConverter<Song> = {
  toFirestore(song: Song): DocumentData {
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
        .map(([, line]) =>
            line.map(note => ({
              ...note,
              note: normalizeNoteName(note.note),
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

// [추가] 새로운 곡을 Firestore에 추가하는 함수
export async function addSong(songData: Omit<Song, 'id'>): Promise<string> {
  // .withConverter를 사용하면 addDoc이 toFirestore를 자동으로 호출합니다.
  const songsCollection = collection(db, 'songs').withConverter(songConverter);
  const docRef = await addDoc(songsCollection, songData);
  return docRef.id;
}