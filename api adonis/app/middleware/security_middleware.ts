// API/app/middleware/security_middleware.ts

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SecurityMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx

    // ===== HEADERS DE SÉCURITÉ =====
    this.addSecurityHeaders(response)

    // ===== RATE LIMITING SIMPLE =====
    const rateLimited = await this.checkRateLimit(ctx)
    if (rateLimited) return

    // ===== LOGGING SÉCURITÉ =====
    this.logSecurityEvents(ctx)

    await next()
  }

  /**
   * Ajouter headers de sécurité
   */
  private addSecurityHeaders(response: any) {
    // Protection XSS
    response.header('X-Content-Type-Options', 'nosniff')
    response.header('X-Frame-Options', 'DENY')
    response.header('X-XSS-Protection', '1; mode=block')
    
    // HTTPS Strict Transport Security (production)
    if (process.env.NODE_ENV === 'production') {
      response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    
    // Content Security Policy basique
    response.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'")
    
    // Referrer Policy
    response.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Permissions Policy
    response.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  }

  /**
   * Rate limiting simple en mémoire
   */
  private async checkRateLimit({ request, response }: HttpContext): Promise<boolean> {
    const ip = request.ip()
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 1000 // 1000 requêtes par 15min

    // Cache global simple (sera remplacé par Redis plus tard)
    if (!global.rateLimitCache) {
      global.rateLimitCache = new Map()
    }

    const cache = global.rateLimitCache
    const key = `rate_limit:${ip}`
    
    // Nettoyer les entrées expirées
    for (const [k, v] of cache.entries()) {
      if (now - v.resetTime > windowMs) {
        cache.delete(k)
      }
    }

    // Vérifier/mettre à jour le compteur
    const current = cache.get(key) || { count: 0, resetTime: now }
    
    if (now - current.resetTime > windowMs) {
      current.count = 1
      current.resetTime = now
    } else {
      current.count++
    }
    
    cache.set(key, current)

    // Headers informatifs
    response.header('X-RateLimit-Limit', maxRequests)
    response.header('X-RateLimit-Remaining', Math.max(0, maxRequests - current.count))
    response.header('X-RateLimit-Reset', new Date(current.resetTime + windowMs).toISOString())

    // Bloquer si limite dépassée
    if (current.count > maxRequests) {
      response.status(429).json({
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((current.resetTime + windowMs - now) / 1000),
        },
      })
      return true // Rate limited
    }

    return false // OK
  }

  /**
   * Logger les événements de sécurité
   */
  private logSecurityEvents({ request, auth }: HttpContext) {
    const sensitiveEndpoints = ['/auth/', '/admin/', '/api/']
    const sensitiveMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
    
    if (sensitiveMethods.includes(request.method()) &&
        sensitiveEndpoints.some(endpoint => request.url().includes(endpoint))) {
      
      const securityLog = {
        timestamp: new Date().toISOString(),
        event: 'sensitive_request',
        method: request.method(),
        url: request.url(),
        ip: request.ip(),
        userAgent: request.header('user-agent'),
        userId: auth?.user?.id || 'anonymous',
        headers: {
          'content-type': request.header('content-type'),
          'authorization': request.header('authorization') ? '[PRESENT]' : '[ABSENT]',
        },
      }
      
      // Log sécurisé (pas de données sensibles)
      console.log('🔐 SECURITY EVENT:', JSON.stringify(securityLog))
    }
  }
}