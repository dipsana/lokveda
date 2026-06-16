# 🔐 LokVeda Security Policy

## Overview

LokVeda is designed as a digital governance platform handling citizen information, service requests, authentication credentials, and administrative workflows.

Security is treated as a first-class concern throughout the system.

This document describes the security mechanisms currently implemented in LokVeda v2.0.0.

---

## Security Objectives

LokVeda aims to provide:

* Secure authentication
* Session integrity
* Account protection
* Unauthorized access prevention
* Geographic verification
* Workflow integrity
* Administrative accountability
* Protection against common abuse patterns

---

## Authentication Security

### Aadhaar-Based Identity Verification

Users authenticate using their Aadhaar number.

Authentication is only permitted for:

* Pre-registered citizens
* Approved staff members
* Approved administrators

Unregistered users cannot create accounts through the public portal.

---

### OTP Verification

LokVeda uses server-generated OTP verification.

#### Security Measures

* OTPs are generated using Node.js Crypto APIs
* OTPs are never stored in plain text
* OTPs are hashed using bcrypt before database storage
* OTPs are verified through hash comparison
* OTPs expire automatically
* OTP requests are rate-limited

---

### OTP Cooldown Protection

To prevent abuse:

* Users cannot continuously request OTPs
* OTP resend requests are restricted using cooldown timers
* Friendly feedback is provided to legitimate users

Example:

```text
You've recently requested an OTP.
Please wait 35 seconds before requesting another one.
```

---

## Session Security

### JWT Authentication

LokVeda uses JWT tokens for authentication.

Two independent authentication stages exist:

#### Authentication Token

Issued after identity verification.

Purpose:

* Temporary authentication state
* OTP verification process

Removed immediately after successful OTP validation.

---

#### Session Token

Issued after successful login.

Purpose:

* Authenticated access
* Protected route access
* Session validation

---

### Single Session Enforcement

Only one active session is allowed per account.

Benefits:

* Prevents session sharing
* Prevents simultaneous device access
* Reduces account abuse

---

### Session Fingerprinting

Each login session records:

* Device information
* Browser information
* IP address
* Geographic location

This information is used for suspicious activity detection.

---

## Geographic Security

### Location Verification

Before OTP generation:

Users must grant location access.

Location validation occurs before authentication continues.

---

### Citizen Restrictions

Citizens may authenticate only from their approved states.

This supports:

* Mobility within legitimate regions
* Protection against remote abuse

---

### Staff Restrictions

Staff members must authenticate within:

```text
10 KM
```

of their assigned working area.

---

### Administrator Restrictions

Administrators must authenticate within:

```text
250 KM
```

of their assigned area.

---

### Distance Reporting

LokVeda informs users of violations using calculated distances.

Example:

```text
You are currently 54.23 KM away from your approved area.
```

This improves transparency and user understanding.

---

## Account Protection

### Login Attempt Tracking

Failed authentication attempts are monitored.

Examples include:

* Incorrect Aadhaar number
* Invalid OTP submission
* Authentication misuse

---

### Temporary Account Lock

After excessive failed attempts:

```text
4 Failed Attempts
```

Account access is restricted.

Lock Duration:

```text
1 Hour
```

---

### Suspicious Login Protection

Additional protections exist for unusual login behavior.

Indicators include:

* Multiple devices
* Large geographic movement
* Rapid login attempts
* Session inconsistencies

---

### Suspicious Activity Lock

When suspicious behavior is detected:

```text
3 Hour Lock
```

is applied.

---

## Workflow Security

### Role-Based Access Control

LokVeda implements strict role separation.

#### Citizens

Can:

* Apply for services
* View status
* View profile

Cannot:

* Review applications
* Approve applications
* Manage services

---

#### Staff

Can:

* Review applications
* Reject applications

Cannot:

* Approve applications
* Manage services

---

#### Administrators

Can:

* Approve applications
* Review rejected applications
* Manage services

Cannot:

* Modify completed approvals

---

## Application State Integrity

Applications transition through controlled states.

Supported States:

```text
Pending
Reviewed
Approved
Rejected
```

State transitions are validated server-side.

---

### Audit Tracking

LokVeda records:

* Reviewed By
* Approved By
* Rejected By

And:

* Reviewed At
* Approved At
* Rejected At

This provides accountability and traceability.

---

## Service Security

### Area-Based Service Control

Administrators may activate or deactivate services.

Activation is restricted to:

* Their assigned Panchayat area

Changes do not affect historical applications.

---

## Input Validation

LokVeda validates:

* Aadhaar numbers
* Email addresses
* OTP values
* Form fields

Validation occurs on both:

* Client side
* Server side

---

## Error Handling

User-facing messages avoid exposing:

* Database structure
* Internal implementation details
* Authentication secrets

Where possible, users receive friendly status messages.

Example:

```text
Unable to submit form 😕
```

instead of raw system details.

---

## Password Policy

Not Applicable.

LokVeda currently uses:

```text
Aadhaar + OTP Authentication
```

instead of password-based authentication.

---

## Deployment Infrastructure

* Render — Application hosting and deployment platform used for running the Node.js and Express.js server in a cloud environment.
* Cloudflare (Planned / Future Integration) — Intended for DNS management, performance optimization, SSL enhancement, caching, and protection against automated bots and malicious traffic.

---

## Known Limitations

Current version does not yet provide:

* File upload scanning
* PDF signing
* Advanced audit exports
* Multi-factor authentication
* Intrusion monitoring dashboard
* Profile images currently use demonstration avatars stored locally within the application. User-uploaded profile images and cloud-based media storage are planned for future releases

These remain future enhancements.

---

## Responsible Disclosure

If a security issue is discovered:

Please report it privately before public disclosure.

Contact:

```text
Project Maintainer:
Dipsana Roy
```

---

## Security Philosophy

LokVeda prioritizes:

1. Simplicity for non-technical users
2. Strong authentication controls
3. Geographic verification
4. Session integrity
5. Administrative accountability
6. Citizen data protection

Security mechanisms are intentionally designed to remain understandable while providing practical protection against common misuse scenarios.
