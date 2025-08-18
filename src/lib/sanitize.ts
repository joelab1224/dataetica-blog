// Simple content sanitization
// Para markdown y texto de entrada

export function sanitizeMarkdown(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Remover scripts y contenido potencialmente peligroso
  const sanitized = content
    // Remover scripts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remover eventos onclick, onload, etc.
    .replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '')
    // Remover javascript: URLs
    .replace(/javascript:/gi, '')
    // Remover data: URLs que no sean imágenes
    .replace(/data:(?!image\/)[^;]+;/gi, 'data:text/plain;')
    // Limitar tags HTML permitidos en markdown (básicos)
    .replace(/<(?!\/?(?:strong|em|code|pre|blockquote|ul|ol|li|h[1-6]|p|br|img|a)\b)[^>]+>/gi, '');
  
  return sanitized.trim();
}

export function sanitizeTitle(title: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }
  
  return title
    .trim()
    .substring(0, 200) // Limitar longitud
    .replace(/[<>]/g, ''); // Remover caracteres básicos peligrosos
}

export function sanitizeExcerpt(excerpt: string): string {
  if (!excerpt || typeof excerpt !== 'string') {
    return '';
  }
  
  return excerpt
    .trim()
    .substring(0, 500) // Limitar longitud
    .replace(/[<>]/g, ''); // Remover caracteres básicos peligrosos
}

export function sanitizeImageUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Validar que sea una URL válida
  try {
    const parsed = new URL(url.trim());
    
    // Solo permitir HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Validar que tenga extensión de imagen
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext => 
      parsed.pathname.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}
