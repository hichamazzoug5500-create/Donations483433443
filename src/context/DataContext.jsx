import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  getDocs
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Seed Algerian Charity Needs for Demo Mode & Testing
const ALGERIA_DEMO_REQUESTS = [
  {
    requestId: 'req-alg-001',
    recipientId: 'demo-recipient-uid',
    orgName: 'جمعية الكافل لليتامي والمعوزين - الجزائر',
    needDescription: 'حاجة ماسة إلى طرود غذائية (زيت، سكر، دقيق، حليب، وحبوب) وعلب حليب أطفال لـ 50 عائلة معوزة بالجزائر العاصمة.',
    category: 'food',
    quantity: '50 قفة غذائية / 30 علبة حليب أطفال',
    location: {
      city: 'الجزائر العاصمة',
      address: 'شارع ديدوش مراد، القبة، الجزائر العاصمة',
      lat: 36.7538,
      lng: 3.0588
    },
    phone: '+213 550 12 34 56',
    urgency: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    requestId: 'req-alg-002',
    recipientId: 'rec-org-dz-02',
    orgName: 'جمعية البسمة للتكافل الاجتماعي - وهران',
    needDescription: 'أكسية شتوية وأغطية صوفية وجوارب دافئة للأطفال والعائلات القاطنة بالقرى النائية قبل حلول موجة البرد.',
    category: 'clothing',
    quantity: '100 بطانية صوفية / 60 معطف شتوي',
    location: {
      city: 'وهران',
      address: 'حي السعادة، وهران',
      lat: 35.6971,
      lng: -0.6308
    },
    phone: '+213 661 98 76 54',
    urgency: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    requestId: 'req-alg-003',
    recipientId: 'rec-org-dz-03',
    orgName: 'المعيشة الطبية الخيرية - قسنطينة',
    needDescription: 'حقائب إسعافات أولية، ضمادات طبية معقمة، كراسي متحركة، وأجهزة قياس الضغط والسكر للمرضى المعوزين.',
    category: 'medical',
    quantity: '5 كراسي متحركة / 20 حقيبة إسعافات',
    location: {
      city: 'قسنطينة',
      address: 'حي زواغي سليمان، قسنطينة',
      lat: 36.3650,
      lng: 6.6147
    },
    phone: '+213 770 45 67 89',
    urgency: 'medium',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    requestId: 'req-alg-004',
    recipientId: 'rec-org-dz-04',
    orgName: 'جمعية الغيث لإغاثة الحالات الطارئة - عنابة',
    needDescription: 'أفرشة، أسرة طوارئ قابلة للطي، وحقائب مستلزمات النظافة الشخصية لمأوى العائلات المتضررة.',
    category: 'shelter',
    quantity: '25 سرير طوارئ / 40 أفرشة',
    location: {
      city: 'عنابة',
      address: 'وسط المدينة، عنابة',
      lat: 36.9000,
      lng: 7.7667
    },
    phone: '+213 555 88 99 00',
    urgency: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    requestId: 'req-alg-005',
    recipientId: 'rec-org-dz-05',
    orgName: 'الهلال الأحمر الجزائري - فرع البليدة',
    needDescription: 'حقائب مدمجة للأدوات المدرسية (محافظ، مقالم، كراسات) لتوزيعها على تلاميذ المناطق المعوزة.',
    category: 'other',
    quantity: '100 محفظة مدرسية بملحقاتها',
    location: {
      city: 'البليدة',
      address: 'شارع فلسطين، البليدة',
      lat: 36.4700,
      lng: 2.8300
    },
    phone: '+213 662 11 22 33',
    urgency: 'low',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString()
  }
];

