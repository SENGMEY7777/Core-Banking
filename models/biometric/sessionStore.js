const crypto = require('crypto');

const sessions = new Map();
const SESSION_TTL_MS = 5 * 60 * 1000;

function createSession({ userId, action }) {
  const now = Date.now();
  const session = {
    id: crypto.randomUUID(),
    userId,
    action,
    status: 'ACTIVE',
    payload: null,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString()
  };

  sessions.set(session.id, session);
  return session;
}

function getSessionById(sessionId) {
  return sessions.get(sessionId) || null;
}

function validateSessionById(sessionId) {
  const session = getSessionById(sessionId);

  if (!session) {
    return {
      exists: false,
      valid: false,
      message: 'Session not found.'
    };
  }

  const expired = Date.now() > new Date(session.expiresAt).getTime();
  const valid = session.status === 'ACTIVE' && !expired;

  if (!valid && expired) {
    session.status = 'EXPIRED';
  }

  return {
    exists: true,
    valid,
    sessionId: session.id,
    userId: session.userId,
    action: session.action,
    status: session.status,
    expiresAt: session.expiresAt,
    message: valid
      ? 'Continue to selected sub-process operation.'
      : 'Show Session Expired / Permission Denied Message.'
  };
}

function endSession(sessionId) {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  session.status = 'COMPLETED';
  return session;
}

module.exports = {
  createSession,
  getSessionById,
  validateSessionById,
  endSession
};
