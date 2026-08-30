import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEMO_USERS = {
  'demo-recipient@hopelink.org': {
    uid: 'demo-recipient-uid',
    email: 'demo-recipient@hopelink.org',
    orgName: 'جمعية الكافل لليتامي والمعوزين - الجزائر',
    role: 'recipient',
    phone: '+213 550 12 34 56',
    city: 'الجزائر العاصمة',
    isProfileComplete: true,
    createdAt: new Date().toISOString()
  },
  'demo-donor@hopelink.org': {
    uid: 'demo-donor-uid',
    email: 'demo-donor@hopelink.org',
    orgName: 'منظمة الخير للتكافل والعمل الإنساني',
    role: 'donor',
    phone: '+213 661 98 76 54',
    city: 'وهران',
    isProfileComplete: true,
    createdAt: new Date().toISOString()
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || isDemoMode) {
      const savedDemoUser = localStorage.getItem('hopelink_demo_user');
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setCurrentUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.orgName });
          setUserProfile(parsed);
        } catch (e) {
          console.error("Failed to parse demo user session:", e);
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const isComplete = Boolean(data.role && data.orgName && data.phone && data.city);
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              ...data,
              isProfileComplete: isComplete
            });
          } else {
            // Document does not exist yet (requires profile completion)
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              orgName: user.displayName || '',
              phone: user.phoneNumber || '',
              city: '',
              role: null,
              isProfileComplete: false
            });
          }
        } catch (error) {
          console.error("Error fetching Firestore user profile:", error);
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isProfileComplete: false
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const signup = async ({ email, password, orgName, role, phone, city }) => {
    if (!isFirebaseConfigured || isDemoMode) {
      const uid = 'demo-uid-' + Date.now();
      const profile = {
        uid,
        email,
        orgName,
        role,
        phone,
        city,
        isProfileComplete: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser({ uid, email, displayName: orgName });
      setUserProfile(profile);
      localStorage.setItem('hopelink_demo_user', JSON.stringify(profile));
      return profile;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profileData = {
      orgName,
      role,
      phone,
      city,
      isProfileComplete: true,
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), profileData);
    setUserProfile({ uid: user.uid, email: user.email, ...profileData, isProfileComplete: true });
    return user;
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || isDemoMode) {
      const demoMatch = DEMO_USERS[email.toLowerCase()];
      let profile;
      if (demoMatch) {
        profile = demoMatch;
      } else {
        profile = {
          uid: 'demo-' + Date.now(),
          email,
          orgName: email.split('@')[0] + ' Org',
          role: 'recipient',
          phone: '+213 550 00 11 22',
          city: 'الجزائر العاصمة',
          isProfileComplete: true,
          createdAt: new Date().toISOString()
        };
      }
      setCurrentUser({ uid: profile.uid, email: profile.email, displayName: profile.orgName });
      setUserProfile(profile);
      localStorage.setItem('hopelink_demo_user', JSON.stringify(profile));
      return profile;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const isComplete = Boolean(data.role && data.orgName && data.phone && data.city);
      setUserProfile({ uid: user.uid, email: user.email, ...data, isProfileComplete: isComplete });
    } else {
      setUserProfile({ uid: user.uid, email: user.email, isProfileComplete: false });
    }
    return user;
  };

  // Google Sign-In helper: Signs user in, checks profile completion
  const loginWithGoogle = async (initialRoleHint = null) => {
    if (!isFirebaseConfigured || isDemoMode) {
      // For demo mode, prompt profile completion or auto-complete if role provided
      const profile = {
        uid: 'demo-google-' + Date.now(),
        email: 'google-user@gmail.com',
        orgName: 'محسن / منظمة تجريبية',
        role: initialRoleHint || 'recipient',
        phone: '+213 550 99 88 77',
        city: 'الجزائر العاصمة',
        isProfileComplete: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser({ uid: profile.uid, email: profile.email, displayName: profile.orgName });
      setUserProfile(profile);
      localStorage.setItem('hopelink_demo_user', JSON.stringify(profile));
      return { user: { uid: profile.uid, email: profile.email }, needsCompletion: false };
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const isComplete = Boolean(data.role && data.orgName && data.phone && data.city);
      const profile = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL, ...data, isProfileComplete: isComplete };
      setUserProfile(profile);
      return { user, needsCompletion: !isComplete, role: data.role };
    } else {
      // Profile does NOT exist yet. User MUST fill their details on /complete-profile
      const incompleteProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        orgName: user.displayName || '',
        phone: user.phoneNumber || '',
        city: '',
        role: initialRoleHint || null,
        isProfileComplete: false
      };
      setUserProfile(incompleteProfile);
      return { user, needsCompletion: true };
    }
  };

  // Explicitly saves completed profile information
  const saveUserProfile = async ({ orgName, role, phone, city, notes = '' }) => {
    if (!currentUser) throw new Error("No authenticated user found");

    const profileData = {
      orgName: orgName.trim(),
      role,
      phone: phone.trim(),
      city: city.trim(),
      notes: notes.trim(),
      isProfileComplete: true,
      updatedAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const updated = {
        ...userProfile,
        ...profileData
      };
      setUserProfile(updated);
      localStorage.setItem('hopelink_demo_user', JSON.stringify(updated));
      return updated;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, {
      ...profileData,
      email: currentUser.email,
      createdAt: serverTimestamp()
    }, { merge: true });

    const newProfile = {
      ...userProfile,
      ...profileData
    };
    setUserProfile(newProfile);
    return newProfile;
  };

  const loginDemoRole = (role) => {
    const email = role === 'recipient' ? 'demo-recipient@hopelink.org' : 'demo-donor@hopelink.org';
    const profile = DEMO_USERS[email];
    setCurrentUser({ uid: profile.uid, email: profile.email, displayName: profile.orgName });
    setUserProfile(profile);
    localStorage.setItem('hopelink_demo_user', JSON.stringify(profile));
  };

  const logout = async () => {
    if (!isFirebaseConfigured || isDemoMode) {
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('hopelink_demo_user');
      return;
    }

    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const isProfileComplete = Boolean(userProfile && userProfile.isProfileComplete && userProfile.role);

  const value = {
    currentUser,
    userProfile,
    loading,
    isDemoMode,
    setIsDemoMode,
    isProfileComplete,
    signup,
    login,
    loginWithGoogle,
    saveUserProfile,
    loginDemoRole,
    logout,
    role: userProfile?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
