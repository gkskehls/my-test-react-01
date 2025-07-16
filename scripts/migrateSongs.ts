// In projects with mixed module types ("type": "module" in package.json), TypeScript's `esModuleInterop`
// setting can sometimes be misinterpreted by build tools for script files. The error `TS1259` indicates this is happening.
// A robust way to resolve this is to use a namespace import (`import * as ...`), which does not
// rely on the `esModuleInterop` flag for CommonJS modules like `firebase-admin`.
import * as admin from 'firebase-admin';

// 1. Import the service account key. tsconfig's `resolveJsonModule` will handle this.
// To import JSON in an ES module, use an import attribute (`with`).
// The older `assert` syntax is deprecated in Node.js v20+.
import serviceAccount from './serviceAccountKey.json' with { type: 'json' };

// 2. 로컬에 저장된 곡 데이터를 import 합니다.
import { SONG_LIST } from '../src/songs';

// Firebase Admin SDK 초기화
// serviceAccount는 JSON 객체이므로 타입 단언이 필요합니다.
// When using `import * as admin`, the actual CJS module exports are nested under the `default` property.
admin.default.initializeApp({
    // Access the `credential` object via `admin.default`. The type `admin.ServiceAccount` is a named export and correctly accessed.
    credential: admin.default.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.default.firestore();
const songsCollection = db.collection('songs');

async function migrateSongs() {
    console.log('곡 데이터 마이그레이션을 시작합니다...');

    // 여러 개의 비동기 작업을 병렬로 처리하여 성능을 최적화합니다.
    // SONG_LIST의 각 song에 대해 업로드 Promise를 생성합니다.
    const uploadPromises = SONG_LIST.map(async (song) => {
      try {
        // 문서 ID를 song.id로 지정하여 데이터를 저장합니다.
        // 이렇게 하면 'twinkle-twinkle' 같은 예측 가능한 ID를 가질 수 있습니다.
        const docRef = songsCollection.doc(song.id);

        // song 객체에서 id를 제외한 나머지 데이터를 저장합니다.
        // Firestore 문서 자체가 ID를 가지므로 데이터 안에 ID를 중복 저장할 필요가 없습니다.
        // 'id'를 사용하지 않는 변수임을 명시하기 위해 '_id'로 받습니다.
        const { id: _id, ...songData } = song;

        // Firestore는 중첩 배열(array of arrays)을 지원하지 않습니다.
        // `lines` 필드(SongNote[][])를 Firestore가 지원하는 맵(map) 형태로 변환합니다.
        // 각 소절(line)의 인덱스를 객체의 키로 사용합니다.
        const dataToUpload = {
          ...songData,
          lines: Object.fromEntries(
            songData.lines.map((line, index) => [index, line])
          ),
        };

        await docRef.set(dataToUpload);
        console.log(`✅ 성공: '${song.id}' 곡이 성공적으로 업로드되었습니다.`);
      } catch (error) {
        console.error(`❌ 실패: '${song.id}' 곡 업로드 중 오류 발생:`, error);
      }
    });

    // 모든 업로드 작업이 완료될 때까지 기다립니다.
    await Promise.all(uploadPromises);

    console.log('-----');
    console.log('모든 곡 데이터 마이그레이션이 완료되었습니다.');
}

migrateSongs();