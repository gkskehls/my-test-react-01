// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';

// 1. 테마 타입과 Context 타입을 명확하게 정의합니다.
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// 2. Context를 생성합니다. Provider 외부에서 사용할 경우를 대비해 초기값은 undefined로 설정합니다.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. 앱 전체에 테마 상태를 제공할 Provider 컴포넌트를 생성합니다.
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 4. 상태를 초기화할 때, localStorage에 저장된 테마를 우선적으로 사용하고,
    // 없다면 사용자의 OS 설정을 기본값으로 사용합니다.
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // 5. 테마가 변경될 때마다 <html> 태그의 클래스를 업데이트하고, localStorage에 선택을 저장합니다.
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 6. 테마를 'light'와 'dark' 사이에서 전환하는 함수입니다.
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // 7. useMemo를 사용해 context 값을 메모이제이션하여 불필요한 리렌더링을 방지합니다.
    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// 8. 다른 컴포넌트에서 Context를 쉽게 사용할 수 있도록 커스텀 훅을 만듭니다.
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};