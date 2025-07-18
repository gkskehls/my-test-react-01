import { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 프로덕션 환경에서는 이 정보를 에러 리포팅 서비스에 기록할 수 있습니다.
    // 예: Sentry, LogRocket 등
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      // 에러가 발생했을 때 보여줄 커스텀 폴백 UI입니다.
      return (
        <div className="page-loading">
          <h2>{t('common.renderErrorTitle')}</h2>
          <p>{t('common.renderErrorBody')}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// withTranslation HOC를 사용하여 클래스 컴포넌트 내에서 t 함수를 props로 전달받습니다.
export default withTranslation()(ErrorBoundary);