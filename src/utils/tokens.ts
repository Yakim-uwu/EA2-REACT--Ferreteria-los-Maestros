// Almacenamiento de los tokens JWT en el navegador.
// Se usa localStorage para que la sesión sobreviva a una recarga de la página.
// El access token dura poco (15 min) y el refresh token se rota en cada renovación;
// al cerrar sesión ambos se eliminan.

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const CLAVE_TOKENS = "ferreteria-tokens";

export function obtenerTokens(): Tokens | null {
  try {
    const crudo = localStorage.getItem(CLAVE_TOKENS);
    if (!crudo) return null;
    const datos: unknown = JSON.parse(crudo);
    if (typeof datos === "object" && datos !== null) {
      const t = datos as Partial<Tokens>;
      if (typeof t.accessToken === "string" && typeof t.refreshToken === "string") {
        return { accessToken: t.accessToken, refreshToken: t.refreshToken };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function guardarTokens(tokens: Tokens): void {
  localStorage.setItem(CLAVE_TOKENS, JSON.stringify(tokens));
}

export function limpiarTokens(): void {
  localStorage.removeItem(CLAVE_TOKENS);
}
