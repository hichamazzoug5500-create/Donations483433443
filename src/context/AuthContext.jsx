import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Secondary Firebase app to create users without disconnecting the logged-in admin
const getSecondaryAuth = () => {
  const secondaryAppName = 'SecondaryAuthApp';
  let secondaryApp = getApps().find(app => app.name === secondaryAppName);
  if (!secondaryApp) {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDxuoWkEP_o8T_Qdt8zZA4CiOKFsBp75_A",
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "donations-bd9f2.firebaseapp.com",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "donations-bd9f2",
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "donations-bd9f2.firebasestorage.app",
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "152610577314",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:152610577314:web:955afa07488b8b897670fb"
    };
    secondaryApp = initializeApp(config, secondaryAppName);
  }
  return getAuth(secondaryApp);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: data.displayName || user.displayName || 'مستخدم المنظومة',
              role: data.role || (user.email === 'admin@hopelink.dz' ? 'super_admin' : 'branch_member'),
              orgId: data.orgId || 'org-crescent-dz',
              orgName: data.orgName || 'الهلال الأحمر الجزائري',
              branchId: data.branchId || 'branch-cra-algiers',
              branchName: data.branchName || 'الفرع الميداني',
              city: data.city || data.wilaya || 'الجزائر',
              phone: data.phone || '',
              ...data,
              isProfileComplete: true
            });
            setAuthError(null);
          } else {
            // First-time doc creation for this user
            const isAdmin = user.email?.toLowerCase().includes('admin') || user.email === 'admin@hopelink.dz';
            const initialProfile = {
              uid: user.uid,
              email: user.email,
              displayName: isAdmin ? 'المشرف العام (Admin)' : (user.displayName || 'منسق الفرع'),
              role: isAdmin ? 'super_admin' : 'branch_member',
              orgId: 'org-crescent-dz',
              orgName: 'الهلال الأحمر الجزائري',
              branchId: isAdmin ? 'branch-hq' : 'branch-cra-blida',
              branchName: isAdmin ? 'الإدارة العامة والمقر الوطني' : 'فرع ولاية البليدة',
              city: 'الجزائر العاصمة',
              phone: '0550 12 34 56',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isProfileComplete: true
            };

            await setDoc(userDocRef, initialProfile, { merge: true });
            setUserProfile(initialProfile);
            setAuthError(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'مستخدم',
            role: user.email === 'admin@hopelink.dz' ? 'super_admin' : 'branch_member',
            orgId: 'org-crescent-dz',
            orgName: 'الهلال الأحمر الجزائري',
            branchId: 'branch-cra-algiers',
            branchName: 'الفرع الميداني',
            isProfileComplete: true
          });
        }
      } else {
        setUserProfile(null);
        setAuthError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Standard Email & Password Login
  const loginWithEmail = async (identifier, password) => {
    setAuthError(null);
    let email = identifier.trim().toLowerCase();

    // Support typing 'admin' as shortcut
    if (email === 'admin') {
      email = 'admin@hopelink.dz';
    } else if (!email.includes('@')) {
      email = `${email}@hopelink.dz`;
    }

    try {
      // 1. Try standard sign-in
      const res = await signInWithEmailAndPassword(auth, email, password);
      return { user: res.user, success: true };
    } catch (err) {
      console.warn("Sign-in attempt:", err.code);

      // If user-not-found, and it's the admin bootstrap account, auto-create it
      if (
        (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') &&
        (email === 'admin@hopelink.dz' || email.startsWith('admin@'))
      ) {
        try {
          const createRes = await createUserWithEmailAndPassword(auth, email, password);
          const adminUser = createRes.user;

          const adminProfile = {
            uid: adminUser.uid,
            email: adminUser.email,
            displayName: 'المشرف العام (Admin)',
            role: 'super_admin',
            orgId: 'org-crescent-dz',
            orgName: 'الهلال الأحمر الجزائري',
            branchId: 'branch-hq',
            branchName: 'المقر العام للتنسيق',
            city: 'الجزائر العاصمة',
            phone: '0550 00 00 00',
            createdAt: new Date().toISOString(),
            isProfileComplete: true
          };

          await setDoc(doc(db, 'users', adminUser.uid), adminProfile);
          setUserProfile(adminProfile);
          return { user: adminUser, profile: adminProfile, success: true };
        } catch (createErr) {
          // If creation fails due to email already in use, it was just wrong password
          if (createErr.code === 'auth/email-already-in-use') {
            throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور.');
          }
          throw createErr;
        }
      }

      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/user-not-found') {
        throw new Error('هذا الحساب غير مسجل. يرجى طلب إنشاء حساب من المشرف.');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('صيغة البريد الإلكتروني غير صحيحة.');
      }
      throw err;
    }
  };

  // Register a new staff user by Admin without logging the admin out
  const createNewStaffAccount = async ({ email, password, displayName, role, orgId, orgName, branchId, branchName, phone }) => {
    let cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@hopelink.dz`;
    }

    const secondaryAuth = getSecondaryAuth();
    const cred = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password || 'password123');
    const newUid = cred.user.uid;

    const newProfile = {
      uid: newUid,
      email: cleanEmail,
      displayName: displayName || 'منسق فرع',
      role: role || 'branch_member',
      orgId: orgId || 'org-crescent-dz',
      orgName: orgName || 'الهلال الأحمر الجزائري',
      branchId: branchId || 'branch-cra-blida',
      branchName: branchName || 'فرع ولاية البليدة',
      phone: phone || '',
      createdAt: new Date().toISOString(),
      isProfileComplete: true
    };

    await setDoc(doc(db, 'users', newUid), newProfile);
    await signOut(secondaryAuth); // Sign out secondary instance so it doesn't leak state

    return newProfile;
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const isSuperAdmin = Boolean(
    currentUser?.email === 'admin@hopelink.dz' || 
    userProfile?.role === 'super_admin'
  );

  const isBranchMember = Boolean(userProfile && userProfile.role === 'branch_member');

  const value = {
    currentUser,
    userProfile,
    loading,
    isSuperAdmin,
    isBranchMember,
    authError,
    setAuthError,
    loginWithEmail,
    createNewStaffAccount,
    logout,
    role: userProfile?.role || (isSuperAdmin ? 'super_admin' : 'branch_member'),
    currentOrgId: userProfile?.orgId || 'org-crescent-dz',
    currentBranchId: userProfile?.branchId || 'branch-cra-algiers'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