export const DataProvider = ({ children }) => {
  const { userProfile, currentUser, isDemoMode } = useAuth();
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Subscribe to real-time requests updates or handle local demo state
  useEffect(() => {
    if (!isFirebaseConfigured || isDemoMode) {
      const savedRequests = localStorage.getItem('hopelink_demo_requests');
      if (savedRequests) {
        try {
          setRequests(JSON.parse(savedRequests));
        } catch (e) {
          setRequests(ALGERIA_DEMO_REQUESTS);
        }
      } else {
        setRequests(ALGERIA_DEMO_REQUESTS);
        localStorage.setItem('hopelink_demo_requests', JSON.stringify(ALGERIA_DEMO_REQUESTS));
      }

      const savedResponses = localStorage.getItem('hopelink_demo_responses');
      if (savedResponses) {
        try {
          setResponses(JSON.parse(savedResponses));
        } catch (e) {
          setResponses([]);
        }
      }
      setLoadingRequests(false);
      return;
    }

    setLoadingRequests(true);

    // 1. Real-time Firestore Requests Listener (handles live sync immediately)
    const requestsRef = collection(db, 'requests');
    const unsubscribeRequests = onSnapshot(requestsRef, (snapshot) => {
      const docsData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let formattedCreatedAt = new Date().toISOString();
        if (data.createdAt?.toDate) {
          formattedCreatedAt = data.createdAt.toDate().toISOString();
        } else if (typeof data.createdAt === 'string') {
          formattedCreatedAt = data.createdAt;
        }

        return {
          requestId: docSnap.id,
          ...data,
          createdAt: formattedCreatedAt
        };
      });

      // Sort newest first client-side
      docsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRequests(docsData);
      setLoadingRequests(false);
    }, (error) => {
      console.warn("Firestore requests listener notice:", error.message);
      setLoadingRequests(false);
    });

    // 2. Real-time Firestore Responses Listener
    const responsesRef = collection(db, 'responses');
    const unsubscribeResponses = onSnapshot(responsesRef, (snapshot) => {
      const respData = snapshot.docs.map((docSnap) => ({
        responseId: docSnap.id,
        ...docSnap.data()
      }));
      setResponses(respData);
    }, (err) => {
      console.warn("Firestore responses listener notice:", err.message);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeResponses();
    };
  }, [isDemoMode, currentUser?.uid]);

  const updateDemoStorage = (newRequests) => {
    setRequests(newRequests);
    localStorage.setItem('hopelink_demo_requests', JSON.stringify(newRequests));
  };

  const updateDemoResponsesStorage = (newResponses) => {
    setResponses(newResponses);
    localStorage.setItem('hopelink_demo_responses', JSON.stringify(newResponses));
  };

  const createRequest = async (requestData) => {
    const authUid = currentUser?.uid || userProfile?.uid;
    if (!authUid) throw new Error("User must be logged in to post a request");

    const effectiveOrgName = userProfile?.orgName || currentUser?.displayName || 'جمعية خيرية';
    const effectivePhone = requestData.phone || userProfile?.phone || '';
    const effectiveCity = requestData.location?.city || userProfile?.city || 'الجزائر';

    const payload = {
      recipientId: authUid,
      orgName: effectiveOrgName,
      needDescription: requestData.needDescription || '',
      category: requestData.category || 'food',
      quantity: requestData.quantity || '',
      location: {
        city: effectiveCity,
        address: requestData.location?.address || '',
        lat: Number(requestData.location?.lat) || 36.7538,
        lng: Number(requestData.location?.lng) || 3.0588
      },
      phone: effectivePhone,
      urgency: requestData.urgency || 'medium',
      status: 'open'
    };

    if (!isFirebaseConfigured || isDemoMode) {
      const newReq = {
        requestId: 'req-' + Date.now(),
        ...payload,
        createdAt: new Date().toISOString()
      };
      const updated = [newReq, ...requests];
      updateDemoStorage(updated);
      return newReq.requestId;
    }

    const docRef = await addDoc(collection(db, 'requests'), {
      ...payload,
      createdAt: serverTimestamp()
    });

    // Optimistic local update
    const optimisticReq = {
      requestId: docRef.id,
      ...payload,
      createdAt: new Date().toISOString()
    };
    setRequests(prev => [optimisticReq, ...prev.filter(r => r.requestId !== docRef.id)]);

    return docRef.id;
  };

  const updateRequest = async (requestId, updatedFields) => {
    // Optimistic local update
    setRequests(prev => prev.map(req => 
      req.requestId === requestId ? { ...req, ...updatedFields } : req
    ));

    if (!isFirebaseConfigured || isDemoMode) {
      const updated = requests.map(req => 
        req.requestId === requestId ? { ...req, ...updatedFields } : req
      );
      updateDemoStorage(updated);
      return;
    }

    const reqRef = doc(db, 'requests', requestId);
    await updateDoc(reqRef, updatedFields);
  };

  const setRequestStatus = async (requestId, status) => {
    return updateRequest(requestId, { status });
  };

  const deleteRequest = async (requestId) => {
    // Optimistic local update
    setRequests(prev => prev.filter(req => req.requestId !== requestId));

    if (!isFirebaseConfigured || isDemoMode) {
      const updated = requests.filter(req => req.requestId !== requestId);
      updateDemoStorage(updated);
      return;
    }

    const reqRef = doc(db, 'requests', requestId);
    await deleteDoc(reqRef);
  };

  // Two-step logic: Confirm Aid Pledge / Accept Mission (Full or Partial)
  const commitToRequest = async (requestId, commitmentDetails = {}) => {
    const isFull = commitmentDetails.commitmentType !== 'partial';
    const authUid = currentUser?.uid || userProfile?.uid || 'donor-dz';
    const effectiveOrgName = userProfile?.orgName || currentUser?.displayName || 'محسن / متبرع';
    const effectivePhone = userProfile?.phone || '';

    const payload = {
      requestId,
      donorId: authUid,
      donorOrgName: effectiveOrgName,
      donorPhone: effectivePhone,
      commitmentType: isFull ? 'full' : 'partial',
      pledgedQuantity: commitmentDetails.pledgedQuantity || '',
      remainingQuantity: isFull ? '' : (commitmentDetails.remainingQuantity || ''),
      deliveryDate: commitmentDetails.deliveryDate || '',
      donorNotes: commitmentDetails.donorNotes || '',
      type: 'commitment',
      createdAt: new Date().toISOString()
    };

    const requestUpdates = isFull ? {
      status: 'in_progress',
      isFullCommitment: true,
      assignedDonorId: payload.donorId,
      assignedDonorName: payload.donorOrgName,
      assignedDonorPhone: payload.donorPhone,
      remainingQuantity: ''
    } : {
      status: 'open',
      isFullCommitment: false,
      hasPartialPledges: true,
      remainingQuantity: commitmentDetails.remainingQuantity || '',
      lastPartialDonorName: payload.donorOrgName,
      lastPartialDonorPhone: payload.donorPhone
    };

    // Optimistically update request state immediately
    setRequests(prev => prev.map(r => {
      if (r.requestId === requestId) {
        return {
          ...r,
          ...requestUpdates
        };
      }
      return r;
    }));

    if (!isFirebaseConfigured || isDemoMode) {
      const newResp = {
        responseId: 'resp-' + Date.now(),
        ...payload
      };
      const updatedResponses = [newResp, ...responses.filter(r => !(r.requestId === requestId && r.donorId === payload.donorId))];
      updateDemoResponsesStorage(updatedResponses);
      return newResp;
    }

    // Save in responses collection
    const docRef = await addDoc(collection(db, 'responses'), {
      ...payload,
      createdAt: serverTimestamp()
    });

    // Update request document
    const reqRef = doc(db, 'requests', requestId);
    await updateDoc(reqRef, requestUpdates);

    return { responseId: docRef.id, ...payload };
  };

  // Cancel commitment
  const cancelCommitment = async (requestId) => {
    // Optimistically update local state immediately
    setRequests(prev => prev.map(r => {
      if (r.requestId === requestId) {
        return {
          ...r,
          status: 'open',
          isFullCommitment: false,
          assignedDonorId: null,
          assignedDonorName: null,
          assignedDonorPhone: null,
          remainingQuantity: ''
        };
      }
      return r;
    }));

    if (!isFirebaseConfigured || isDemoMode) {
      const updatedResponses = responses.filter(r => !(r.requestId === requestId && r.donorId === userProfile?.uid));
      updateDemoResponsesStorage(updatedResponses);
      return;
    }

    // Update request back to open in Firestore
    const reqRef = doc(db, 'requests', requestId);
    await updateDoc(reqRef, {
      status: 'open',
      isFullCommitment: false,
      assignedDonorId: null,
      assignedDonorName: null,
      assignedDonorPhone: null,
      remainingQuantity: ''
    });
  };

  const getResponsesForRequest = async (requestId) => {
    if (!isFirebaseConfigured || isDemoMode) {
      return responses.filter(resp => resp.requestId === requestId);
    }

    try {
      const q = query(collection(db, 'responses'), where('requestId', '==', requestId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ responseId: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Notice getting responses for request:", err.message);
      return [];
    }
  };

  const value = {
    requests,
    responses,
    loadingRequests,
    createRequest,
    updateRequest,
    setRequestStatus,
    deleteRequest,
    commitToRequest,
    cancelCommitment,
    getResponsesForRequest
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
