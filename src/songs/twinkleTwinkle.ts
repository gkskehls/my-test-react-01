// src/songs/twinkleTwinkle.ts

// 각 음표의 정보를 담을 데이터 타입 정의
export interface SongNote {
    note: string; // 예: 'C4'
    displayName: string; // 예: '도' (화면 표시용)
    // 나중에는 박자(duration) 같은 정보도 추가할 수 있습니다.
}

// '반짝반짝 작은 별' 앞부분 멜로디
export const twinkleTwinkle: SongNote[] = [
    { note: 'C4', displayName: '도' }, { note: 'C4', displayName: '도' },
    { note: 'G4', displayName: '솔' }, { note: 'G4', displayName: '솔' },
    { note: 'A4', displayName: '라' }, { note: 'A4', displayName: '라' },
    { note: 'G4', displayName: '솔' },
    { note: 'F4', displayName: '파' }, { note: 'F4', displayName: '파' },
    { note: 'E4', displayName: '미' }, { note: 'E4', displayName: '미' },
    { note: 'D4', displayName: '레' }, { note: 'D4', displayName: '레' },
    { note: 'C4', displayName: '도' },
];