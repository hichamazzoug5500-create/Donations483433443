# HopeLink — Charity Needs & Donations Matching Platform

A full-stack, mobile-first web platform connecting recipient charitable organizations in need of supplies with donor organizations willing to give.

Built with **React**, **Tailwind CSS**, **Lucide Icons**, **Leaflet Maps**, and **Firebase** (Authentication + Cloud Firestore + Hosting + Firestore Security Rules).

---

## 🌟 Key Features

### 1. User Roles & Authentication
- **Recipient ("I need help")**: Frontline charities posting requests for food, clothing, medical supplies, shelter, etc.
- **Donor ("I want to help")**: Donor organizations browsing active needs, filtering requests, and reaching out to fulfill them.
- Firebase Authentication (email + password) with Firestore `users` profile documents.

### 2. Recipient Dashboard
- Post new need requests with category, quantity, address, map location coordinates, phone contact, and urgency level.
- Filter owned requests by status (*All*, *Open*, *Fulfilled*).
- **Edit** existing requests or toggle status (**Mark as Fulfilled** / **Re-open**).
- **Donor Response Log**: View a real-time list of donor organizations that clicked "Help / Contact" on your request.

### 3. Donor Dashboard
- Scrollable feed of all open requests (`status = "open"`).
- Multi-filter controls: Free-text search, City filter, Category filter (*Food*, *Clothing*, *Medical*, *Shelter*, *Other*), and Urgency filter (*High*, *Moderate*, *Low*).
- **Dual View Modes**:
  - **Grid Card View**: Clean mobile-first cards with status badges and relative date tags.
  - **Interactive Map View**: Powered by Leaflet OpenStreetMap with custom urgency pin markers.
- **Help / Contact Action**:
  - Reveals the recipient's phone number with 1-click calling (`tel:`) and copy options.
  - Automatically logs the response in the Firestore `responses` collection.

---

## 📁 Data Model (Firestore)

### `users` collection (`users/{uid}`)
```json
{
  "orgName": "Red Cross Metro",
  "role": "recipient", // or "donor"
  "phone": "+1 (555) 000-1122",
  "city": "Chicago",
  "createdAt": "2026-08-30T12:00:00.000Z"
}
```

### `requests` collection (`requests/{requestId}`)
```json
{
  "recipientId": "uid_reference",
  "orgName": "Hope Community Pantry",
  "needDescription": "Urgent need for non-perishable food supplies...",
  "category": "food", // "food" | "clothing" | "medical" | "shelter" | "other"
  "quantity": "50 Food Packs",
  "location": {
    "city": "Chicago",
    "address": "1420 S Michigan Ave",
    "lat": 41.8631,
    "lng": -87.6244
  },
  "phone": "+1 (312) 555-0144",
  "urgency": "high", // "low" | "medium" | "high"
  "status": "open", // "open" | "fulfilled"
  "createdAt": "2026-08-30T12:00:00.000Z"
}
```

### `responses` collection (`responses/{responseId}`)
```json
{
  "requestId": "req-001",
  "donorId": "donor_uid",
  "donorOrgName": "Global Care Foundation",
  "donorPhone": "+1 (555) 876-5432",
  "createdAt": "2026-08-30T12:00:00.000Z"
}
```

---

## 🔒 Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.recipientId;
    }
    match /responses/{responseId} {
      allow read, create: if request.auth != null;
    }
  }
}
```

---

## 🚀 Getting Started

### 1. Local Development Setup
```bash
# Clone or navigate to project directory
cd Donations

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### 2. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Enable Authentication**:
   - Go to **Build > Authentication > Sign-in method**.
   - Enable **Email/Password** provider.
3. **Create Cloud Firestore Database**:
   - Go to **Build > Firestore Database > Create database**.
   - Choose production mode and select a location.
   - Under the **Rules** tab, paste the contents of `firestore.rules`.
4. **Register Web App**:
   - In Project Overview, click the **Web icon (`</>`)** to add an app.
   - Copy your Firebase SDK configuration keys.

### 3. Connect Environment Keys

Create a file named `.env.local` in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### 4. Deploying to Firebase Hosting

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Log in to Firebase
firebase login

# Initialize hosting (if needed)
firebase init hosting

# Build production bundle
npm run build

# Deploy site & rules
firebase deploy
```

---

## ⚡ Demo Preview Mode
If environment variables are not provided, the application automatically runs in **Demo Mode** with simulated offline local storage and pre-loaded sample requests so you can immediately preview all features without Firebase console setup!
