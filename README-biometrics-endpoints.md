# Biometric Process Endpoints

This implements the flowchart as an Express MVC + service flow.

## Required Auth

All biometric routes are protected with `authenticateToken`, so send:

```http
Authorization: Bearer <JWT>
```

## Endpoints

### 1. Get navigation menu

`GET /api/biometrics/menu`

Returns the start, decision, and available actions from the flowchart.

### 2. Select action

`POST /api/biometrics/select-action`

Body:

```json
{
  "userId": "10000000-0000-0000-0000-000000000001",
  "action": "ENROLL_BIOMETRICS"
}
```

Allowed actions:
- `ENROLL_BIOMETRICS`
- `AUTHENTICATE_STEP_UP`
- `REVOKE_BIOMETRIC`

### 3. Get session

`GET /api/biometrics/session/:sessionId`

### 4. Validate session

`GET /api/biometrics/session/:sessionId/validate`

### 5. Enroll biometrics

`POST /api/biometrics/enroll`

Body:

```json
{
  "sessionId": "uuid-here",
  "userId": "10000000-0000-0000-0000-000000000001",
  "faceTemplate": "face-template-data"
}
```

### 6. Authenticate / step-up

`POST /api/biometrics/authenticate`

Body:

```json
{
  "sessionId": "uuid-here",
  "userId": "10000000-0000-0000-0000-000000000001",
  "faceTemplate": "face-template-data"
}
```

### 7. Revoke biometric

`POST /api/biometrics/revoke`

Body:

```json
{
  "sessionId": "uuid-here",
  "userId": "10000000-0000-0000-0000-000000000001",
  "credentialId": "biometric-credential-id"
}
```
