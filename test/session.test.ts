import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSession, isExpired, readSessionId, refreshSession, sessionCookie } from '../src/session.ts';

const NOW = Date.UTC(2026, 0, 1, 12, 0, 0);

test('a new session lasts thirty minutes', () => {
  const session = createSession('abc', NOW);
  assert.equal(isExpired(session, NOW + 29 * 60 * 1000), false);
  assert.equal(isExpired(session, NOW + 30 * 60 * 1000), true);
});

test('the cookie round-trips the session id', () => {
  const header = sessionCookie(createSession('a b', NOW));
  assert.equal(readSessionId(header), 'a b');
});

test('a session in its last five minutes is refreshed', () => {
  const session = createSession('abc', NOW);
  const later = NOW + 26 * 60 * 1000;
  assert.equal(refreshSession(session, later).expiresAt, later + 30 * 60 * 1000);
});

test('a session with time to spare keeps its expiry', () => {
  const session = createSession('abc', NOW);
  assert.equal(refreshSession(session, NOW + 10 * 60 * 1000), session);
});
