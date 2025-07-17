import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // manualChunks 함수를 사용하여 번들링을 수동으로 제어합니다.
        manualChunks(id) {
          // node_modules에 포함된 모든 코드는 외부 라이브러리로 간주합니다.
          if (id.includes('node_modules')) {
            // firebase 관련 모듈은 'firebase'라는 이름의 청크로 그룹화합니다.
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // i18next 관련 모듈은 'i18n'이라는 이름의 청크로 그룹화합니다.
            if (id.includes('i18next')) {
              return 'i18n';
            }
            // 그 외 다른 모든 라이브러리는 'vendor' 청크에 포함시킵니다.
            return 'vendor';
          }
          // TS7030 오류를 해결하기 위해, node_modules에 해당하지 않는 모든 경로에 대해
          // 명시적으로 undefined를 반환합니다. 이는 Vite의 기본 청크 분할 방식을
          // 따르도록 하는 올바른 방법입니다.
          return;
        },
      },
    },
  },
})
