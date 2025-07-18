// src/context/SettingsContext.tsx
import { createContext, useState, useContext, useMemo, type ReactNode } from 'react';

// [추가] 가이드 모드 타입을 정의합니다.
export type GuideMode = 'full' | 'sheet-only' | 'rhythm-only' | 'none';

// 1. Context에서 관리할 데이터의 타입을 정의합니다.
interface SettingsContextType {
    showNoteNames: boolean;
    toggleNoteNames: () => void;
    guideMode: GuideMode; // [추가]
    setGuideMode: (mode: GuideMode) => void; // [추가]
}

// 2. Context 객체를 생성합니다.
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 3. 하위 컴포넌트에 Context를 제공할 Provider 컴포넌트를 만듭니다.
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [showNoteNames, setShowNoteNames] = useState(true);
    // [추가] 가이드 모드 상태를 추가하고, 기본값으로 'full'을 설정합니다.
    const [guideMode, setGuideMode] = useState<GuideMode>('full');

    const toggleNoteNames = () => {
        setShowNoteNames(prev => !prev);
    };

    // [수정] useMemo와 value에 새로운 상태와 함수를 포함시킵니다.
    const value = useMemo(() => ({
        showNoteNames,
        toggleNoteNames,
        guideMode,
        setGuideMode,
    }), [showNoteNames, guideMode]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

// 4. 컴포넌트에서 Context를 쉽게 사용하기 위한 커스텀 훅을 만듭니다.
export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};