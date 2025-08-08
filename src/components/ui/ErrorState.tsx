'use client';

import Button from './Button';
import Card from './Card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  className?: string;
  variant?: 'inline' | 'page' | 'card';
}

export default function ErrorState({
  title = 'Error',
  message = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
  showRetry = true,
  showHome = true,
  onRetry,
  className = '',
  variant = 'inline'
}: ErrorStateProps) {
  const getIconForVariant = () => {
    return (
      <svg
        className="w-8 h-8 text-red-500 mb-4"
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
    );
  };

  const getContent = () => (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          {getIconForVariant()}
        </div>
      </div>
      
      <h3 className="text-section-header text-primary font-heading mb-2">
        {title}
      </h3>
      
      <p className="text-body text-secondary mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {showRetry && (
          <Button
            onClick={onRetry || (() => window.location.reload())}
            variant="primary"
          >
            Reintentar
          </Button>
        )}
        {showHome && (
          <Button
            onClick={() => (window.location.href = '/')}
            variant="secondary"
          >
            Ir al inicio
          </Button>
        )}
      </div>
    </div>
  );

  if (variant === 'page') {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="max-w-lg mx-auto p-8">
          {getContent()}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card variant="elevated" className={`max-w-lg mx-auto ${className}`}>
        <div className="p-8">
          {getContent()}
        </div>
      </Card>
    );
  }

  // inline variant
  return (
    <div className={`py-12 ${className}`}>
      {getContent()}
    </div>
  );
}

// Specific error state components for common scenarios
export const NotFoundError = ({ className = '' }: { className?: string }) => (
  <ErrorState
    title="Página no encontrada"
    message="La página que buscas no existe o ha sido movida."
    variant="page"
    showRetry={false}
    className={className}
  />
);

export const NetworkError = ({ onRetry, className = '' }: { onRetry?: () => void, className?: string }) => (
  <ErrorState
    title="Error de conexión"
    message="No se pudo conectar al servidor. Verifica tu conexión a internet."
    variant="card"
    onRetry={onRetry}
    className={className}
  />
);

export const LoadingError = ({ onRetry, className = '' }: { onRetry?: () => void, className?: string }) => (
  <ErrorState
    title="Error al cargar"
    message="No se pudo cargar el contenido. Por favor, inténtalo de nuevo."
    variant="inline"
    onRetry={onRetry}
    className={className}
  />
);
