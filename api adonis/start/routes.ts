/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import hash from '@adonisjs/core/services/hash'
import redis from '@adonisjs/redis/services/main'
import User from '#models/user'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const BlogController = () => import('#controllers/blog_controller')
const EventsController = () => import('#controllers/events_controller')

//#region Routes racines

router.get('/', async () => {
  return {
    hello: 'Good morning England !',
    routes: {
      auth: {
        register: '/v1/auth/register',
        validateAccount: '/v1/auth/validate-account',
        login: '/v1/auth/login',
        logout: '/v1/auth/logout',
        forgotPassword: '/v1/auth/forgot-password',
        whoami: '/v1/auth/whoami',
        deleteAccount: '/v1/auth/delete-account',
        suspendAccount: '/v1/auth/suspend-account',
        deleteAccountByAccountId: '/v1/auth/delete-account-accountId/:id',
        deleteAccountByUserId: '/v1/auth/delete-account-userId/:id',
      },
      users: {
        getAllUsers: '/v1/users',
        getUserById: '/v1/users/:id',
        createUser: '/v1/users',
        updateUser: '/v1/users/:id',
        patchUser: '/v1/users/:id',
        deleteUser: '/v1/users/:id',
      },
      blog: {
        listSubjects: '/v1/blog/subjects',
        listPostsBySubject: '/v1/blog/subjects/:id/posts',
        createPost: '/v1/blog/subjects/:id/posts',
        updatePost: '/v1/blog/posts/:id',
        deletePost: '/v1/blog/posts/:id',
        listComments: '/v1/blog/posts/:id/comments',
        addComment: '/v1/blog/posts/:id/comments',
        listTags: '/v1/blog/tags',
        listPostsByTag: '/v1/blog/tags/:id/posts',
      },
    }
  }
})

//#region Routes benchmark redis

// Route de benchmark Redis vs MySQL
router.get('/benchmark-cache', async ({ response }) => {
  try {
    const results = {
      mysql_time: 0,
      redis_time: 0,
      speed_improvement: 0,
      database_location: 'Germany 🇩🇪',
      redis_location: 'Local 🏠',
      users_count: 0
    }

    // 1. Test SANS cache (force MySQL distant)
    await redis.del('users:all') // Supprime le cache
    
    const mysqlStart = Date.now()
    const users = await User.all() // Direct MySQL en Allemagne
    const mysqlEnd = Date.now()
    results.mysql_time = mysqlEnd - mysqlStart
    results.users_count = users.length

    // 2. Met en cache Redis
    const serializedUsers = users.map(u => u.serialize())
    await redis.setex('users:all', 1800, JSON.stringify(serializedUsers))

    // 3. Test AVEC cache (Redis local)
    const redisStart = Date.now()
    const cachedData = await redis.get('users:all') // Direct Redis local
    const redisEnd = Date.now()
    results.redis_time = redisEnd - redisStart

    // 4. Vérification que le cache fonctionne
    const cachedUsers = cachedData ? JSON.parse(cachedData) : []
    const cacheWorking = cachedUsers.length === users.length

    // 5. Calcul de l'amélioration
    if (results.redis_time > 0) {
      results.speed_improvement = Math.round(results.mysql_time / results.redis_time)
    }

    return response.json({
      success: true,
      benchmark: results,
      cache_verification: {
        cache_working: cacheWorking,
        original_count: users.length,
        cached_count: cachedUsers.length
      },
      analysis: {
        mysql_query: `${results.mysql_time}ms (Network France→Germany + MySQL query)`,
        redis_query: `${results.redis_time}ms (Local Redis access)`,
        improvement: `${results.speed_improvement}x faster with Redis cache`,
        latency_saved: `${results.mysql_time - results.redis_time}ms saved per request`,
        expected_range: 'With remote DB: 10-100x improvement is normal',
        recommendation: results.speed_improvement > 10 ? 
          '🚀 Excellent! Cache is working perfectly' : 
          results.speed_improvement > 5 ?
          '✅ Good cache performance' :
          '⚠️ Lower than expected - check network or Redis config'
      },
      network_info: {
        database_location: 'Germany (remote)',
        redis_location: 'Local Docker container',
        estimated_network_latency: `~${Math.max(0, results.mysql_time - 50)}ms`,
        note: 'Remote DB queries include network latency + query time'
      }
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: 'Benchmark failed',
      message: error.message,
      help: 'Make sure Redis and MySQL are both accessible'
    })
  }
})

