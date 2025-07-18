// src/context/SettingsContext.tsx
import { createContext, useState, useContext, type ReactNode } from 'react';

// 1. Context에서 관리할 데이터의 타입을 정의합니다.
interface SettingsContextType {
    showNoteNames: boolean;
    toggleNoteNames: () => void;
}

// 2. Context 객체를 생성합니다.
//    타입스크립트를 위해 기본값을 제공하지만, Provider 없이는 사용되지 않을 것입니다.
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 3. 하위 컴포넌트에 Context를 제공할 Provider 컴포넌트를 만듭니다.
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [showNoteNames, setShowNoteNames] = useState(true); // 기본값은 '보이기'

    const toggleNoteNames = () => {
        setShowNoteNames(prev => !prev);
    };

    const value = { showNoteNames, toggleNoteNames };

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