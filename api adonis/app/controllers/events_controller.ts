// app/controllers/events_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Subject from '#models/subject'
import Post from '#models/post'
import User from '#models/user'
import { DateTime } from 'luxon'
import redis from '@adonisjs/redis/services/main'

export default class EventsController {
  // Liste tous les événements (avec cache Redis)
  async index({ request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (100 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:events_list:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 100) {
        return response.status(429).json({
          error: 'Trop de requêtes. Limite : 100 par heure.',
          retryAfter: 3600
        })
      }

      // ⚡ AJOUT : Essaie de récupérer depuis le cache Redis d'abord
      const cacheKey = 'events:all'
      const cachedEvents = await redis.get(cacheKey)
      
      if (cachedEvents) {
        const events = JSON.parse(cachedEvents)
        return response.ok({
          success: true,
          data: events,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale
      const events = await Event.all()
      const serializedEvents = events.map(event => event.serialize())

      // ⚡ AJOUT : Met en cache pour 30 minutes (événements changent modérément)
      await redis.setex(cacheKey, 1800, JSON.stringify(serializedEvents))

      return response.ok({
        success: true,
        data: serializedEvents,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des événements',
        message: error.message
      })
    }
  }

  // Affiche un événement (avec cache Redis)
  async show({ params, request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (200 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:event_show:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 200) {
        return response.status(429).json({
          error: 'Trop de requêtes. Limite : 200 par heure.',
          retryAfter: 3600
        })
      }

      // ⚡ AJOUT : Essaie de récupérer depuis le cache Redis d'abord
      const cacheKey = `event:${params.id}`
      const cachedEvent = await redis.get(cacheKey)
      
      if (cachedEvent) {
        const event = JSON.parse(cachedEvent)
        return response.ok({
          success: true,
          data: event,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale
      const event = await Event.find(params.id)
      if (!event) {
        return response.notFound({ 
          success: false,
          message: 'Event not found' 
        })
      }

      const serializedEvent = event.serialize()

      // ⚡ AJOUT : Met en cache pour 1 heure
      await redis.setex(cacheKey, 3600, JSON.stringify(serializedEvent))

      return response.ok({
        success: true,
        data: serializedEvent,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération de l\'événement',
        message: error.message
      })
    }
  }

  // Crée un événement (avec invalidation cache Redis)
  async store({ request, response, auth }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting création événements (5 créations par utilisateur par heure)
      const user = auth.user
      if (!user) {
        return response.status(401).json({ error: 'Utilisateur non authentifié' })
      }

      const rateLimitKey = `rate_limit:create_event:${user.id}`
      const events = await redis.incr(rateLimitKey)
      
      if (events === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (events > 5) {
        return response.status(429).json({
          error: 'Trop d\'événements créés. Limite : 5 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de création originale
      const data = request.only([
        'title', 'description', 'startDate', 'endDate', 'location', 
        'subjectId', 'postId', 'publishedAt', 'status'
      ])
      
      const event = await Event.create({
        ...data,
        createdBy: user.id,
      })

      // ⚡ AJOUT : Invalide les caches d'événements
      await redis.del('events:all') // Liste de tous les événements
      await redis.del('events:published') // Événements publiés (si cache existe)
      await redis.del('events:upcoming') // Événements à venir (si cache existe)

      return response.created({
        success: true,
        data: event.serialize(),
        cacheInvalidated: true
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la création de l\'événement',
        message: error.message
      })
    }
  }

  // Met à jour un événement (avec invalidation cache Redis)
  async update({ params, request, response, auth }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting modification événements (10 modifications par utilisateur par heure)
      const user = auth.user
      if (!user) {
        return response.status(401).json({ error: 'Utilisateur non authentifié' })
      }

      const rateLimitKey = `rate_limit:update_event:${user.id}`
      const updates = await redis.incr(rateLimitKey)
      
      if (updates === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (updates > 10) {
        return response.status(429).json({
          error: 'Trop de modifications d\'événements. Limite : 10 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de modification originale
      const event = await Event.find(params.id)
      if (!event) {
        return response.notFound({ 
          success: false,
          message: 'Event not found' 
        })
      }

      const data = request.only([
        'title', 'description', 'startDate', 'endDate', 'location', 
        'subjectId', 'postId', 'publishedAt', 'status'
      ])
      
      event.merge(data)
      await event.save()

      // ⚡ AJOUT : Invalide les caches liés à cet événement
      await redis.del('events:all') // Liste de tous les événements
      await redis.del(`event:${params.id}`) // Cache de cet événement spécifique
      await redis.del('events:published') // Événements publiés (si cache existe)
      await redis.del('events:upcoming') // Événements à venir (si cache existe)

      return response.ok({
        success: true,
        data: event.serialize(),
        cacheInvalidated: true
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la modification de l\'événement',
        message: error.message
      })
    }
  }

  // Supprime un événement (avec invalidation cache Redis)
  async destroy({ params, response, auth }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting suppression événements (3 suppressions par utilisateur par heure)
      const user = auth.user
      if (!user) {
        return response.status(401).json({ error: 'Utilisateur non authentifié' })
      }

      const rateLimitKey = `rate_limit:delete_event:${user.id}`
      const deletions = await redis.incr(rateLimitKey)
      
      if (deletions === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (deletions > 3) {
        return response.status(429).json({
          error: 'Trop de suppressions d\'événements. Limite : 3 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de suppression originale
      const event = await Event.find(params.id)
      if (!event) {
        return response.notFound({ 
          success: false,
          message: 'Event not found' 
        })
      }

      await event.delete()

      // ⚡ AJOUT : Invalide les caches liés à cet événement
      await redis.del('events:all') // Liste de tous les événements
      await redis.del(`event:${params.id}`) // Cache de cet événement spécifique
      await redis.del('events:published') // Événements publiés (si cache existe)
      await redis.del('events:upcoming') // Événements à venir (si cache existe)

      return response.noContent()
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la suppression de l\'événement',
        message: error.message
      })
    }
  }

  // Publie un événement immédiatement (avec invalidation cache Redis)
  async publish({ params, response, auth }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting publication événements (10 publications par utilisateur par heure)
      const user = auth.user
      if (!user) {
        return response.status(401).json({ error: 'Utilisateur non authentifié' })
      }

      const rateLimitKey = `rate_limit:publish_event:${user.id}`
      const publications = await redis.incr(rateLimitKey)
      
      if (publications === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (publications > 10) {
        return response.status(429).json({
          error: 'Trop de publications d\'événements. Limite : 10 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de publication originale
      const event = await Event.find(params.id)
      if (!event) {
        return response.notFound({ 
          success: false,
          message: 'Event not found' 
        })
      }

      event.status = 'published'
      event.publishedAt = DateTime.now()
      await event.save()

      // ⚡ AJOUT : Invalide les caches liés aux événements publiés
      await redis.del('events:all') // Liste de tous les événements
      await redis.del(`event:${params.id}`) // Cache de cet événement spécifique
      await redis.del('events:published') // Événements publiés (si cache existe)
      await redis.del('events:upcoming') // Événements à venir (si cache existe)

      return response.ok({
        success: true,
        data: event.serialize(),
        cacheInvalidated: true
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la publication de l\'événement',
        message: error.message
      })
    }
  }

  // ⚡ AJOUT : Nouvelles méthodes avec cache Redis pour améliorer l'API

  // GET /v1/events/published - Événements publiés avec cache
  async getPublishedEvents({ request, response }: HttpContext) {
    try {
      // 🛡️ Rate limiting
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:events_published:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 150) {
        return response.status(429).json({
          error: 'Trop de requêtes. Limite : 150 par heure.',
          retryAfter: 3600
        })
      }

      // ⚡ Cache des événements publiés
      const cacheKey = 'events:published'
      const cachedEvents = await redis.get(cacheKey)
      
      if (cachedEvents) {
        const events = JSON.parse(cachedEvents)
        return response.ok({
          success: true,
          data: events,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // Requête MySQL pour événements publiés
      const events = await Event.query().where('status', 'published').orderBy('publishedAt', 'desc')
      const serializedEvents = events.map(event => event.serialize())

      // Cache pour 20 minutes (événements publiés changent moins souvent)
      await redis.setex(cacheKey, 1200, JSON.stringify(serializedEvents))

      return response.ok({
        success: true,
        data: serializedEvents,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des événements publiés',
        message: error.message
      })
    }
  }

  // GET /v1/events/upcoming - Événements à venir avec cache
  async getUpcomingEvents({ request, response }: HttpContext) {
    try {
      // 🛡️ Rate limiting
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:events_upcoming:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 150) {
        return response.status(429).json({
          error: 'Trop de requêtes. Limite : 150 par heure.',
          retryAfter: 3600
        })
      }

      // ⚡ Cache des événements à venir
      const cacheKey = 'events:upcoming'
      const cachedEvents = await redis.get(cacheKey)
      
      if (cachedEvents) {
        const events = JSON.parse(cachedEvents)
        return response.ok({
          success: true,
          data: events,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // Requête MySQL pour événements futurs
      const now = DateTime.now()
      const events = await Event.query()
        .where('startDate', '>', now.toSQL())
        .andWhere('status', 'published')
        .orderBy('startDate', 'asc')
        .limit(50) // Limite raisonnable

      const serializedEvents = events.map(event => event.serialize())

      // Cache pour 10 minutes (événements à venir peuvent changer souvent)
      await redis.setex(cacheKey, 600, JSON.stringify(serializedEvents))

      return response.ok({
        success: true,
        data: serializedEvents,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des événements à venir',
        message: error.message
      })
    }
  }
}