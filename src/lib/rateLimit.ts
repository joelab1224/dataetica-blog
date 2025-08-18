// Simple in-memory rate limiting
// Para producción, considera usar Redis o una base de datos

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export interface RateLimitConfig {
  windowMs?: number; // Ventana de tiempo en ms (default: 1 minuto)
  maxRequests?: number; // Máximo de requests por ventana (default: 10)
}

export function rateLimit(
  identifier: string, 
  config: RateLimitConfig = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const windowMs = config.windowMs || 60000; // 1 minuto
  const maxRequests = config.maxRequests || 10;
  
  const now = Date.now();
  
  // Limpiar entradas expiradas para evitar memory leaks
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
  
  const current = store.get(identifier);
  
  if (!current || current.resetTime < now) {
    // Nueva ventana
    const resetTime = now + windowMs;
    store.set(identifier, { count: 1, resetTime });
    return { 
      allowed: true, 
      remaining: maxRequests - 1, 
      resetTime 
    };
  }
  
  if (current.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: current.resetTime 
    };
  }
  
  // Incrementar contador
  current.count++;
  store.set(identifier, current);
  
  return { 
    allowed: true, 
    remaining: maxRequests - current.count, 
    resetTime: current.resetTime 
  };
}

// Helper para obtener IP del cliente
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback para desarrollo
  return 'unknown';
}
