// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 리소스 정의
const resources = {
    // 영어
    en: {
        translation: {
            "appTitle": "Pitch Perfect",
            "practiceMode": "Practice Mode",
            "sheetMusicTitle": "Sheet Music",
            "changeLanguageToKo": "한국어로 변경",
            "changeLanguageToEn": "Switch to English",
            "lyricPlaceholder": "Lyric",
            // ▼▼▼ PracticePage를 위한 키 추가 ▼▼▼
            "practicePageTitle": "Practice: {{title}}",
            "congratsMessage": "Well Done!",
            "retryButton": "Retry",
            // ▼▼▼ Header & Home Page 키 추가 ▼▼▼
            "nav.practice": "Practice",
            "nav.sheetMusic": "Sheet Music",
            "nav.profile": "Profile",
            "home.title": "My Piano App",
            "home.welcome": "Welcome to the Piano Practice Project!",
            "home.description": "Use the top menu to navigate to the desired function.",
            "home.startPractice": "Start Practicing",
            // ▼▼▼ SheetMusicPage & ProfilePage 키 추가 ▼▼▼
            "sheetMusic.selectSong": "Select a Song",
            "profile.title": "My Profile",
            "profile.inPreparation": "This page is under construction.",
            // ▼▼▼ 문서 타이틀 키 추가 ▼▼▼
            "documentTitle": "Piano Practice"
        }
    },
    // 한국어
    ko: {
        translation: {
            "appTitle": "음정 연습",
            "practiceMode": "연습 모드",
            "sheetMusicTitle": "악보 보기",
            "changeLanguageToKo": "한국어로 변경",
            "changeLanguageToEn": "Switch to English",
            "lyricPlaceholder": "가사",
            // ▼▼▼ PracticePage를 위한 키 추가 ▼▼▼
            "practicePageTitle": "연습하기: {{title}}",
            "congratsMessage": "참 잘했어요!",
            "retryButton": "다시하기",
            // ▼▼▼ Header & Home Page 키 추가 ▼▼▼
            "nav.practice": "연습하기",
            "nav.sheetMusic": "악보 보기",
            "nav.profile": "내 정보",
            "home.title": "My Piano 앱",
            "home.welcome": "피아노 연습 프로젝트에 오신 것을 환영합니다!",
            "home.description": "상단 메뉴를 통해 원하는 기능으로 이동하세요.",
            "home.startPractice": "연습 시작하기",
            // ▼▼▼ SheetMusicPage & ProfilePage 키 추가 ▼▼▼
            "sheetMusic.selectSong": "곡을 선택하세요",
            "profile.title": "내 정보",
            "profile.inPreparation": "준비 중인 페이지입니다.",
            // ▼▼▼ 문서 타이틀 키 추가 ▼▼▼
            "documentTitle": "피아노 연습"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        debug: true
    });

export default i18n;