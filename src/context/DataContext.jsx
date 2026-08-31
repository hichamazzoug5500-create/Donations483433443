import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot, 
  serverTimestamp,
  where,
  getDocs,
  setDoc,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  DEMO_ORGANIZATIONS, 
  DEMO_BRANCHES, 
  DEMO_USERS, 
  DEMO_NEEDS, 
  DEMO_DISPATCHES, 
  DEMO_NOTIFICATIONS 
} from '../data/mockReliefData';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { userProfile, currentUser, isDemoMode, isSuperAdmin } = useAuth();
  
  // Primary Entity States
  const [organizations, setOrganizations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Load / Sync real-time or demo data
  useEffect(() => {
    if (!isFirebaseConfigured || isDemoMode) {
      // 1. Organizations
      const savedOrgs = localStorage.getItem('relief_demo_orgs');
      setOrganizations(savedOrgs ? JSON.parse(savedOrgs) : DEMO_ORGANIZATIONS);

      // 2. Branches
      const savedBranches = localStorage.getItem('relief_demo_branches');
      setBranches(savedBranches ? JSON.parse(savedBranches) : DEMO_BRANCHES);

      // 3. Needs
      const savedNeeds = localStorage.getItem('relief_demo_needs');
      setNeeds(savedNeeds ? JSON.parse(savedNeeds) : DEMO_NEEDS);

      // 4. Dispatches
      const savedDispatches = localStorage.getItem('relief_demo_dispatches');
      setDispatches(savedDispatches ? JSON.parse(savedDispatches) : DEMO_DISPATCHES);

      // 5. System Users
      const savedUsers = localStorage.getItem('relief_demo_users_list');
      setSystemUsers(savedUsers ? JSON.parse(savedUsers) : Object.values(DEMO_USERS));

      // 6. User Notifications
      const currentUid = userProfile?.uid || 'user-blida-cra';
      const userNotifs = DEMO_NOTIFICATIONS[currentUid] || [];
      const savedNotifs = localStorage.getItem('relief_demo_notifs_' + currentUid);
      setNotifications(savedNotifs ? JSON.parse(savedNotifs) : userNotifs);

      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubs = [];

    try {
      // 1. Organizations Listener
      const orgsRef = collection(db, 'organizations');
      unsubs.push(onSnapshot(orgsRef, (snap) => {
        setOrganizations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.warn("Orgs listener notice:", err.message)));

      // 2. Branches Listener
      const branchesRef = collection(db, 'branches');
      unsubs.push(onSnapshot(branchesRef, (snap) => {
        setBranches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.warn("Branches listener notice:", err.message)));

      // 3. Needs Listener
      const needsRef = collection(db, 'needs');
      unsubs.push(onSnapshot(needsRef, (snap) => {
        const docsData = snap.docs.map(d => {
          const data = d.data();
          let formattedCreatedAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
          return { id: d.id, ...data, createdAt: formattedCreatedAt || new Date().toISOString() };
        });
        docsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNeeds(docsData);
      }, (err) => console.warn("Needs listener notice:", err.message)));

      // 4. Dispatches Listener
      const dispatchesRef = collection(db, 'dispatches');
      unsubs.push(onSnapshot(dispatchesRef, (snap) => {
        const docsData = snap.docs.map(d => {
          const data = d.data();
          let formattedCreatedAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
          return { id: d.id, ...data, createdAt: formattedCreatedAt || new Date().toISOString() };
        });
        docsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDispatches(docsData);
      }, (err) => console.warn("Dispatches listener notice:", err.message)));

      // 5. System Users (if Super Admin)
      if (isSuperAdmin) {
        const usersRef = collection(db, 'users');
        unsubs.push(onSnapshot(usersRef, (snap) => {
          setSystemUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        }, (err) => console.warn("Users listener notice:", err.message)));
      }

      // 6. User Notifications Subcollection
      if (currentUser?.uid) {
        const notifsRef = collection(db, 'notifications', currentUser.uid, 'items');
        unsubs.push(onSnapshot(notifsRef, (snap) => {
          const notifData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          notifData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setNotifications(notifData);
        }, (err) => console.warn("Notifs listener notice:", err.message)));
      }

    } catch (e) {
      console.error("Firestore subscriptions setup error:", e);
    } finally {
      setLoading(false);
    }

    return () => unsubs.forEach(unsub => unsub && unsub());
  }, [isDemoMode, currentUser?.uid, isSuperAdmin]);

  // Storage helper for Demo Mode
  const persistDemo = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // ==========================================
  // 1. NEEDS MANAGEMENT (Disaster Relief Needs)
  // ==========================================
  const createNeed = async (needData) => {
    const orgId = userProfile?.orgId || 'org-crescent-dz';
    const orgName = userProfile?.orgName || 'الهلال الأحمر الجزائري';
    const branchId = userProfile?.branchId || 'branch-cra-blida';
    const branchName = userProfile?.branchName || 'فرع الطوارئ';

    // Auto-tag each item with a stable unique itemId if missing
    const sanitizedItems = (needData.items || []).map((item, idx) => ({
      itemId: item.itemId || `item_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      category: item.category || 'food',
      description: item.description || '',
      quantity: Number(item.quantity) || 1,
      unit: item.unit || 'unit',
      quantityFulfilled: Number(item.quantityFulfilled) || 0,
      priority: item.priority || needData.priority || 'P2_urgent'
    }));

    const payload = {
      orgId,
      orgName,
      branchId,
      branchName,
      isCrossOrg: Boolean(needData.isCrossOrg),
      disasterType: needData.disasterType || 'flood',
      title: needData.title || `نداء إغاثة عاجل - ${needData.location?.wilaya || 'المنطقة'}`,
      notes: needData.notes || '',
      priority: needData.priority || 'P2_urgent',
      status: 'active',
      items: sanitizedItems,
      location: {
        wilaya: needData.location?.wilaya || userProfile?.city || 'البليدة',
        address: needData.location?.address || '',
        lat: Number(needData.location?.lat) || 36.4700,
        lng: Number(needData.location?.lng) || 2.8300,
        accessStatus: needData.location?.accessStatus || 'open'
      },
      branchLocation: needData.branchLocation || { lat: 36.4700, lng: 2.8300 },
      branchPhone: userProfile?.phone || needData.contactPhone || '+213 550 11 22 33',
      affectedPopulation: {
        households: Number(needData.affectedPopulation?.households) || 0,
        individuals: Number(needData.affectedPopulation?.individuals) || 0
      },
      contactName: needData.contactName || userProfile?.displayName || 'مسؤول الطوارئ',
      contactPhone: needData.contactPhone || userProfile?.phone || '',
      photos: needData.photos || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const newNeed = { id: 'need-' + Date.now(), ...payload };
      const updated = [newNeed, ...needs];
      setNeeds(updated);
      persistDemo('relief_demo_needs', updated);

      // Trigger mock notification for branches in the same org
      branches.filter(b => b.orgId === orgId && b.id !== branchId).forEach(b => {
        sendNotification('broadcast', {
          title: `🆘 نداء إغاثة جديد (${payload.priority}): ${payload.title}`,
          body: `فرع ${branchName} أعلن عن احتياج عاجل في ${payload.location.wilaya}.`,
          relatedNeedId: newNeed.id
        });
      });

      return newNeed.id;
    }

    const docRef = await addDoc(collection(db, 'needs'), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const optimistic = { id: docRef.id, ...payload };
    setNeeds(prev => [optimistic, ...prev.filter(n => n.id !== docRef.id)]);
    return docRef.id;
  };

  const updateNeed = async (needId, fields) => {
    const updatedPayload = { ...fields, updatedAt: new Date().toISOString() };
    setNeeds(prev => prev.map(n => n.id === needId ? { ...n, ...updatedPayload } : n));

    if (!isFirebaseConfigured || isDemoMode) {
      const updated = needs.map(n => n.id === needId ? { ...n, ...updatedPayload } : n);
      persistDemo('relief_demo_needs', updated);
      return;
    }

    const reqRef = doc(db, 'needs', needId);
    await updateDoc(reqRef, { ...fields, updatedAt: serverTimestamp() });
  };

  const deleteNeed = async (needId) => {
    setNeeds(prev => prev.filter(n => n.id !== needId));

    if (!isFirebaseConfigured || isDemoMode) {
      const updated = needs.filter(n => n.id !== needId);
      persistDemo('relief_demo_needs', updated);
      return;
    }

    await deleteDoc(doc(db, 'needs', needId));
  };

  // ==========================================
  // 2. DISPATCHES MANAGEMENT (Inter-Branch Aid)
  // ==========================================
  const createDispatch = async (dispatchData) => {
    const fromOrgName = userProfile?.orgName || 'الهلال الأحمر الجزائري';
    const fromBranchName = userProfile?.branchName || 'الفرع المرسل';

    const payload = {
      orgId: userProfile?.orgId || 'org-crescent-dz',
      fromOrgName,
      fromBranchId: userProfile?.branchId || 'branch-cra-algiers',
      fromBranchName,
      toOrgId: dispatchData.toOrgId || userProfile?.orgId || 'org-crescent-dz',
      toOrgName: dispatchData.toOrgName || fromOrgName,
      toBranchId: dispatchData.toBranchId,
      toBranchName: dispatchData.toBranchName || 'الفرع المستقبل',
      needId: dispatchData.needId,
      status: 'pledged', // pledged -> packing -> dispatched -> in_transit -> delivered -> confirmed
      items: dispatchData.items || [],
      transportDetails: {
        vehiclePlate: dispatchData.transportDetails?.vehiclePlate || '',
        driverName: dispatchData.transportDetails?.driverName || '',
        driverPhone: dispatchData.transportDetails?.driverPhone || '',
        estimatedArrival: dispatchData.transportDetails?.estimatedArrival || ''
      },
      dispatchedBy: currentUser?.uid || userProfile?.uid || 'user-sender',
      notes: dispatchData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate & update need's item fulfillment immediately
    const targetNeed = needs.find(n => n.id === dispatchData.needId);
    if (targetNeed) {
      const updatedNeedItems = targetNeed.items.map(nItem => {
        const matchingDispatchItem = payload.items.find(dItem => dItem.needItemId === nItem.itemId);
        if (matchingDispatchItem) {
          const newQty = (nItem.quantityFulfilled || 0) + (Number(matchingDispatchItem.quantity) || 0);
          return { ...nItem, quantityFulfilled: newQty };
        }
        return nItem;
      });

      const allFulfilled = updatedNeedItems.every(item => (item.quantityFulfilled || 0) >= item.quantity);
      const someFulfilled = updatedNeedItems.some(item => (item.quantityFulfilled || 0) > 0);
      const newStatus = allFulfilled ? 'fulfilled' : (someFulfilled ? 'partially_fulfilled' : 'active');

      updateNeed(targetNeed.id, {
        items: updatedNeedItems,
        status: newStatus
      });
    }

    if (!isFirebaseConfigured || isDemoMode) {
      const newDispatch = { id: 'disp-' + Date.now(), ...payload };
      const updated = [newDispatch, ...dispatches];
      setDispatches(updated);
      persistDemo('relief_demo_dispatches', updated);

      // Create notification for receiving branch
      sendNotification(dispatchData.toBranchId, {
        type: 'dispatch_pledged',
        title: `📦 التزام بإرسال شحنة إغاثة من ${fromBranchName}`,
        body: `تم تجهيز شحنة إغاثة تتضمن ${payload.items.length} أصناف في طريقها لفرعكم.`,
        relatedNeedId: dispatchData.needId,
        relatedDispatchId: newDispatch.id
      });

      return newDispatch.id;
    }

    const docRef = await addDoc(collection(db, 'dispatches'), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const optimistic = { id: docRef.id, ...payload };
    setDispatches(prev => [optimistic, ...prev.filter(d => d.id !== docRef.id)]);

    return docRef.id;
  };

  const updateDispatchStatus = async (dispatchId, newStatus, extraData = {}) => {
    const updates = { 
      status: newStatus, 
      ...extraData, 
      updatedAt: new Date().toISOString() 
    };

    setDispatches(prev => prev.map(d => d.id === dispatchId ? { ...d, ...updates } : d));

    if (!isFirebaseConfigured || isDemoMode) {
      const updated = dispatches.map(d => d.id === dispatchId ? { ...d, ...updates } : d);
      persistDemo('relief_demo_dispatches', updated);

      const targetDisp = dispatches.find(d => d.id === dispatchId);
      if (targetDisp) {
        sendNotification(targetDisp.toBranchId, {
          type: 'dispatch_status_update',
          title: `🚚 تحديث مسار الشحنة (${newStatus})`,
          body: `الشحنة القادمة من ${targetDisp.fromBranchName} أصبحت بحالة: ${newStatus}.`,
          relatedDispatchId: dispatchId,
          relatedNeedId: targetDisp.needId
        });
      }
      return;
    }

    const dispRef = doc(db, 'dispatches', dispatchId);
    await updateDoc(dispRef, { ...updates, updatedAt: serverTimestamp() });
  };

  const confirmDispatchDelivery = async (dispatchId) => {
    return updateDispatchStatus(dispatchId, 'confirmed', {
      confirmedBy: currentUser?.uid || userProfile?.uid,
      confirmedAt: new Date().toISOString()
    });
  };

  // ==========================================
  // 3. NOTIFICATIONS SYSTEM
  // ==========================================
  const sendNotification = async (targetUidOrBranch, notifPayload) => {
    const notifItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type: notifPayload.type || 'info',
      title: notifPayload.title,
      body: notifPayload.body,
      relatedNeedId: notifPayload.relatedNeedId || null,
      relatedDispatchId: notifPayload.relatedDispatchId || null,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const currentUid = userProfile?.uid || 'user-blida-cra';
      const updated = [notifItem, ...notifications];
      setNotifications(updated);
      persistDemo('relief_demo_notifs_' + currentUid, updated);
      return notifItem.id;
    }

    if (currentUser?.uid) {
      await addDoc(collection(db, 'notifications', currentUser.uid, 'items'), {
        ...notifItem,
        createdAt: serverTimestamp()
      });
    }
  };

  const markNotificationRead = async (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));

    if (!isFirebaseConfigured || isDemoMode) {
      const currentUid = userProfile?.uid || 'user-blida-cra';
      const updated = notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n);
      persistDemo('relief_demo_notifs_' + currentUid, updated);
      return;
    }

    if (currentUser?.uid) {
      const notifRef = doc(db, 'notifications', currentUser.uid, 'items', notifId);
      await updateDoc(notifRef, { isRead: true });
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    if (!isFirebaseConfigured || isDemoMode) {
      const currentUid = userProfile?.uid || 'user-blida-cra';
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      persistDemo('relief_demo_notifs_' + currentUid, updated);
      return;
    }

    // In firestore, mark items
    notifications.forEach(async (n) => {
      if (!n.isRead && currentUser?.uid) {
        try {
          await updateDoc(doc(db, 'notifications', currentUser.uid, 'items', n.id), { isRead: true });
        } catch (e) {}
      }
    });
  };

  // ==========================================
  // 4. ADMIN ENTITY CONTROLS (Super Admin Only)
  // ==========================================
  const createOrganization = async (orgData) => {
    const payload = {
      name: orgData.name,
      nameEn: orgData.nameEn || '',
      type: orgData.type || 'ngo',
      allowCrossOrg: Boolean(orgData.allowCrossOrg),
      createdAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const newOrg = { id: 'org-' + Date.now(), ...payload };
      const updated = [...organizations, newOrg];
      setOrganizations(updated);
      persistDemo('relief_demo_orgs', updated);
      return newOrg.id;
    }

    const docRef = await addDoc(collection(db, 'organizations'), {
      ...payload,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const createBranch = async (branchData) => {
    const payload = {
      orgId: branchData.orgId,
      orgName: branchData.orgName || 'منظمة إغاثية',
      name: branchData.name,
      wilaya: branchData.wilaya,
      address: branchData.address || '',
      location: {
        lat: Number(branchData.location?.lat) || 36.7538,
        lng: Number(branchData.location?.lng) || 3.0588
      },
      phone: branchData.phone || '',
      status: branchData.status || 'active',
      capabilities: branchData.capabilities || ['volunteers'],
      createdAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const newBranch = { id: 'branch-' + Date.now(), ...payload };
      const updated = [...branches, newBranch];
      setBranches(updated);
      persistDemo('relief_demo_branches', updated);
      return newBranch.id;
    }

    const docRef = await addDoc(collection(db, 'branches'), {
      ...payload,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const createAdminUser = async (userData) => {
    const payload = {
      email: userData.email.toLowerCase().trim(),
      displayName: userData.displayName,
      phone: userData.phone || '',
      orgId: userData.orgId,
      orgName: userData.orgName || '',
      branchId: userData.branchId,
      branchName: userData.branchName || '',
      role: userData.role || 'branch_member',
      isProfileComplete: true,
      createdAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const newUser = { uid: 'user-' + Date.now(), ...payload };
      const updated = [...systemUsers, newUser];
      setSystemUsers(updated);
      persistDemo('relief_demo_users_list', updated);
      return newUser.uid;
    }

    const docRef = await addDoc(collection(db, 'users'), {
      ...payload,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const deleteAdminUser = async (userId) => {
    setSystemUsers(prev => prev.filter(u => u.uid !== userId));
    if (!isFirebaseConfigured || isDemoMode) {
      const updated = systemUsers.filter(u => u.uid !== userId);
      persistDemo('relief_demo_users_list', updated);
      return;
    }
    await deleteDoc(doc(db, 'users', userId));
  };

  const value = {
    // Entities
    organizations,
    branches,
    needs,
    dispatches,
    notifications,
    systemUsers,
    loading,

    // Needs actions
    createNeed,
    updateNeed,
    deleteNeed,

    // Dispatch actions
    createDispatch,
    updateDispatchStatus,
    confirmDispatchDelivery,

    // Notifications actions
    sendNotification,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotifsCount: notifications.filter(n => !n.isRead).length,

    // Super Admin actions
    createOrganization,
    createBranch,
    createAdminUser,
    deleteAdminUser
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
