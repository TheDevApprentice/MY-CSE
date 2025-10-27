// ===== COOKIE UTILS =====
export class CookieUtils {
  static set(name: string, value: string, days = 1): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict` + 
      (location.protocol === 'https:' ? ';HttpOnly' : '');
  }

  static get(name: string): string | null {
    const cookies = `; ${document.cookie}`;
    const parts = cookies.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  static remove(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}