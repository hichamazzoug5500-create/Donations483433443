import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  DEMO_ORGANIZATIONS, 
  DEMO_BRANCHES 
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
  const { userProfile, currentUser, isSuperAdmin } = useAuth();
  
  const [organizations, setOrganizations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-seed initial basic org & branches in Firestore if completely empty
  const autoSeedInitialData = async () => {
    try {
      const orgsSnap = await getDocs(collection(db, 'organizations'));
      if (orgsSnap.empty) {
        for (const org of DEMO_ORGANIZATIONS) {
          await setDoc(doc(db, 'organizations', org.id), org);
        }
      }

      const branchesSnap = await getDocs(collection(db, 'branches'));
      if (branchesSnap.empty) {
        for (const branch of DEMO_BRANCHES) {
          await setDoc(doc(db, 'branches', branch.id), branch);
        }
      }
    } catch (err) {
      console.warn("Auto-seed notice (requires auth):", err.message);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      autoSeedInitialData();
    }
  }, [currentUser?.uid]);

  // Firestore Real-Time Listeners
  useEffect(() => {
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

      // 3. Needs Listener (Global live feed)
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

      // 5. System Users (for Admin)
      const usersRef = collection(db, 'users');
      unsubs.push(onSnapshot(usersRef, (snap) => {
        setSystemUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      }, (err) => console.warn("Users listener notice:", err.message)));

      // 6. User In-App Notifications
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
  }, [currentUser?.uid]);

  // ==========================================
  // 1. NEEDS CRUD (Disaster Relief Needs)
  // ==========================================
  const createNeed = async (needData) => {
    const orgId = userProfile?.orgId || 'org-crescent-dz';
    const orgName = userProfile?.orgName || 'الهلال الأحمر الجزائري';
    const branchId = userProfile?.branchId || 'branch-cra-blida';
    const branchName = userProfile?.branchName || 'فرع ولاية البليدة';

    const payload = {
      orgId,
      orgName,
      branchId,
      branchName,
      title: needData.needDescription ? needData.needDescription.slice(0, 80) : needData.title,
      needDescription: needData.needDescription || needData.title || '',
      category: needData.category || 'food',
      urgency: needData.urgency || 'high',
      priority: needData.urgency === 'high' ? 'P1_critical' : needData.urgency === 'medium' ? 'P2_urgent' : 'P3_high',
      quantity: needData.quantity || '',
      phone: needData.phone || userProfile?.phone || '',
      contactPhone: needData.phone || userProfile?.phone || '',
      contactName: userProfile?.displayName || branchName,
      status: 'open',
      location: {
        city: needData.location?.city || needData.city || 'البليدة',
        wilaya: needData.location?.wilaya || needData.city || 'البليدة',
        address: needData.location?.address || needData.address || '',
        lat: Number(needData.location?.lat ?? needData.lat) || 36.4700,
        lng: Number(needData.location?.lng ?? needData.lng) || 2.8300
      },
      items: needData.items || [
        {
          itemId: 'item_' + Date.now(),
          category: needData.category || 'food',
          description: needData.needDescription || '',
          quantity: needData.quantity || '1',
          unit: ''
        }
      ],
      createdBy: currentUser?.uid || 'anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'needs'), payload);
    return docRef.id;
  };

  const updateNeed = async (needId, fields) => {
    const reqRef = doc(db, 'needs', needId);
    await updateDoc(reqRef, { ...fields, updatedAt: serverTimestamp() });
  };

  const deleteNeed = async (needId) => {
    await deleteDoc(doc(db, 'needs', needId));
  };

  // Direct commitment / aid pledge
  const commitToNeed = async (needId, pledgeData) => {
    const targetNeed = needs.find(n => n.id === needId);
    const donorBranchName = userProfile?.branchName || userProfile?.orgName || 'فرع متطوع';
    const donorBranchId = userProfile?.branchId || 'branch-cra-algiers';

    const updates = {
      status: 'in_progress',
      committedDonorId: donorBranchId,
      committedDonorName: donorBranchName,
      committedDonorPhone: pledgeData.donorPhone || userProfile?.phone || '',
      commitmentType: pledgeData.commitmentType || 'full',
      pledgedQuantity: pledgeData.providedQuantity || pledgeData.pledgedQuantity || '',
      remainingQuantity: pledgeData.commitmentType === 'partial' ? pledgeData.remainingQuantity : null,
      deliveryDate: pledgeData.estimatedArrival || '',
      donorNotes: pledgeData.notes || '',
      updatedAt: serverTimestamp()
    };

    await updateNeed(needId, updates);

    // Record an aid dispatch tracking document
    if (targetNeed) {
      await createDispatch({
        toOrgId: targetNeed.orgId,
        toOrgName: targetNeed.orgName,
        toBranchId: targetNeed.branchId,
        toBranchName: targetNeed.branchName,
        needId: needId,
        items: [
          {
            needItemId: targetNeed.items && targetNeed.items[0]?.itemId ? targetNeed.items[0].itemId : 'item_1',
            category: targetNeed.category || 'food',
            description: targetNeed.needDescription || targetNeed.title,
            quantity: pledgeData.providedQuantity || targetNeed.quantity || '1',
            unit: ''
          }
        ],
        notes: pledgeData.notes || '',
        transportDetails: {
          estimatedArrival: pledgeData.estimatedArrival || ''
        }
      });
    }
  };

  // ==========================================
  // 2. DISPATCHES MANAGEMENT
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
      toBranchId: dispatchData.toBranchId || 'branch-dest',
      toBranchName: dispatchData.toBranchName || 'الفرع المستلم',
      needId: dispatchData.needId || '',
      status: 'pledged',
      items: dispatchData.items || [],
      transportDetails: {
        vehiclePlate: dispatchData.transportDetails?.vehiclePlate || '',
        driverName: dispatchData.transportDetails?.driverName || '',
        driverPhone: dispatchData.transportDetails?.driverPhone || '',
        estimatedArrival: dispatchData.transportDetails?.estimatedArrival || ''
      },
      dispatchedBy: currentUser?.uid || 'user-sender',
      notes: dispatchData.notes || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'dispatches'), payload);
    return docRef.id;
  };

  const updateDispatchStatus = async (dispatchId, newStatus, extraData = {}) => {
    const dispRef = doc(db, 'dispatches', dispatchId);
    await updateDoc(dispRef, { 
      status: newStatus, 
      ...extraData, 
      updatedAt: serverTimestamp() 
    });
  };

  const confirmDispatchDelivery = async (dispatchId) => {
    return updateDispatchStatus(dispatchId, 'confirmed', {
      confirmedBy: currentUser?.uid,
      confirmedAt: new Date().toISOString()
    });
  };

  // ==========================================
  // 3. IN-APP NOTIFICATIONS
  // ==========================================
  const sendNotification = async (targetUid, notifPayload) => {
    if (!targetUid) return;
    const notifItem = {
      type: notifPayload.type || 'info',
      title: notifPayload.title,
      body: notifPayload.body,
      relatedNeedId: notifPayload.relatedNeedId || null,
      relatedDispatchId: notifPayload.relatedDispatchId || null,
      isRead: false,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'notifications', targetUid, 'items'), notifItem);
  };

  const markNotificationRead = async (notifId) => {
    if (currentUser?.uid) {
      const notifRef = doc(db, 'notifications', currentUser.uid, 'items', notifId);
      await updateDoc(notifRef, { isRead: true });
    }
  };

  const markAllNotificationsRead = async () => {
    notifications.forEach(async (n) => {
      if (!n.isRead && currentUser?.uid) {
        try {
          await updateDoc(doc(db, 'notifications', currentUser.uid, 'items', n.id), { isRead: true });
        } catch (e) {}
      }
    });
  };

  // ==========================================
  // 4. ADMIN CONTROLS
  // ==========================================
  const createOrganization = async (orgData) => {
    const payload = {
      name: orgData.name,
      nameEn: orgData.nameEn || '',
      type: orgData.type || 'ngo',
      allowCrossOrg: Boolean(orgData.allowCrossOrg),
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'organizations'), payload);
    return docRef.id;
  };

  const createBranch = async (branchData) => {
    const payload = {
      orgId: branchData.orgId,
      orgName: branchData.orgName || 'الهلال الأحمر الجزائري',
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
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'branches'), payload);
    return docRef.id;
  };

  const deleteAdminUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
  };

  const value = {
    organizations,
    branches,
    needs,
    dispatches,
    notifications,
    systemUsers,
    loading,

    createNeed,
    updateNeed,
    deleteNeed,
    commitToNeed,

    createDispatch,
    updateDispatchStatus,
    confirmDispatchDelivery,

    sendNotification,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotifsCount: notifications.filter(n => !n.isRead).length,

    createOrganization,
    createBranch,
    deleteAdminUser
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
