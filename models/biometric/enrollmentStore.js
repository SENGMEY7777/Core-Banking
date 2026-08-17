const crypto = require('crypto');

const enrollments = new Map();

function createEnrollment({ userId }) {
  const now = new Date().toISOString();
  const enrollment = {
    enrollmentId: crypto.randomUUID(),
    userId,
    status: 'INITIATED',
    createdAt: now,
    updatedAt: now,
    authenticatedUser: false,
    challengeNonce: null,
    cameraStarted: false,
    framesCaptured: false,
    livenessPassed: false,
    facialVector: null,
    hardwareSigned: false,
    userBiometricId: null
  };

  enrollments.set(enrollment.enrollmentId, enrollment);
  return enrollment;
}

function getEnrollment(enrollmentId) {
  return enrollments.get(enrollmentId) || null;
}

function updateEnrollment(enrollmentId, patch) {
  const enrollment = getEnrollment(enrollmentId);
  if (!enrollment) return null;

  const updated = {
    ...enrollment,
    ...patch,
    updatedAt: new Date().toISOString()
  };

  enrollments.set(enrollmentId, updated);
  return updated;
}

module.exports = {
  createEnrollment,
  getEnrollment,
  updateEnrollment
};
