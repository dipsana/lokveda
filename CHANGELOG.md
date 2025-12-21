# 🕒 Changelog

All notable changes to this project are documented in this file.  
**This project adheres to [Semantic Versioning (SemVer)](https://semver.org/) standards.**

---

## [1.0.1] – 2025-12-21

### 🐛 Patch / Bug Fix

This release addresses a **critical module and asset loading issue** caused by incorrect JS, CSS, and image/icon paths, which prevented modules from loading correctly on local servers and GitHub Pages.

### ✅ Fixed

* Normalized **all JS imports** to root-relative `/lokveda/...` paths
* Corrected **CSS imports**, including `/lokveda/auth/auth.css`
* Fixed **icons, images, and asset paths** across all modules
* Ensured **all scripts and modules** load correctly without MIME type or 404 errors
* Verified stability of project execution across all environments

### 🚧 Known Limitations

* No new features introduced; purely a **patch for stability**
* All workflows and UI remain identical to v1.0.0

---

> Note:
> This patch ensures the project is fully functional in all environments, fixing **critical pathing issues** for scripts, styles, and assets.

---

## [1.0.0] – 2025-12-21

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
