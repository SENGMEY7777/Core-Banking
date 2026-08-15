const {
  createSession,
  getSessionById,
  validateSessionById,
  completeSession
} = require('../../models/biometric/biometricSessionStore');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../../utils/httpError');

const ACTIONS = Object.freeze({
  ENROLL: 'ENROLL_BIOMETRICS',
  AUTHENTICATE: 'AUTHENTICATE_STEP_UP',
  REVOKE: 'REVOKE_BIOMETRIC'
});

function assertValidAction(action) {
  if (!Object.values(ACTIONS).includes(action)) {
    throw new BadRequestError(
      'Invalid action. Use ENROLL_BIOMETRICS, AUTHENTICATE_STEP_UP, or REVOKE_BIOMETRIC.'
    );
  }
}

function assertSessionAction(session, expectedAction) {
  if (session.action !== expectedAction) {
    throw new BadRequestError(
      `Session action mismatch. Expected ${expectedAction}, got ${session.action}.`
    );
  }
}

function requireActiveSession(sessionId, expectedAction) {
  const validation = validateSessionById(sessionId);

  if (!validation.exists) {
    throw new NotFoundError('Session not found.');
  }

  if (!validation.valid) {
    throw new ForbiddenError('Show Session Expired / Permission Denied Message.');
  }

  const session = getSessionById(sessionId);
  assertValidAction(expectedAction);
  assertSessionAction(session, expectedAction);

  return session;
}

function buildOperationResponse(session, title, message) {
  return {
    sessionId: session.sessionId,
    action: session.action,
    status: session.status,
    operation: title,
    message,
    next: 'END'
  };
}

const biometricService = {
  getMenu() {
    return {
      start: 'START',
      title: 'Display Auth & Biometrics Navigation Menu',
      actions: [
        { key: ACTIONS.ENROLL, label: 'Enroll Biometrics' },
        { key: ACTIONS.AUTHENTICATE, label: 'Authenticate / Step-Up' },
        { key: ACTIONS.REVOKE, label: 'Revoke Biometric' }
      ],
      decision: 'Select Action',
      sessionGate: 'Is Session Valid?'
    };
  },

  selectAction({ userId, action }) {
    assertValidAction(action);

    const session = createSession({
      userId: userId || 'anonymous',
      action
    });

    return {
      message: 'Action selected. Continue to the selected sub-process operation.',
      sessionId: session.sessionId,
      action: session.action,
      expiresAt: session.expiresAt,
      next: action
    };
  },

  getSession(sessionId) {
    const session = getSessionById(sessionId);

    if (!session) {
      throw new NotFoundError('Session not found.');
    }

    return session;
  },

  validateSession(sessionId) {
    const validation = validateSessionById(sessionId);

    if (!validation.exists) {
      throw new NotFoundError('Session not found.');
    }

    return validation;
  },

  enrollBiometricCredential(payload) {
    const { sessionId, userId, faceTemplate } = payload;
    const session = requireActiveSession(sessionId, ACTIONS.ENROLL);

    if (!userId) {
      throw new BadRequestError('userId is required.');
    }

    if (!faceTemplate) {
      throw new BadRequestError('faceTemplate is required.');
    }

    session.payload = {
      userId,
      faceTemplate
    };

    completeSession(session.sessionId);

    return buildOperationResponse(
      session,
      '1. Enroll New Face Biometric Credential',
      'Biometric credential enrolled successfully.'
    );
  },

  authenticateAndStepUp(payload) {
    const { sessionId, userId, faceTemplate } = payload;
    const session = requireActiveSession(sessionId, ACTIONS.AUTHENTICATE);

    if (!userId) {
      throw new BadRequestError('userId is required.');
    }

    if (!faceTemplate) {
      throw new BadRequestError('faceTemplate is required.');
    }

    session.payload = {
      userId,
      faceTemplate,
      stepUpApproved: true
    };

    completeSession(session.sessionId);

    return buildOperationResponse(
      session,
      '2. Authenticate & Step-Up Face Scan',
      'Authentication and step-up succeeded.'
    );
  },

  revokeBiometricCredential(payload) {
    const { sessionId, userId, credentialId } = payload;
    const session = requireActiveSession(sessionId, ACTIONS.REVOKE);

    if (!userId) {
      throw new BadRequestError('userId is required.');
    }

    if (!credentialId) {
      throw new BadRequestError('credentialId is required.');
    }

    session.payload = {
      userId,
      credentialId,
      revoked: true
    };

    completeSession(session.sessionId);

    return buildOperationResponse(
      session,
      '3. Revoke Biometric Credential',
      'Biometric credential revoked successfully.'
    );
  }
};

module.exports = biometricService;
