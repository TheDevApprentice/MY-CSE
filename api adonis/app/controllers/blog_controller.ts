// app/controllers/blog_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Subject from '#models/subject'
import Post from '#models/post'
import Tag from '#models/tag'
import Comment from '#models/comment'
import { UuidHelper } from '#helper/uuid'
import redis from '@adonisjs/redis/services/main'

export default class BlogController {
  // GET /v1/blog/subjects (avec cache Redis)
  async listSubjects({ request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (50 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:blog_subjects:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 50) {
        return response.status(429).json({
          error: 'Trop de requêtes. Limite : 50 par heure.',
          retryAfter: 3600
        })
      }

      // ⚡ AJOUT : Essaie de récupérer depuis le cache Redis d'abord
      const cacheKey = 'blog:subjects:all'
      const cachedSubjects = await redis.get(cacheKey)
      
      if (cachedSubjects) {
        const subjects = JSON.parse(cachedSubjects)
        return response.json({
          success: true,
          data: subjects,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale avec preload
      const subjects = await Subject.query()
        .preload('posts', (query) => query.preload('tags').preload('author'))

      const serializedSubjects = subjects.map(subject => subject.serialize())

      // ⚡ AJOUT : Met en cache pour 45 minutes (contenu blog change modérément)
      await redis.setex(cacheKey, 2700, JSON.stringify(serializedSubjects))

      return response.json({
        success: true,
        data: serializedSubjects,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des sujets',
        message: error.message
      })
    }
  }

  // GET /v1/blog/subjects/:id/posts (avec cache Redis)
  async listPostsBySubject({ params, request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (100 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:blog_posts_by_subject:${clientIp}`
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
      const cacheKey = `blog:subject:${params.id}:posts`
      const cachedPosts = await redis.get(cacheKey)
      
      if (cachedPosts) {
        const posts = JSON.parse(cachedPosts)
        return response.json({
          success: true,
          data: posts,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale avec preload
      const posts = await Post.query()
        .where('subject_id', params.id)
        .preload('tags')
        .preload('author')

      const serializedPosts = posts.map(post => post.serialize())

      // ⚡ AJOUT : Met en cache pour 30 minutes (posts changent plus souvent)
      await redis.setex(cacheKey, 1800, JSON.stringify(serializedPosts))

      return response.json({
        success: true,
        data: serializedPosts,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des posts',
        message: error.message
      })
    }
  }

  // POST /v1/blog/subjects/:id/posts (avec invalidation cache Redis)
  async createPost({ params, request, auth, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting création posts (10 posts par utilisateur par heure)
      const user = await auth.authenticate()
      const rateLimitKey = `rate_limit:create_post:${user.id}`
      const posts = await redis.incr(rateLimitKey)
      
      if (posts === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (posts > 10) {
        return response.status(429).json({
          error: 'Trop de posts créés. Limite : 10 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de création originale
      const data = request.only(['title', 'content', 'coverImage'])
      const post = await Post.create({
        ...data,
        id: UuidHelper.v7(),
        subjectId: params.id,
        authorId: user.id,
      })

      // ⚡ AJOUT : Invalide les caches liés aux posts
      await redis.del('blog:subjects:all') // Liste des sujets (avec posts)
      await redis.del(`blog:subject:${params.id}:posts`) // Posts de ce sujet
      await redis.del('blog:recent_posts') // Posts récents (si cache existe)

      return response.status(201).json({
        success: true,
        data: post.serialize(),
        cacheInvalidated: true
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la création du post',
        message: error.message
      })
    }
  }

  // PUT /v1/blog/posts/:id (avec invalidation cache Redis)
  async updatePost({ params, request, auth, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting modification posts (20 modifications par utilisateur par heure)
      const user = await auth.authenticate()
      const rateLimitKey = `rate_limit:update_post:${user.id}`
      const updates = await redis.incr(rateLimitKey)
      
      if (updates === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (updates > 20) {
        return response.status(429).json({
          error: 'Trop de modifications. Limite : 20 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de modification originale
      const post = await Post.findOrFail(params.id)
      if (post.authorId !== user.id) {
        return response.status(403).json({ error: 'Non autorisé' })
      }
      
      const data = request.only(['title', 'content', 'coverImage'])
      post.merge(data)
      await post.save()

      // ⚡ AJOUT : Invalide les caches liés à ce post
      await redis.del('blog:subjects:all') // Liste des sujets (avec posts)
      await redis.del(`blog:subject:${post.subjectId}:posts`) // Posts de ce sujet
      await redis.del(`blog:post:${params.id}`) // Cache de ce post spécifique (si existe)

      return response.json({
        success: true,
        data: post.serialize(),
        cacheInvalidated: true
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la modification du post',
        message: error.message
      })
    }
  }

  // DELETE /v1/blog/posts/:id (avec invalidation cache Redis)
  async deletePost({ params, auth, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting suppression posts (5 suppressions par utilisateur par heure)
      const user = await auth.authenticate()
      const rateLimitKey = `rate_limit:delete_post:${user.id}`
      const deletions = await redis.incr(rateLimitKey)
      
      if (deletions === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (deletions > 5) {
        return response.status(429).json({
          error: 'Trop de suppressions. Limite : 5 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de suppression originale
      const post = await Post.findOrFail(params.id)
      if (post.authorId !== user.id) {
        return response.status(403).json({ error: 'Non autorisé' })
      }

      const subjectId = post.subjectId
      await post.delete()

      // ⚡ AJOUT : Invalide les caches liés à ce post
      await redis.del('blog:subjects:all') // Liste des sujets (avec posts)
      await redis.del(`blog:subject:${subjectId}:posts`) // Posts de ce sujet
      await redis.del(`blog:post:${params.id}`) // Cache de ce post spécifique
      await redis.del(`blog:post:${params.id}:comments`) // Commentaires de ce post

      return response.json({
        success: true,
        cacheInvalidated: true
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la suppression du post',
        message: error.message
      })
    }
  }

  // GET /v1/blog/posts/:id/comments (avec cache Redis)
  async listComments({ params, request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (200 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:blog_comments:${clientIp}`
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
      const cacheKey = `blog:post:${params.id}:comments`
      const cachedComments = await redis.get(cacheKey)
      
      if (cachedComments) {
        const comments = JSON.parse(cachedComments)
        return response.json({
          success: true,
          data: comments,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale avec preload
      const comments = await Comment.query()
        .where('post_id', params.id)
        .preload('author')

      const serializedComments = comments.map(comment => comment.serialize())

      // ⚡ AJOUT : Met en cache pour 15 minutes (commentaires changent souvent)
      await redis.setex(cacheKey, 900, JSON.stringify(serializedComments))

      return response.json({
        success: true,
        data: serializedComments,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des commentaires',
        message: error.message
      })
    }
  }

  // POST /v1/blog/posts/:id/comments (avec invalidation cache Redis)
  async addComment({ params, request, auth, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting ajout commentaires (30 commentaires par utilisateur par heure)
      const user = await auth.authenticate()
      const rateLimitKey = `rate_limit:add_comment:${user.id}`
      const comments = await redis.incr(rateLimitKey)
      
      if (comments === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (comments > 30) {
        return response.status(429).json({
          error: 'Trop de commentaires ajoutés. Limite : 30 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique d'ajout de commentaire originale
      const { content } = request.only(['content'])
      const comment = await Comment.create({
        id: UuidHelper.v7(),
        content,
        postId: params.id,
        authorId: user.id,
      })

      // ⚡ AJOUT : Invalide le cache des commentaires de ce post
      await redis.del(`blog:post:${params.id}:comments`)

      return response.status(201).json({
        success: true,
        data: comment.serialize(),
        cacheInvalidated: true
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de l\'ajout du commentaire',
        message: error.message
      })
    }
  }

  // GET /v1/blog/tags (avec cache Redis)
  async listTags({ request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (100 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:blog_tags:${clientIp}`
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
      const cacheKey = 'blog:tags:all'
      const cachedTags = await redis.get(cacheKey)
      
      if (cachedTags) {
        const tags = JSON.parse(cachedTags)
        return response.json({
          success: true,
          data: tags,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale
      const tags = await Tag.all()
      const serializedTags = tags.map(tag => tag.serialize())

      // ⚡ AJOUT : Met en cache pour 2 heures (tags changent rarement)
      await redis.setex(cacheKey, 7200, JSON.stringify(serializedTags))

      return response.json({
        success: true,
        data: serializedTags,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des tags',
        message: error.message
      })
    }
  }

  // GET /v1/blog/tags/:id/posts (avec cache Redis)
  async listPostsByTag({ params, request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (100 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:blog_posts_by_tag:${clientIp}`
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
      const cacheKey = `blog:tag:${params.id}:posts`
      const cachedPosts = await redis.get(cacheKey)
      
      if (cachedPosts) {
        const posts = JSON.parse(cachedPosts)
        return response.json({
          success: true,
          data: posts,
          fromCache: true,
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale avec preload
      const tag = await Tag.findOrFail(params.id)
      await tag.load('posts', (query) => query.preload('author').preload('tags'))
      
      const serializedPosts = tag.posts.map(post => post.serialize())

      // ⚡ AJOUT : Met en cache pour 1 heure
      await redis.setex(cacheKey, 3600, JSON.stringify(serializedPosts))

      return response.json({
        success: true,
        data: serializedPosts,
        fromCache: false
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la récupération des posts par tag',
        message: error.message
      })
    }
  }
}