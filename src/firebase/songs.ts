import {
  collection,
  getDocs,
  query,
  orderBy,
  type FirestoreDataConverter,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase'; // 이미 생성된 firebase.ts에서 db 인스턴스를 가져옵니다.
import type { Song, SongNote } from '../songs/types';

/**
 * Song 타입에 대한 Firestore 컨버터입니다.
 * 이 컨버터는 Firestore에서 데이터를 읽고 쓸 때 자동으로 데이터 타입을 변환해주어,
 * 코드 전체에서 타입 안정성을 보장하고 반복적인 변환 로직을 제거합니다.
 * - fromFirestore: Firestore 문서를 Song 타입 객체로 변환합니다.
 * - toFirestore: Song 타입 객체를 Firestore가 저장할 수 있는 형태로 변환합니다.
 */
const songConverter: FirestoreDataConverter<Song> = {
  toFirestore(song: Song): DocumentData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = song; // id는 문서 데이터에 포함시키지 않기 위해 의도적으로 분리합니다.
    // 앱에서 사용하는 중첩 배열(lines)을 Firestore에 저장하기 위해 객체(맵) 형태로 변환합니다.
    const linesMap = song.lines.reduce((acc, line, index) => {
      acc[index.toString()] = line;
      return acc;
    }, {} as Record<string, SongNote[]>);
    return { ...data, lines: linesMap };
  },
  fromFirestore(snapshot, options): Song {
    const data = snapshot.data(options);
    const linesMap = data.lines as Record<string, SongNote[]>;

    // Firestore의 객체(맵) 형태인 lines를 앱에서 사용할 중첩 배열로 다시 변환합니다.
    // 키('0', '1', ..)를 숫자 기준으로 정렬하여 원래 순서를 완벽하게 복원합니다.
    const sortedLines: SongNote[][] = Object.entries(linesMap)
      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
      .map(([, line]) => line);

    return {
      id: snapshot.id,
      titleKey: data.titleKey,
      lines: sortedLines,
    };
  },
};

/**
 * Firestore에서 모든 곡의 목록을 비동기적으로 가져옵니다.
 * Firestore 컨버터를 사용하여 타입-세이프하게 데이터를 처리합니다.
 * @returns {Promise<Song[]>} 곡 데이터 배열을 담은 Promise.
 */
export async function getSongs(): Promise<Song[]> {
  // .withConverter를 사용하여 'songs' 컬렉션에 대한 참조를 생성합니다.
  const songsCollection = collection(db, 'songs').withConverter(songConverter);
  // 일관된 순서를 위해 titleKey를 기준으로 정렬하여 가져옵니다.
  const q = query(songsCollection, orderBy('titleKey'));
  const songSnapshot = await getDocs(q);

  // 이제 songSnapshot.docs.map(doc => doc.data())는 자동으로 Song[] 타입을 반환합니다.
  // 수동 변환이나 타입 단언(`as Song`)이 더 이상 필요 없습니다.
  return songSnapshot.docs.map(doc => doc.data());
}