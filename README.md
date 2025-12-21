# 🌿 LokVeda — Your E-Gram Panchayat

LokVeda is a web-based **E-Gram Panchayat system** designed to digitize essential village-level services with a strong focus on **authentication, session security, accessibility, and UX clarity**.

This project currently represents a **preview / base release (v1.0.0)**, focusing on secure access, role-based dashboards, and system flow rather than full service execution.

🔗 **Live Demo**: [https://dipsana.github.io/lokveda/](https://dipsana.github.io/lokveda/)

---

## 🚀 Tech Stack

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
<!-- [![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat&logo=twilio&logoColor=white)](https://www.twilio.com/) -->

---

## 🏛️ Project Overview

LokVeda simulates a real-world **government service portal** for Indian villages, where citizens are **pre-registered** and authenticated via OTP.  
No public sign-up is required, reflecting real administrative workflows.

The system supports **three roles**:

- 👤 **User (Citizen)**
- 🧑‍💼 **Staff**
- 🛡️ **Admin**

Each role has a dedicated login page and dashboard.

---

## ✨ Key Features (Implemented)

### 🔐 Authentication & Security

- OTP-based login (Aadhaar-linked phone number)
- Regex-based input validation (length, digits, format)
- Friendly status messages for success/failure
- Max attempt limit (blocks user for 24 hours after repeated failures)
- Session lock if user exits improperly
- Secure logout with warning modal

### ⏱️ Session Management

- Session creation & validation via Firebase
- Auto logout after **15 minutes of inactivity**
- Session guard prevents:
  - Direct dashboard access without login
  - Sneaky URL navigation
- Users attempting multiple logins are restricted for **3 hours**

### 🌍 Location Checker

- Ensures role-based geographic access:
  - Users → same village
  - Staff → same state
  - Admin → within India (border-aware logic)
- Prevents misuse from outside allowed regions

### 👋 Greeting System

- Dynamic greeting message displayed across dashboards
- Personalized with user name
- Time-aware greeting logic

### 🌙 Dark Mode (UX-focused)

- Detects browser theme preference instantly
- Preserves user choice locally (until cache cleared)
- Smooth, non-blinding transitions
- Minimal, clean toggle button with hover aura

---

## 🧭 Navigation Bar (Post-Login)

Displayed **only after successful authentication**:

- Greeting text
- Dashboard shortcut
- Search icon + expandable search bar (UI-ready)
- Dark mode toggle
- Secure logout button

Visibility is managed using reusable `hide()` and `show()` utilities.

---

## 📄 Forms & Services (Preview Stage)

- Forms are created and load dynamically via `form-loader`
- URL parameter-based loading implemented
- Submission, updates, and downloads are **not yet implemented**
- Undeveloped features are clearly marked using:

  ```js
  element.title = 'In development';
  ```

---

## 🗂️ Firebase as Virtual Backend

All database and authentication logic is encapsulated inside `firebase.js`.

- Acts as a **virtual backend**
- Exports only required getters/setters
- Prevents data tampering via encapsulation
- Must be initialized **exactly once**
- Re-initialization triggers forced logout

If moved server-side, the app architecture remains secure.

---

## 📁 Clickable Project Structure

Perfect, this is clean now. Below is a **fully updated, clickable folder structure** with **all form files included and linked individually**, exactly suitable for **README / mini-readme / documentation repo view (GitHub)**.

You can **copy-paste this as-is**.

---

## 📁 Clickable Project Structure — *LokVeda: Your E-Gram Panchayat*

[lokveda-egram-panchayat/](/)  
├── [📁 assets/](/assets)  
│   └── [📁 icons/](/assets/icons)  
│  
├── [📁 auth/](/auth)  
│   ├── [auth-user.html](/auth/auth-user.html)  
│   ├── [auth-staff.html](/auth/auth-staff.html)  
│   ├── [auth-admin.html](/auth/auth-admin.html)  
│   ├── [auth-core.js](/auth/auth-core.js)  
│   └── [auth.css](/auth/auth.css)  
│  
├── [📁 dashboard/](/dashboard)  
│   ├── [dashboard-user.html](/dashboard/dashboard-user.html)  
│   ├── [dashboard-staff.html](/dashboard/dashboard-staff.html)  
│   ├── [dashboard-admin.html](/dashboard/dashboard-admin.html)  
│   ├── [dashboard.js](/dashboard/dashboard.js)  
│   └── [dashboard.css](/dashboard/dashboard.css)  
│  
├── [📁 form-loader/](/form-loader)  
│   ├── [form-api.js](/form-loader/form-api.js)  
│   ├── [form-loader.js](/form-loader/form-loader.js)  
│   ├── [form-ui.css](/form-loader/form-ui.css)  
│   └── [form-view.html](/form-loader/form-view.html)  
│  
├── [📁 forms/](/forms)  
│   ├── [birth.html](/forms/birth.html)  
│   ├── [death.html](/forms/death.html)  
│   ├── [dues.html](/forms/dues.html)  
│   ├── [election-updates.html](/forms/election-updates.html)  
│   ├── [grievance.html](/forms/grievance.html)  
│   ├── [health-checkup.html](/forms/health-checkup.html)  
│   ├── [jobs.html](/forms/jobs.html)  
│   ├── [land.html](/forms/land.html)  
│   ├── [mgnrega.html](/forms/mgnrega.html)  
│   ├── [property-tax.html](/forms/property-tax.html)  
│   ├── [property.html](/forms/property.html)  
│   ├── [public-notices.html](/forms/public-notices.html)  
│   ├── [public-works.html](/forms/public-works.html)  
│   ├── [rti.html](/forms/rti.html)  
│   ├── [sanitation.html](/forms/sanitation.html)  
│   ├── [skill-training.html](/forms/skill-training.html)  
│   ├── [subsidies.html](/forms/subsidies.html)  
│   ├── [tenders.html](/forms/tenders.html)  
│   ├── [voter-id.html](/forms/voter-id.html)  
│   ├── [voter-list.html](/forms/voter-list.html)  
│   ├── [water-tax.html](/forms/water-tax.html)  
│   └── [welfare-schemes.html](/forms/welfare-schemes.html)  
│  
├── [📁 services/](/services) *(future scope)*  
│  
├── [dom.js](/dom.js)  
├── [firebase.js](/firebase.js)  
├── [greeting-bot.js](/greeting-bot.js)  
├── [nav-bar.js](/nav-bar.js)  
├── [script-global.js](/script-global.js)  
├── [style-global.css](/style-global.css)  
├── [utilities.css](/utilities.css)  
├── [index.html](/index.html)  
├── [favicon.png](/favicon.png)  
├── [preview.png](/preview.png)  
│  
├── [📁 documentation/](/documentation)  
│   ├── [📒 LOKVEDA_COLLEGE.docx](/documentation/LOKVEDA_COLLEGE.docx)  
│   ├── [📒 LOKVEDA_COLLEGE.pdf](/documentation/LOKVEDA_COLLEGE.pdf)  
│   ├── [📒 LOKVEDA_STUDENT.docx](/documentation/LOKVEDA_STUDENT.docx)  
│   ├── [📒 LOKVEDA_STUDENT.pdf](/documentation/LOKVEDA_STUDENT.pdf)  
│   ├── [📗 SRS.docx](/documentation/SRS.docx)  
│   ├── [📕 SRS.pdf](/documentation/SRS.pdf)  
│   └── [📄 README.md](/documentation/README.md)
│  
├── [🕒 CHANGELOG.md](/CHANGELOG.md)  
├── [🔑 LICENSE](/LICENSE)  
└── [📄 README.md](/documentation/README.md)

---

## 📚 Documentation

- 📄 [Software Requirements Specification (SRS)](./documentation/SRS.pdf)
- 📒 [College Documentation](./documentation/LOKVEDA_COLLEGE.pdf)
- 📒 [Student Documentation](./documentation/LOKVEDA_STUDENT.pdf)
- 🕒 [Changelog](./documentation/CHANGELOG.md)
- 🔑 [License (MIT)](./LICENSE)

---

## 🔮 Future Scope

- Service application submission (CRUD)
- Admin approval workflows
- Staff verification flow
- Downloadable forms (PDF/DOCX)
- Profile management
- Full backend deployment

---

## 👥 Contributors

- **Dipsana Roy** — Core architecture, frontend, authentication, session logic, UX, Firebase integration
- Ayushman Saha — Documentation & Presentation
- Sayan Goswami — Documentation & Presentation
- Ananya Saha — Forms & Documentation
- Smritilata Sardar — Forms & Documentation

---

## 📜 License

This project is licensed under the **MIT License**.

---

## References

1. IEEE Software Requirements Specification Standards
2. Firebase Official Documentation
3. Twilio Console
4. MDN Web Docs – HTML, CSS, JavaScript
5. Research papers on E-Governance systems
6. ChatGPT (OpenAI) — Assisted in documentation structuring, content refinement, and automation of repetitive coding tasks

---

> **Note:**
> This project intentionally prioritizes **system design, security flow, and real-world logic** over feature completeness for this phase.

