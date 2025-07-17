// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
    .use(LanguageDetector)
    .use(HttpApi) // 백엔드 플러그인을 추가합니다.
    .use(initReactI18next)
    .init({
        // resources 옵션을 제거합니다.
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        // 개발 환경에서만 디버그 메시지를 활성화하여 프로덕션 빌드의 콘솔을 깨끗하게 유지합니다.
        // Vite는 `import.meta.env.DEV`를 통해 개발 모드 여부를 알려줍니다.
        debug: import.meta.env.DEV
    });

export default i18n;