// patterns.ts

// Expression régulière pour détecter les injections SQL
export const SQL_INJECTION_PATTERNS = [
  /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|SELECT|UPDATE|UNION( +ALL){0,1})\b|;|--|\/\*|\*\/|@@|\b(AND|OR)\s+\d+=\d+)/gi,
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b.*\b(FROM|INTO|TABLE|DATABASE|INDEX|VIEW|PROCEDURE|TRIGGER)\b)/gi,
  /(\b(UNION\s+SELECT|EXEC\s*\(|EXECUTE\s+\w+\s+@|DECLARE\s+@|CAST\s*\(|CONVERT\s*\(|WAITFOR\s+DELAY))\b/gi,
];

// Expression régulière pour détecter les attaques XSS
export const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /<[^>]*\b(?:href|src|data|style|on\w+)\s*=\s*["'](?:javascript:|data:)/gi,
];

// Expression régulière pour détecter les tentatives de manipulation d'URL
export const URL_INJECTION_PATTERNS = [
  /(\.\.\/|%2e%2e%2f|%252e%252e%252f)/gi,
  /(\/\/|\\\\)/gi,
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$])/gi,
];
