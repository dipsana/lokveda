# 🕒 Changelog

All notable changes to this project are documented in this file.  
This project follows **Semantic Versioning (SemVer)**.

---

## [1.0.0] – 2025-01-19

### 🎉 Base / Preview Release

This release represents the **initial stable preview** of LokVeda — focusing on
system architecture, authentication flow, session handling, and UX design.

### ✅ Added

- OTP-based authentication (User / Staff / Admin)
- Aadhaar-linked login validation (regex + length checks)
- Secure session creation & validation
- Auto logout after 15 minutes of inactivity
- Session guard against direct URL access
- Login attempt limiter with cooldown
- Location checker (Village / State / India-level logic)
- Dynamic greeting bot with personalization
- Dark mode with system preference detection
- Persistent theme preference (local storage)
- Modular navigation bar (post-auth only)
- Reusable UI utilities (`hide()` / `show()`)
- Firebase encapsulated as a virtual backend
- Form loader with parameter-based routing
- User-friendly status messages & modals
- SEO & social metadata (index page only)

### 🧪 Preview / Partially Implemented

- Search bar (UI functional, logic pending)
- Forms (structure ready, submission pending)
- Services module (planned)
- Admin & staff extended workflows
- Downloadable documents (PDF/DOCX)

### 🚧 Known Limitations

- No public sign-up (users are pre-registered)
- No backend deployment (Firebase used client-side)
- Forms do not submit data yet
- Profile & service management not active

### 🔮 Planned (Future Scope)

- Full service CRUD operations
- Admin approval & staff verification flow
- Secure file downloads
- Production backend migration
- Analytics & audit logs

---

> Note:  
> This project intentionally prioritizes **architecture, security, and real-world
> workflow simulation** over feature completeness for the current academic phase.
