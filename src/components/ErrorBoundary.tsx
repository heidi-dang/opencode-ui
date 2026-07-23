import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 text-red-500 mb-1">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {this.props.fallbackTitle || 'Component Error Encountered'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {this.state.error?.message || 'An unexpected rendering error occurred in this workspace panel.'}
          </p>
          <button
            onClick={this.handleReset}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus-ring"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
