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

            // 곡 제목
            "songs": {
                "twinkle-twinkle": "Twinkle, Twinkle, Little Star",
                "three-blind-mice": "Three Blind Mice"
            },

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

            // 가사
            "lyrics": {
                "twinkle": {
                    "0": { "0": "Twin", "1": "kle,", "2": "twin", "3": "kle,", "4": "lit", "5": "tle", "6": "star" },
                    "1": { "0": "How", "1": "I", "2": "won", "3": "der", "4": "what", "5": "you", "6": "are" },
                    "2": { "0": "Up", "1": "a", "2": "bove", "3": "the", "4": "world", "5": "so", "6": "high" },
                    "3": { "0": "Like", "1": "a", "2": "dia", "3": "mond", "4": "in", "5": "the", "6": "sky" },
                    "4": { "0": "Twin", "1": "kle,", "2": "twin", "3": "kle,", "4": "lit", "5": "tle", "6": "star" },
                    "5": { "0": "How", "1": "I", "2": "won", "3": "der", "4": "what", "5": "you", "6": "are" }
                },
                "threeBlindMice": {
                    "0": { "0": "Three", "1": "blind", "2": "mice", "3": "Three", "4": "blind", "5": "mice" },
                    "1": { "0": "See", "1": "how", "2": "they run", "3": "See", "4": "how", "5": "they run" },
                    "2": { "0": "They", "1": "all", "2": "ran", "3": "af-", "4": "ter", "5": "the", "6": "wife," },
                    "3": { "0": "Who", "1": "cut", "2": "off", "3": "their", "4": "tails", "5": "with a", "6": "knife," },
                    "4": { "0": "Did", "1": "you", "2": "e-ver", "3": "see", "4": "such a", "5": "sight," },
                    "5": { "0": "As", "1": "three", "2": "blind mice." }
                }
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

            // 곡 제목
            "songs": {
                "twinkle-twinkle": "반짝반짝 작은 별",
                "three-blind-mice": "눈 먼 생쥐 세 마리"
            },

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

            // 가사
            "lyrics": {
                "twinkle": {
                    "0": { "0": "반", "1": "짝", "2": "반", "3": "짝", "4": "작", "5": "은", "6": "별" },
                    "1": { "0": "아", "1": "름", "2": "답", "3": "게", "4": "비", "5": "치", "6": "네" },
                    "2": { "0": "동", "1": "쪽", "2": "하", "3": "늘", "4": "에", "5": "서", "6": "도" },
                    "3": { "0": "서", "1": "쪽", "2": "하", "3": "늘", "4": "에", "5": "서", "6": "도" },
                    "4": { "0": "반", "1": "짝", "2": "반", "3": "짝", "4": "작", "5": "은", "6": "별" },
                    "5": { "0": "아", "1": "름", "2": "답", "3": "게", "4": "비", "5": "치", "6": "네" }
                },
                "threeBlindMice": {
                    "0": { "0": "눈 먼", "1": "생쥐", "2": "세 마리", "3": "눈 먼", "4": "생쥐", "5": "세 마리" },
                    "1": { "0": "저것 봐", "1": "어떻게", "2": "달리는지", "3": "저것 봐", "4": "어떻게", "5": "달리는지" },
                    "2": { "0": "모두", "1": "농부", "2": "아내를", "3": "쫓", "4": "아", "5": "달려", "6": "갔네," },
                    "3": { "0": "그녀가", "1": "식칼로", "2": "꼬릴", "3": "모두", "4": "잘라", "5": "버렸", "6": "대요," },
                    "4": { "0": "이런", "1": "광경을", "2": "본 적", "3": "있나요", "4": "내 평생", "5": "이런 일은," },
                    "5": { "0": "눈 먼", "1": "생쥐", "2": "세 마리." }
                }
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