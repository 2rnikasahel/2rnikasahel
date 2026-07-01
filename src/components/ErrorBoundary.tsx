import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-border/50 p-8 max-w-md w-full text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">خطای غیرمنتظره!</h2>
            <p className="text-text-secondary mb-6">
              متاسفانه مشکلی در نمایش این بخش پیش آمده است. لطفاً صفحه را refresh کنید.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                تلاش مجدد
              </button>
              <Link
                to="/"
                className="w-full bg-light-bg text-primary border border-border py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
