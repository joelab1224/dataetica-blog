'use client';

import { Component, ReactNode } from 'react';
import Button from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-section-header text-primary font-heading mb-2">
                Algo salió mal
              </h2>
              <p className="text-body text-secondary mb-6">
                Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y está trabajando en solucionarlo.
              </p>
              <details className="text-left bg-gray-100 rounded-large p-4 mb-6">
                <summary className="text-nav-card font-medium text-secondary cursor-pointer hover:text-primary">
                  Detalles técnicos
                </summary>
                <pre className="mt-2 text-xs text-secondary overflow-auto">
                  {this.state.error?.message}
                  {'\n'}
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                className="w-full"
              >
                Recargar página
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="secondary"
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
