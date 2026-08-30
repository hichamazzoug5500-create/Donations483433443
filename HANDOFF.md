# 🤝 مستند التسليم النهائي — منصة أمل الجزائر (HopeLink Algeria)
# Production Ready Platform — Google Auth Exclusive

---

## 🔑 Firebase Account & Live Production URL

| Item | Value |
|------|-------|
| **Firebase Account** | `hichamazzoug5500@gmail.com` |
| **Project ID** | `donations-bd9f2` |
| **Live Web App** | **https://donations-bd9f2.web.app** |
| **Firebase Console** | https://console.firebase.google.com/project/donations-bd9f2/overview |

---

## 🔒 Exclusive Google Authentication Flow

1. **No Arbitrary Manual Email/Password**:
   - Manual registration forms have been completely removed.
   - Users are not given fields to type arbitrary credentials.
2. **Mandatory Google Account Sign-In / Sign-Up**:
   - Users must authenticate through Google Sign-In (`signInWithPopup(auth, googleProvider)`).
   - Once authenticated with their verified Google account, their email and avatar are automatically linked.
3. **Mandatory Organization Details Step (`/complete-profile`)**:
   - First-time users are prompted to complete their:
     - **Role** (*Recipient Charity / Donor*)
     - **Organization / Donor Name**
     - **Algerian Phone Number**
     - **Algerian Wilaya (from 58 Wilayas)**
   - Only after submitting this verified profile are they admitted to their dashboard.

---

*Live build verified & deployed to https://donations-bd9f2.web.app*
