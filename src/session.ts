import { expireCookie, parseCookie, serializeCookie } from './cookies.ts';

export type Session = {
  id: string;
  expiresAt: number;
};

export const SESSION_COOKIE = 'sid';
export const SESSION_TTL_MS = 30 * 60 * 1000;
export const REFRESH_WINDOW_MS = 60 * 1000;

export function createSession(id: string, now: number): Session {
  return { id, expiresAt: now + SESSION_TTL_MS };
}

export function isExpired(session: Session, now: number): boolean {
  return now >= session.expiresAt;
}

export function readSessionId(header: string): string | undefined {
  return parseCookie(header, SESSION_COOKIE);
}

export function shouldRefresh(session: Session, now: number): boolean {
  const remaining = session.expiresAt - now;
  return remaining > 0 && remaining <= REFRESH_WINDOW_MS;
}

export function refreshSession(session: Session, now: number): Session {
  if (!shouldRefresh(session, now)) return session;
  return createSession(session.id, now);
}

export function sessionCookie(session: Session, now?: number): string {
  const maxAgeSeconds = now === undefined ? undefined : (session.expiresAt - now) / 1000;
  return serializeCookie(SESSION_COOKIE, session.id, { httpOnly: true, secure: true, maxAgeSeconds });
}

export function clearSessionCookie(): string {
  return expireCookie(SESSION_COOKIE);
}
