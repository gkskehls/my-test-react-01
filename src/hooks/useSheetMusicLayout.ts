// src/hooks/useSheetMusicLayout.ts
import { useState, useEffect } from 'react';

export interface LayoutMetrics {
    noteSpacing: number;
    staffPaddingLeft: number;
    staffPaddingRight: number;
    minBarSpacing: number;
    containerWidth: number;
}

/**
 * SheetMusic 레이아웃 계산에 필요한 반응형 값들을 제공하는 커스텀 훅.
 * CSS 미디어 쿼리와 동기화된 값을 반환하고, 화면 크기 변경을 감지하여 값을 업데이트합니다.
 * @param elementRef - 너비를 측정할 컨테이너 요소의 ref
 * @returns {LayoutMetrics} 현재 화면 크기에 맞는 레이아웃 측정값
 */
export const useSheetMusicLayout = (elementRef: React.RefObject<HTMLDivElement | null>): LayoutMetrics => {
    const [metrics, setMetrics] = useState<LayoutMetrics>({
        noteSpacing: 45,
        staffPaddingLeft: 100, // 높은음자리표가 차지하는 공간을 고려하여 기본 여백을 늘립니다.
        staffPaddingRight: 40,
        minBarSpacing: 20,
        containerWidth: 0,
    });

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const measure = () => {
            const isMobile = window.matchMedia('(max-width: 480px)').matches;
            setMetrics({
                noteSpacing: isMobile ? 38 : 45,
                staffPaddingLeft: isMobile ? 60 : 100, // CSS와 동기화: 모바일에서도 높은음자리표 공간을 충분히 확보합니다.
                staffPaddingRight: isMobile ? 10 : 40, // CSS와 동기화: 핸드폰 화면에서 오른쪽 여백을 줄여 공간 확보
                minBarSpacing: 20, // 마디 사이 간격은 상수로 유지
                containerWidth: element.offsetWidth,
            });
        };

        const observer = new ResizeObserver(measure);
        observer.observe(element);

        measure(); // 초기 측정

        return () => observer.disconnect();
    }, [elementRef]);

    return metrics;
};