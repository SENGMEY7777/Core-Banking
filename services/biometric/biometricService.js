const crypto = require('crypto');
const { createEnrollment, getEnrollment, updateEnrollment } = require('../../models/biometric/enrollmentStore');
const {
  createSession,
  getSessionById,
  validateSessionById,
  endSession
} = require('../../models/biometric/sessionStore');

const ACTIONS = Object.freeze({
  ENROLL: 'ENROLL_BIOMETRICS',
  AUTHENTICATE: 'AUTHENTICATE_STEP_UP',
  REVOKE: 'REVOKE_BIOMETRIC'
});

function ensureAction(action) {
  if (!Object.values(ACTIONS).includes(action)) {
    throw new Error('Invalid action. Choose ENROLL_BIOMETRICS, AUTHENTICATE_STEP_UP, or REVOKE_BIOMETRIC.');
  }
}

function requireEnrollment(enrollmentId) {
  const enrollment = getEnrollment(enrollmentId);
  if (!enrollment) {
    throw new Error('Enrollment not found.');
  }
  return enrollment;
}

function generate512Vector(source) {
  const hash = crypto.createHash('sha512').update(String(source)).digest('hex');
  const vector = [];
  for (let i = 0; i < 512; i += 1) {
    const start = (i * 2) % hash.length;
    const pair = hash.slice(start, start + 2) || '00';
    vector.push(parseInt(pair, 16) / 255);
  }
  return vector;
}

function buildEnrollmentResponse(enrollment, operation, message, extra = {}) {
  return {
    enrollmentId: enrollment.enrollmentId,
    userId: enrollment.userId,
    status: enrollment.status,
    operation,
    message,
    ...extra
  };
}

