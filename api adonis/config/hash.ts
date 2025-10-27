import { defineConfig, drivers } from '@adonisjs/core/hash'

const hashConfig = defineConfig({
  default: 'argon2',

  list: {
    // scrypt: drivers.scrypt({
    //   cost: 16384,
    //   blockSize: 8,
    //   parallelization: 1,
    //   saltSize: 16,
    //   keyLength: 64,
    //   maxMemory: 32 * 1024 * 1024,
    // }),

    argon2: drivers.argon2({
      version: 0x13, // hex code for 19
      variant: 'id',
      iterations: 3,
      memory: 65536,
      parallelism: 4,
      saltSize: 16,
      hashLength: 32,
    }),
  },
})

export default hashConfig

declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}
