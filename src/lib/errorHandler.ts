// Manejo seguro de errores para el admin
// No expone información sensible al cliente

export interface SafeError {
  message: string;
  code?: string;
  statusCode: number;
}

export function createSafeError(
  error: unknown, 
  fallbackMessage: string = 'An error occurred',
  statusCode: number = 500
): SafeError {
  // Log completo para desarrollo/debugging (solo server-side)
  if (process.env.NODE_ENV === 'development') {
    console.error('Full error details:', error);
  } else {
    // En producción, log solo información esencial
    console.error('Error occurred:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Errores conocidos que es seguro mostrar al cliente
  if (error instanceof Error) {
    switch (error.message) {
      case 'Invalid credentials':
      case 'User not found':
      case 'Post not found':
      case 'Category not found':
      case 'Title, excerpt, content, and categoryId are required':
      case 'Email and password are required':
        return {
          message: error.message,
          statusCode: statusCode
        };
      
      // Errores de validación de Prisma
      case error.message.includes('Unique constraint') ? error.message : '':
        return {
          message: 'This item already exists',
          code: 'DUPLICATE_ERROR',
          statusCode: 409
        };
    }
  }
  
  // Para cualquier otro error, usar mensaje genérico
  return {
    message: fallbackMessage,
    statusCode: statusCode
  };
}

// Helper para crear respuestas de error consistentes
export function createErrorResponse(error: unknown, fallbackMessage?: string, statusCode?: number) {
  const safeError = createSafeError(error, fallbackMessage, statusCode);
  
  return Response.json(
    { 
      error: safeError.message,
      code: safeError.code 
    },
    { status: safeError.statusCode }
  );
}

// Sistema simple de logging para auditoría
export function logAdminAction(action: string, details?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    details: process.env.NODE_ENV === 'development' ? details : undefined
  };
  
  console.log(`[ADMIN_ACTION] ${JSON.stringify(logEntry)}`);
  
  // En el futuro, esto se puede extender para guardar en base de datos
  // await prisma.auditLog.create({ data: logEntry });
}