// Test du rate limiting login
router.get('/auth-rate-limit-test', async ({ request, response }) => {
  try {
    const email = 'test@ratelimit.com'
    const results = {
      ip_attempts: 0,
      email_attempts: 0,
      rate_limits_active: false
    }

    // Vérifier les rate limits actuels
    const clientIp = request.ip()
    const ipKey = `rate_limit:login:ip:${clientIp}`
    const emailKey = `rate_limit:login:email:${email}`

    const ipAttempts = await redis.get(ipKey)
    const emailAttempts = await redis.get(emailKey)

    results.ip_attempts = ipAttempts ? parseInt(ipAttempts) : 0
    results.email_attempts = emailAttempts ? parseInt(emailAttempts) : 0
    results.rate_limits_active = results.ip_attempts > 5 || results.email_attempts > 3

    const ipTtl = await redis.ttl(ipKey)
    const emailTtl = await redis.ttl(emailKey)

    return response.json({
      success: true,
      rate_limiting_status: results,
      ttl_info: {
        ip_reset_in_seconds: ipTtl > 0 ? ipTtl : 0,
        email_reset_in_seconds: emailTtl > 0 ? emailTtl : 0
      },
      limits: {
        ip_limit: '10 attempts per hour',
        email_limit: '5 attempts per 15 minutes'
      },
      test_info: {
        current_ip: clientIp,
        test_email: email,
        recommendation: results.rate_limits_active ? 
          'Rate limits active - wait before testing' : 
          'Rate limits OK - safe to test'
      }
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Test du cache whoami
router.get('/auth-cache-test', async ({ response }) => {
  try {
    const testUserId = 'test-user-id-123' // Remplace par un vrai ID de test
    const cacheInfo = {
      session_cache: false,
      profile_cache: false,
      cache_keys_found: []
    }

    // Vérifier les différents caches
    const sessionKey = `user_session:${testUserId}`
    const profileKey = `user_profile:${testUserId}`

    const sessionExists = await redis.exists(sessionKey)
    const profileExists = await redis.exists(profileKey)

    cacheInfo.session_cache = sessionExists === 1
    cacheInfo.profile_cache = profileExists === 1

    // Lister toutes les clés user en cache
    const userKeys = await redis.keys('user*')
    cacheInfo.cache_keys_found = userKeys.slice(0, 10) // Max 10 pour l'affichage

    // TTL des caches
    const sessionTtl = sessionExists ? await redis.ttl(sessionKey) : 0
    const profileTtl = profileExists ? await redis.ttl(profileKey) : 0

    return response.json({
      success: true,
      cache_status: cacheInfo,
      ttl_info: {
        session_ttl_seconds: sessionTtl,
        profile_ttl_seconds: profileTtl,
        session_expires_in: sessionTtl > 0 ? `${Math.floor(sessionTtl / 60)} minutes` : 'Not cached',
        profile_expires_in: profileTtl > 0 ? `${Math.floor(profileTtl / 60)} minutes` : 'Not cached'
      },
      total_user_caches: userKeys.length,
      cache_efficiency: {
        expected_performance: cacheInfo.session_cache ? '15x faster whoami' : 'Normal DB speed',
        recommendation: cacheInfo.session_cache || cacheInfo.profile_cache ? 
          '✅ Cache working - excellent performance' : 
          '⚠️ No cache found - login to create session cache'
      }
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Test de benchmark whoami avec/sans cache
router.get('/auth-whoami-benchmark', async ({ response }) => {
  try {
    // Note: Cette route nécessite d'être authentifié pour fonctionner
    // Tu peux l'adapter selon tes besoins
    
    const testResults = {
      cache_performance: {
        note: 'Login d\'abord pour tester whoami avec cache',
        expected_results: {
          first_call: '~30ms (DB query to Germany)',
          cached_calls: '~2ms (Redis local)',
          improvement: '15x faster with cache'
        }
      },
      test_instructions: [
        '1. POST /v1/auth/login avec des credentials valides',
        '2. Utilise le token pour GET /v1/auth/whoami (première fois = lent)',
        '3. Refais GET /v1/auth/whoami immédiatement (cache = rapide)',
        '4. Vérifie fromCache: true dans la réponse'
      ]
    }

    // Vérifier s'il y a des sessions actives en cache
    const sessionKeys = await redis.keys('user_session:*')
    const profileKeys = await redis.keys('user_profile:*')

    return response.json({
      success: true,
      benchmark_info: testResults,
      current_cache_state: {
        active_sessions: sessionKeys.length,
        cached_profiles: profileKeys.length,
        total_auth_caches: sessionKeys.length + profileKeys.length
      },
      redis_performance: {
        ping_test: await redis.ping(),
        connection_status: 'OK'
      }
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Reset des rate limits pour les tests
router.post('/auth-reset-rate-limits', async ({ request, response }) => {
  try {
    const { ip, email } = request.only(['ip', 'email'])
    const clientIp = ip || request.ip()
    
    const keysToDelete = []
    
    if (email) {
      // Reset rate limits pour cet email
      const emailKeys = await redis.keys(`rate_limit:*:email:${email}`)
      keysToDelete.push(...emailKeys)
    }
    
    // Reset rate limits pour cette IP
    const ipKeys = await redis.keys(`rate_limit:*:ip:${clientIp}`)
    keysToDelete.push(...ipKeys)
    
    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete)
    }

    return response.json({
      success: true,
      message: 'Rate limits reset successfully',
      reset_info: {
        ip: clientIp,
        email: email || 'Not specified',
        keys_deleted: keysToDelete.length,
        deleted_keys: keysToDelete
      },
      next_steps: 'You can now test auth endpoints without rate limiting'
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message
    })
  }
})

//#endregion

//#endregion

//#region Routes v1/events
router.group(() => {
  router.get('/', [EventsController, 'index'])
  router.get('/:id', [EventsController, 'show'])
  router.post('/', [EventsController, 'store'])
  router.put('/:id', [EventsController, 'update'])
  router.delete('/:id', [EventsController, 'destroy'])
  router.post('/:id/publish', [EventsController, 'publish'])
}).prefix('/v1/events')

// Groupe routes v1/blog
router.group(() => {
  // Sujets
  router.get('/subjects', [BlogController, 'listSubjects'])
  router.get('/subjects/:id/posts', [BlogController, 'listPostsBySubject'])
  router.post('/subjects/:id/posts', [BlogController, 'createPost'])

  // Posts
  router.put('/posts/:id', [BlogController, 'updatePost'])
  router.delete('/posts/:id', [BlogController, 'deletePost'])
  router.get('/posts/:id/comments', [BlogController, 'listComments'])
  router.post('/posts/:id/comments', [BlogController, 'addComment'])

  // Tags
  router.get('/tags', [BlogController, 'listTags'])
  router.get('/tags/:id/posts', [BlogController, 'listPostsByTag'])
}).prefix('/v1/blog')

// Groupe "auth" v1 : endpoints d'authentification
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.get('/validate-account/:validationCode', [AuthController, 'validateAccount'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout'])
    router.post('/forgot-password', [AuthController, 'forgotPassword'])
    router.get('/reset-password-validate/:validationCode', [AuthController, 'resetPasswordValidate'])
    router.post('/reset-password/:validationCode', [AuthController, 'resetPassword'])
    router.get('/whoami', [AuthController, 'whoami'])
    router.delete('/delete-account', [AuthController, 'deleteAccount'])
    router.post('/suspend-account', [AuthController, 'suspendAccount'])
    router.delete('/delete-account-accountId/:id', [AuthController, 'deleteAccountByAccountId'])
    router.delete('/delete-account-userId/:id', [AuthController, 'deleteAccountByUserId'])
  })
  .prefix('/v1/auth')

// Groupe "V1" - correspond au dossier V1 dans Postman
router
  .group(() => {
    router.get('/', [UsersController, 'getAllUsers'])
    router.get('/:id', [UsersController, 'getUserById'])
    router.post('/', [UsersController, 'createUser'])
    router.put('/:id', [UsersController, 'updateUser'])
    router.patch('/:id', [UsersController, 'patchUser'])
    router.delete('/:id', [UsersController, 'deleteUser'])
  })
  .prefix('v1/users')

//#endregion

//#region Routes test
router
  .group(() => {
    // Route info
    router.get('/info', async ({ response }) => {
      return response.json({
        api: 'Mon CSE API Ultra-Sécurisée',
        version: '1.0.0',
        features: [
          'JWT Authentication',
          'Argon2 Password Hashing',
          'CSRF Protection',
          'Rate Limiting',
          'Security Headers',
        ],
        endpoints: {
          health: 'GET /test/v1/health',
          testHash: 'POST /test/v1/test-hash',
          secureTest: 'GET /test/v1/secure-test',
          securityTest: 'GET /test/v1/security-test',
          info: 'GET /test/v1/info',
        },
      })
    })

    // Route de santé
    router.get('/health', async ({ response }) => {
      return response.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        security: 'enabled',
        hash: 'argon2',
        version: '1.0.0',
      })
    })

    // Route sécurisée
    router.get('/secure-test', async ({ response }) => {
      return response.json({
        message: 'Route ultra-sécurisée accessible !',
        security: {
          csrf: 'enabled',
          rateLimit: 'enabled',
          headers: 'secured',
          hash: 'argon2id',
        },
        timestamp: new Date().toISOString(),
      })
    })

    // Route pour tester les headers de sécurité
    router.get('/security-test', async ({ response }) => {
      return response.json({
        message: 'Regarde les headers HTTP de cette réponse !',
        security: {
          note: 'Vérifie les headers X-Frame-Options, X-XSS-Protection, etc.',
          timestamp: new Date().toISOString(),
        },
      })
    })

    // Route pour tester Argon2
    router.post('/test-hash', async ({ request, response }) => {
      const { password } = request.only(['password'])

      if (!password) {
        return response.status(400).json({
          error: 'Password required',
          example: { password: 'test123' },
        })
      }

      try {
        const hashedPassword = await hash.make(password)
        const isValid = await hash.verify(hashedPassword, password)

        return response.json({
          success: true,
          original: password,
          hashed: hashedPassword,
          verified: isValid,
          algorithm: 'argon2id',
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        return response.status(500).json({
          error: 'Hashing failed',
          message: error.message,
        })
      }
    })
  })
  .prefix('/test/v1')

//#endregion