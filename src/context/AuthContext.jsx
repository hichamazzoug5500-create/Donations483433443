import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup,
  signInWithEmailAndPassword,
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
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { DEMO_USERS, DEMO_ORGANIZATIONS, DEMO_BRANCHES } from '../data/mockReliefData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(DataContextContext || AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fix typo helper if needed
const DataContextContext = null;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured || isDemoMode) {
      const savedDemoUser = localStorage.getItem('relief_demo_user');
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setCurrentUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.displayName });
          setUserProfile(parsed);
        } catch (e) {
          console.error("Failed to parse demo user session:", e);
        }
      } else {
        // Default to Blida branch member for immediate demo visualization
        const defaultUser = DEMO_USERS['blida-cra@hopelink.dz'];
        setCurrentUser({ uid: defaultUser.uid, email: defaultUser.email, displayName: defaultUser.displayName });
        setUserProfile(defaultUser);
        localStorage.setItem('relief_demo_user', JSON.stringify(defaultUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // 1. Check direct doc by UID
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: data.displayName || user.displayName || '',
              photoURL: user.photoURL || data.photoURL || '',
              ...data,
              isProfileComplete: true
            });
            setAuthError(null);
          } else {
            // 2. Check if admin pre-created by Email query
            const q = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
              const matchedDoc = querySnap.docs[0];
              const data = matchedDoc.data();
              // Re-bind to authenticated UID
              const mergedProfile = {
                ...data,
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || data.displayName,
                photoURL: user.photoURL || data.photoURL || '',
                updatedAt: new Date().toISOString()
              };
              await setDoc(userDocRef, mergedProfile, { merge: true });
              setUserProfile({ ...mergedProfile, isProfileComplete: true });
              setAuthError(null);
            } else {
              // Not pre-registered by admin
              console.warn("Unregistered account attempted sign in:", user.email);
              setUserProfile({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                role: null,
                isProfileComplete: false,
                isUnregistered: true
              });
              setAuthError("حسابك غير مسجل في المنظومة. يرجى التواصل مع مسؤول المنظمة لإضافتك.");
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: null,
            isProfileComplete: false
          });
        }
      } else {
        setUserProfile(null);
        setAuthError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // Google Sign-In (Pre-registered check)
  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseConfigured || isDemoMode) {
      // Default to Algiers branch demo or super admin
      const defaultUser = DEMO_USERS['admin@hopelink.dz'];
      setCurrentUser({ uid: defaultUser.uid, email: defaultUser.email, displayName: defaultUser.displayName });
      setUserProfile(defaultUser);
      localStorage.setItem('relief_demo_user', JSON.stringify(defaultUser));
      return { user: defaultUser, success: true };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const profile = {
          uid: user.uid,
          email: user.email,
          displayName: data.displayName || user.displayName || '',
          photoURL: user.photoURL || data.photoURL || '',
          ...data,
          isProfileComplete: true
        };
        setUserProfile(profile);
        return { user, profile, success: true };
      }

      // Check if admin registered by email
      const q = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const matchedDoc = querySnap.docs[0];
        const data = matchedDoc.data();
        const mergedProfile = {
          ...data,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || data.displayName,
          photoURL: user.photoURL || data.photoURL || '',
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, mergedProfile, { merge: true });
        setUserProfile({ ...mergedProfile, isProfileComplete: true });
        return { user, profile: mergedProfile, success: true };
      }

      // Not pre-registered
      setAuthError("حسابك غير مسجل في المنظومة. يرجى التواصل مع مسؤول المنظمة لإضافتك.");
      return { 
        user, 
        profile: { isUnregistered: true, email: user.email }, 
        success: false, 
        error: "Unregistered account" 
      };
    } catch (err) {
      console.error("Google sign in error:", err);
      setAuthError(err.message);
      throw err;
    }
  };

  // Instant demo switch between predefined roles and branches
  const loginDemoAccount = (emailKey) => {
    const matched = DEMO_USERS[emailKey];
    if (matched) {
      setCurrentUser({ uid: matched.uid, email: matched.email, displayName: matched.displayName });
      setUserProfile(matched);
      localStorage.setItem('relief_demo_user', JSON.stringify(matched));
      setAuthError(null);
      return matched;
    }
    return null;
  };

  const updateProfileBasic = async ({ displayName, phone, photoURL }) => {
    if (!currentUser) throw new Error("No active user session");

    const updates = {
      displayName: displayName || userProfile?.displayName || '',
      phone: phone || userProfile?.phone || '',
      photoURL: photoURL || userProfile?.photoURL || '',
      updatedAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const updated = { ...userProfile, ...updates };
      setUserProfile(updated);
      localStorage.setItem('relief_demo_user', JSON.stringify(updated));
      return updated;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, updates, { merge: true });
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const logout = async () => {
    if (!isFirebaseConfigured || isDemoMode) {
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('relief_demo_user');
      return;
    }

    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const isSuperAdmin = Boolean(userProfile && userProfile.role === 'super_admin');
  const isBranchMember = Boolean(userProfile && userProfile.role === 'branch_member');
  const isRegisteredMember = Boolean(userProfile && userProfile.orgId && userProfile.branchId);

  const value = {
    currentUser,
    userProfile,
    loading,
    isDemoMode,
    setIsDemoMode,
    isSuperAdmin,
    isBranchMember,
    isRegisteredMember,
    authError,
    setAuthError,
    loginWithGoogle,
    loginDemoAccount,
    updateProfileBasic,
    logout,
    role: userProfile?.role || null,
    currentOrgId: userProfile?.orgId || null,
    currentBranchId: userProfile?.branchId || null
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
