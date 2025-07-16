// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 리소스 정의
const resources = {
    // 영어 리소스
    en: {
        translation: {
            // 헤더 및 홈 페이지
            "nav.practice": "Practice",
            "nav.sheetMusic": "Sheet Music",
            "nav.profile": "Profile",
            "home.title": "My Piano App",
            "home.welcome": "Welcome to the Piano Practice Project!",
            "home.description": "Use the top menu to navigate to the desired function.",
            "home.startPractice": "Start Practicing",

            // 연습 페이지
            "practicePageTitle": "Practice: {{title}}",
            "congratsMessage": "Well Done!",
            "retryButton": "Retry",

            // 악보 및 프로필 페이지
            "sheetMusic.selectSong": "Select a Song",
            "profile.title": "My Profile",
            "profile.inPreparation": "This page is under construction.",

            // 음이름 (피아노, 악보)
            "notes": {
                "C": "C", "Csharp": "C#",
                "D": "D", "Dsharp": "D#",
                "E": "E",
                "F": "F", "Fsharp": "F#",
                "G": "G", "Gsharp": "G#",
                "A": "A", "Asharp": "A#",
                "B": "B"
            },

            // 레거시 또는 미분류 키 (정리 필요)
            "appTitle": "Pitch Perfect",
            "practiceMode": "Practice Mode",
            "sheetMusicTitle": "Sheet Music",
            "changeLanguageToKo": "한국어로 변경",
            "changeLanguageToEn": "Switch to English",
            "lyricPlaceholder": "Lyric",
            "documentTitle": "Piano Practice"
        }
    },
    // 한국어 리소스
    ko: {
        translation: {
            // 헤더 및 홈 페이지
            "nav.practice": "연습하기",
            "nav.sheetMusic": "악보 보기",
            "nav.profile": "내 정보",
            "home.title": "My Piano 앱",
            "home.welcome": "피아노 연습 프로젝트에 오신 것을 환영합니다!",
            "home.description": "상단 메뉴를 통해 원하는 기능으로 이동하세요.",
            "home.startPractice": "연습 시작하기",

            // 연습 페이지
            "practicePageTitle": "연습하기: {{title}}",
            "congratsMessage": "참 잘했어요!",
            "retryButton": "다시하기",

            // 악보 및 프로필 페이지
            "sheetMusic.selectSong": "곡을 선택하세요",
            "profile.title": "내 정보",
            "profile.inPreparation": "준비 중인 페이지입니다. 잠시만 기다려주세요.",

            // 음이름 (피아노, 악보)
            "notes": {
                "C": "도", "Csharp": "도#",
                "D": "레", "Dsharp": "레#",
                "E": "미",
                "F": "파", "Fsharp": "파#",
                "G": "솔", "Gsharp": "솔#",
                "A": "라", "Asharp": "라#",
                "B": "시"
            },

            // 레거시 또는 미분류 키 (정리 필요)
            "appTitle": "음정 연습",
            "practiceMode": "연습 모드",
            "sheetMusicTitle": "악보 보기",
            "changeLanguageToKo": "한국어로 변경",
            "changeLanguageToEn": "Switch to English",
            "lyricPlaceholder": "가사",
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