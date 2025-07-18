// src/lib/musicUtils.ts

// [추가] 플랫(b)을 샵(#)으로 변환하는 맵
const flatToSharpMap: { [key: string]: string } = {
    Db: 'C#',
    Eb: 'D#',
    Gb: 'F#',
    Ab: 'G#',
    Bb: 'A#',
};

/**
 * [추가] 음표 이름을 샵(#) 표기법으로 표준화합니다.
 * 예: 'Gb4' -> 'F#4', 'C4' -> 'C4', 'C#4' -> 'C#4'
 * @param noteName 변환할 음표 이름
 * @returns 샵(#)으로 표준화된 음표 이름
 */
export const normalizeNoteName = (noteName: string): string => {
    const match = noteName.match(/([A-G]b)(\d+)/);
    if (match) {
        const pitch = match[1]; // 예: "Gb"
        const octave = match[2]; // 예: "4"
        const sharpEquiv = flatToSharpMap[pitch];
        if (sharpEquiv) {
            return `${sharpEquiv}${octave}`;
        }
    }
    // 플랫이 아니거나 변환 규칙이 없으면 그대로 반환
    return noteName;
};


// 음표의 수직 위치를 계산하는 순수 함수입니다.
export const getNoteStepDifference = (note: string): number => {
    const noteSteps: { [key: string]: number } = {
        C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
    };

    // 정규식을 사용해 음이름, 임시표(#/b), 옥타브를 정확하게 분리합니다.
    const match = note.match(/([A-G])([b#]?)(\d+)/);

    // 잘못된 형식의 음표가 들어오면 콘솔에 경고를 남기고 기본 위치(G4)를 반환합니다.
    if (!match) {
        console.warn(`Invalid note format provided: ${note}`);
        return 0;
    }

    const [, baseNoteName, , octaveStr] = match;
    const octave = parseInt(octaveStr, 10);

    // 기준음: 높은음자리표의 두 번째 줄인 G4
    const baseNoteStep = noteSteps['G'] + 4 * 7;

    // 임시표와 관계없이 기본 음이름(A-G)과 옥타브를 기준으로 수직 위치를 계산합니다.
    // (예: G4와 Gb4는 악보의 같은 줄에 위치합니다)
    const currentNoteStep = noteSteps[baseNoteName] + octave * 7;

    return baseNoteStep - currentNoteStep;
};