function updateState(enrollmentId, patch) {
  const updated = updateEnrollment(enrollmentId, patch);
  if (!updated) {
    throw new Error('Enrollment not found.');
  }
  return updated;
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
    ensureAction(action);
    const session = createSession({ userId: userId || 'anonymous', action });

    return {
      message: 'Action selected. Continue to the selected sub-process operation.',
      sessionId: session.id,
      enrollmentId: session.id,
      action,
      next: action
    };
  },

  getSession(sessionId) {
    const session = getSessionById(sessionId);
    if (!session) {
      throw new Error('Session not found.');
    }
    return session;
  },

  validateSession(sessionId) {
    const validation = validateSessionById(sessionId);
    if (!validation.exists) {
      throw new Error('Session not found.');
    }
    return validation;
  },

  enrollBiometricCredential(payload) {
    const { sessionId, userId, faceTemplate } = payload;
    const session = validateActiveSession(sessionId, ACTIONS.ENROLL);

    if (!userId) {
      throw new Error('userId is required.');
    }

    if (!faceTemplate) {
      throw new Error('faceTemplate is required.');
    }

    session.payload = { userId, faceTemplate };
    endSession(session.id);

    return {
      sessionId: session.id,
      action: session.action,
      operation: 'Enroll New Face Biometric Credential',
      sessionValid: true,
      message: 'Biometric credential enrolled successfully.',
      next: 'END'
    };
  },

  authenticateAndStepUp(payload) {
    const { sessionId, userId, faceTemplate } = payload;
    const session = validateActiveSession(sessionId, ACTIONS.AUTHENTICATE);

    if (!userId) {
      throw new Error('userId is required.');
    }

    if (!faceTemplate) {
      throw new Error('faceTemplate is required.');
    }

    session.payload = { userId, faceTemplate, stepUpApproved: true };
    endSession(session.id);

    return {
      sessionId: session.id,
      action: session.action,
      operation: 'Authenticate & Step-Up Face Scan',
      sessionValid: true,
      message: 'Authentication and step-up succeeded.',
      next: 'END'
    };
  },

  revokeBiometricCredential(payload) {
    const { sessionId, userId, credentialId } = payload;
    const session = validateActiveSession(sessionId, ACTIONS.REVOKE);

    if (!userId) {
      throw new Error('userId is required.');
    }

    if (!credentialId) {
      throw new Error('credentialId is required.');
    }

    session.payload = { userId, credentialId, revoked: true };
    endSession(session.id);

    return {
      sessionId: session.id,
      action: session.action,
      operation: 'Revoke Biometric Credential',
      sessionValid: true,
      message: 'Biometric credential revoked successfully.',
      next: 'END'
    };
  },

  initiateWebFaceEnrollment({ userId, authenticatedUser = true }) {
    if (!userId) {
      throw new Error('userId is required.');
    }
    if (!authenticatedUser) {
      throw new Error('Show Permission Denied Message');
    }

    const enrollment = createEnrollment({ userId });
    return buildEnrollmentResponse(enrollment, 'Initiate Web Face Enrollment', 'Web face enrollment initiated.', {
      authenticatedUser: true
    });
  },

  checkAuthenticatedUser(enrollmentId, payload = {}) {
    const enrollment = requireEnrollment(enrollmentId);
    if (payload.authenticatedUser === false) {
      throw new Error('Show Permission Denied Message');
    }

    const updated = updateState(enrollmentId, {
      authenticatedUser: true,
      status: 'AUTHENTICATED'
    });

    return buildEnrollmentResponse(updated, 'Is Authenticated User?', 'Authenticated user confirmed.', {
      authenticatedUser: true
    });
  },

  requestWebAuthnServerChallengeNonce(enrollmentId) {
    const enrollment = requireEnrollment(enrollmentId);
    const challengeNonce = crypto.randomBytes(16).toString('hex');
    const updated = updateState(enrollmentId, {
      challengeNonce,
      status: 'CHALLENGE_ISSUED'
    });

    return buildEnrollmentResponse(updated, 'Request WebAuthn Server Challenge Nonce', 'WebAuthn challenge nonce created.', {
      challengeNonce
    });
  },

  startWebCameraStreamAndCaptureFrames(enrollmentId, payload = {}) {
    const enrollment = requireEnrollment(enrollmentId);
    const updated = updateState(enrollmentId, {
      cameraStarted: true,
      framesCaptured: payload.framesCaptured !== false,
      status: 'FRAMES_CAPTURED'
    });

    return buildEnrollmentResponse(updated, '/Start Web Camera Stream & Capture Frames/', 'Camera stream started and frames captured.', {
      cameraStarted: true,
      framesCaptured: updated.framesCaptured
    });
  },

  verify3DLiveness(enrollmentId, payload = {}) {
    const enrollment = requireEnrollment(enrollmentId);
    const blinkDetected = payload.blinkDetected !== false;
    const depthCheckPassed = payload.depthCheckPassed !== false;
    const livenessPassed = blinkDetected && depthCheckPassed;

    const updated = updateState(enrollmentId, {
      livenessPassed,
      status: livenessPassed ? 'LIVENESS_PASSED' : 'LIVENESS_FAILED'
    });

    if (!livenessPassed) {
      throw new Error('Show Liveness Detection Failed Message');
    }

    return buildEnrollmentResponse(updated, '3D Liveness Passed? Blink / Depth Check', '3D liveness passed.', {
      blinkDetected,
      depthCheckPassed,
      livenessPassed
    });
  },

  compute512DimFacialVector(enrollmentId, payload = {}) {
    const enrollment = requireEnrollment(enrollmentId);
    if (!enrollment.livenessPassed) {
      throw new Error('Liveness must pass before vector computation.');
    }

    const source = payload.faceTemplate || `${enrollment.userId}:${enrollment.enrollmentId}:${Date.now()}`;
    const facialVector = generate512Vector(source);
    const updated = updateState(enrollmentId, {
      facialVector,
      status: 'VECTOR_COMPUTED'
    });

    return buildEnrollmentResponse(updated, 'Compute 512-dim Facial Vector in Wasm Memory', '512-dim facial vector computed in Wasm memory (simulated).', {
      vectorLength: facialVector.length,
      facialVector
    });
  },

  promptBrowserHardwareBiometricVerification(enrollmentId) {
    const enrollment = requireEnrollment(enrollmentId);
    if (!enrollment.facialVector) {
      throw new Error('Facial vector must be computed before hardware verification.');
    }

    return buildEnrollmentResponse(enrollment, 'Prompt Browser Hardware Biometric Verification', 'Browser hardware biometric verification requested.', {
      prompt: 'Use browser hardware biometric verification'
    });
  },

  verifyHardwareSignature(enrollmentId, payload = {}) {
    const enrollment = requireEnrollment(enrollmentId);
    if (!enrollment.facialVector) {
      throw new Error('Facial vector must be computed before hardware signature verification.');
    }

    const hardwareSigned = payload.hardwareSigned !== false;
    const updated = updateState(enrollmentId, {
      hardwareSigned,
      status: hardwareSigned ? 'HARDWARE_SIGNED' : 'HARDWARE_SIGN_FAILED'
    });

    if (!hardwareSigned) {
      throw new Error('Show Hardware Sign Error');
    }

    return buildEnrollmentResponse(updated, 'Hardware Signed?', 'Hardware signed successfully.', {
      hardwareSigned: true
    });
  },

  completeEnrollment(enrollmentId) {
    const enrollment = requireEnrollment(enrollmentId);
    if (!enrollment.hardwareSigned) {
      throw new Error('Hardware signature is required to complete enrollment.');
    }

    const userBiometricId = crypto.randomUUID();
    const updated = updateState(enrollmentId, {
      userBiometricId,
      status: 'COMPLETED'
    });

    return buildEnrollmentResponse(updated, 'Insert into D1 user_biometrics & Update users table', 'Show Biometric Enrollment Success Message', {
      userBiometricId
    });
  }
};

function validateActiveSession(sessionId, expectedAction) {
  const validation = validateSessionById(sessionId);

  if (!validation.exists) {
    throw new Error('Session not found.');
  }

  if (!validation.valid) {
    throw new Error('Show Session Expired / Permission Denied Message.');
  }

  const session = getSessionById(sessionId);
  ensureAction(expectedAction);

  if (session.action !== expectedAction) {
    throw new Error(`Session action mismatch. Expected ${expectedAction}, got ${session.action}.`);
  }

  return session;
}

module.exports = biometricService;
