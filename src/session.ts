import { parseCookie, serializeCookie } from './cookies.ts';

export type Session = {
  id: string;
  expiresAt: number;
};

export const SESSION_COOKIE = 'sid';
export const SESSION_TTL_MS = 30 * 60 * 1000;

export function createSession(id: string, now: number): Session {
  return { id, expiresAt: now + SESSION_TTL_MS };
}

export function isExpired(session: Session, now: number): boolean {
  return now >= session.expiresAt;
}

export function readSessionId(header: string): string | undefined {
  return parseCookie(header, SESSION_COOKIE);
}

export function sessionCookie(session: Session): string {
  return serializeCookie(SESSION_COOKIE, session.id, { httpOnly: true, secure: true });
}
