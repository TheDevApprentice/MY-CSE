// API/app/helper/uuid.ts

import { v4 as uuidv4, v7 as uuidv7 } from 'uuid'

export class UuidHelper {
  /**
   * Générer UUID v4 (aléatoire)
   */
  static v4(): string {
    return uuidv4()
  }

  /**
   * Générer UUID v7 (avec timestamp - recommandé 2024)
   */
  static v7(): string {
    return uuidv7()
  }

  /**
   * Valider un UUID
   */
  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}