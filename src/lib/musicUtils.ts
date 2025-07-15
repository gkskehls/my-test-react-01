// 음표의 수직 위치를 계산하는 순수 함수입니다.
export const getNoteStepDifference = (note: string): number => {
    const noteSteps: { [key: string]: number } = {
        C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
    };
    const noteName = note.slice(0, 1);
    const octave = parseInt(note.slice(1, 2));

    // 기준음: 높은음자리표의 두 번째 줄인 G4
    const baseNoteStep = noteSteps['G'] + 4 * 7;
    const currentNoteStep = noteSteps[noteName] + octave * 7;

    return baseNoteStep - currentNoteStep;
};