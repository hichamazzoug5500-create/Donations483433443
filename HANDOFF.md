# 🤝 مستند التسليم النهائي — منصة أمل الجزائر (HopeLink Algeria)
# Production Ready Platform — GitHub & Firebase CI/CD Handoff

---

## 🔑 Repositories, Live URLs & Credentials

| Item | Value |
|------|-------|
| **GitHub Repository** | **https://github.com/hichamazzoug5500-create/Donations483433443** |
| **Live Web App** | **https://donations-bd9f2.web.app** |
| **Firebase Project** | `donations-bd9f2` |
| **Firebase Account** | `hichamazzoug5500@gmail.com` |
| **Firebase Console** | https://console.firebase.google.com/project/donations-bd9f2/overview |

---

## 🚀 GitHub Actions CI/CD Pipeline (`.github/workflows/firebase-hosting-merge.yml`)
- **Trigger**: Every push or merge to `main` branch.
- **Workflow**:
  1. Checks out repository.
  2. Sets up Node.js 20.
  3. Installs dependencies (`npm ci`).
  4. Runs production build (`npm run build`).
  5. Deploys directly to Firebase Hosting on the live channel (`channelId: live`).

---

*Pushed and live at https://github.com/hichamazzoug5500-create/Donations483433443*
