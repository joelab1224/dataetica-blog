'use client';

import { useState, useEffect } from 'react';

interface SafeErrorMessageProps {
  error: string | null;
  onDismiss?: () => void;
  autoHide?: boolean;
  className?: string;
}

export default function SafeErrorMessage({ 
  error, 
  onDismiss, 
  autoHide = true,
  className = '' 
}: SafeErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, 5000); // Auto-hide después de 5 segundos
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [error, autoHide, onDismiss]);

  if (!error || !isVisible) {
    return null;
  }

  // Mapear errores técnicos a mensajes amigables
  const getFriendlyMessage = (errorMessage: string) => {
    if (errorMessage.includes('rate limit') || errorMessage.includes('Too many')) {
      return 'Has realizado demasiadas acciones. Por favor, espera un momento antes de intentar de nuevo.';
    }
    
    if (errorMessage.includes('credentials') || errorMessage.includes('Invalid')) {
      return 'Credenciales incorrectas. Verifica tu email y contraseña.';
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.';
    }
    
    if (errorMessage.includes('server') || errorMessage.includes('500')) {
      return 'Ocurrió un error en el servidor. Por favor, inténtalo más tarde.';
    }
    
    // Si el mensaje ya es amigable, mostrarlo tal como está
    return errorMessage;
  };

  return (
    <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-large mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2">⚠️</span>
          <span>{getFriendlyMessage(error)}</span>
        </div>
        {onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="ml-4 text-red-500 hover:text-red-700 font-bold"
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// Hook personalizado para manejo de errores de forma segura
export function useSafeError() {
  const [error, setError] = useState<string | null>(null);

  const showError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    }
  };

  const clearError = () => setError(null);

  return { error, showError, clearError };
}
