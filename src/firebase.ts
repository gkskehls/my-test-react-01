// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics"; // 1. Analytics import 추가

// .env 파일에서 환경 변수를 가져와 Firebase 설정을 구성합니다.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID // 2. measurementId 추가
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 다른 컴포넌트에서 사용할 수 있도록 서비스들을 내보냅니다.
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app); // 3. Analytics 초기화 및 내보내기