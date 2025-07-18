// scripts/uploadSong.js
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES 모듈에서는 __dirname을 직접 사용할 수 없으므로, import.meta.url을 통해 현재 파일 경로를 얻어옵니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 서비스 계정 키 파일 경로
// require() 대신 fs.readFileSync를 사용하여 JSON 파일을 읽고 파싱합니다.
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// 2. 업로드할 악보 데이터 파일 경로
const songDataPath = path.join(__dirname, 'new_song.json');

// Firebase Admin 초기화
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadSong() {
    try {
        // JSON 파일 읽기
        const fileContent = fs.readFileSync(songDataPath, 'utf8');
        const songData = JSON.parse(fileContent);

        if (!songData.titleKey) {
            throw new Error('Song data must include a titleKey.');
        }

        // 'songs' 컬렉션에 데이터 추가
        const songsCollection = db.collection('songs');
        const docRef = await songsCollection.add(songData);

        console.log(`✅ Song "${songData.titleKey}" was successfully uploaded with ID: ${docRef.id}`);

    } catch (error) {
        console.error('❌ Error uploading song:', error);
    }
}

uploadSong();