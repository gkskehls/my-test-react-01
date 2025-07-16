import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // 이미 생성된 firebase.ts에서 db 인스턴스를 가져옵니다.
import type { Song, SongNote } from '../songs/types';

/**
 * Firestore에서 모든 곡의 목록을 비동기적으로 가져옵니다.
 * Firestore에 맵 형태로 저장된 'lines' 데이터를 앱에서 사용 가능한
 * 중첩 배열(SongNote[][]) 형태로 다시 변환합니다.
 * @returns {Promise<Song[]>} 곡 데이터 배열을 담은 Promise.
 */
export async function getSongs(): Promise<Song[]> {
  const songsCollection = collection(db, 'songs');
  // 일관된 순서를 위해 titleKey를 기준으로 정렬하여 가져옵니다.
  const q = query(songsCollection, orderBy('titleKey'));
  const songSnapshot = await getDocs(q);

  const songs = songSnapshot.docs.map(doc => {
    const data = doc.data();
    const linesMap = data.lines as Record<string, SongNote[]>;

    // 맵의 키('0', '1', ..)를 숫자 기준으로 정렬하여 원래의 중첩 배열 순서를 복원합니다.
    const sortedLines: SongNote[][] = Object.entries(linesMap)
      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
      .map(([, line]) => line);

    return { id: doc.id, ...data, lines: sortedLines } as Song;
  });

  return songs;
}