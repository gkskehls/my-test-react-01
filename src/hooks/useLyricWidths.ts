// src/hooks/useLyricWidths.ts
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../songs';

/**
 * 텍스트 너비를 측정하는 헬퍼 함수입니다.
 * 성능을 위해 보이지 않는 단일 span 요소를 재사용하고,
 * CSS에 정의된 실제 가사 폰트 스타일을 동적으로 읽어와 정확도를 보장합니다.
 */
const measureText = (() => {
    let span: HTMLSpanElement | null = null;
    let computedFont: string | null = null;

    // 실제 .lyric 클래스의 폰트 스타일을 동적으로 계산하고 캐싱하는 함수
    const getComputedLyricFont = (): string => {
        if (computedFont) {
            return computedFont;
        }

        // 1. 임시 요소를 만들어 실제 가사 스타일을 적용합니다.
        const tempLyric = document.createElement('span');
        tempLyric.className = 'lyric'; // 실제 가사 요소와 동일한 클래스
        // 화면에 보이지 않게 처리
        tempLyric.style.visibility = 'hidden';
        tempLyric.style.position = 'absolute';
        tempLyric.textContent = 'temp'; // getComputedStyle을 위해 임시 텍스트 추가
        document.body.appendChild(tempLyric);

        // 2. 브라우저가 계산한 최종 폰트 스타일을 가져옵니다.
        computedFont = window.getComputedStyle(tempLyric).font;

        // 3. 임시 요소를 DOM에서 제거합니다.
        document.body.removeChild(tempLyric);

        // 만약 어떤 이유로든 폰트를 가져오지 못했을 경우를 대비한 폴백
        if (!computedFont) {
            console.warn("'.lyric' 클래스의 폰트 스타일을 계산할 수 없어 기본값으로 대체합니다.");
            computedFont = '14px sans-serif';
        }

        return computedFont;
    };


    const getSpan = () => {
        if (!span) {
            span = document.createElement('span');
            // 화면에 보이지 않도록 스타일링합니다.
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'nowrap';
            span.style.top = '-9999px';
            span.style.left = '-9999px';
            // [개선] 하드코딩된 폰트 대신, 동적으로 계산된 폰트 스타일을 적용합니다.
            span.style.font = getComputedLyricFont();
            document.body.appendChild(span);
        }
        return span;
    }
    return (text: string) => {
        const measurementSpan = getSpan();
        measurementSpan.textContent = text;
        return measurementSpan.getBoundingClientRect().width;
    };
})();

export const useLyricWidths = (song: Song) => {
    const { t } = useTranslation();
    const [widths, setWidths] = useState<Record<string, number>>({});

    useLayoutEffect(() => {
        // 이제 measureText가 내부적으로 폰트를 관리하므로, 이펙트는 더 단순해집니다.
        const uniqueLyricKeys = new Set(song.lines.flat().map(note => note.lyricKey).filter(Boolean) as string[]);
        const newWidths: Record<string, number> = {};
        uniqueLyricKeys.forEach(key => {
            newWidths[key] = measureText(t(key));
        });
        setWidths(newWidths);
    }, [song, t]); // 곡이나 언어가 변경되면 다시 측정합니다.

    return widths;
};