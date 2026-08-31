// Dedicated Mock & Seed Data for Relief Coordination Platform (منصة تنسيق الإغاثة)

export const DEMO_ORGANIZATIONS = [
  {
    id: 'org-crescent-dz',
    name: 'الهلال الأحمر الجزائري',
    nameEn: 'Algerian Red Crescent (CRA)',
    type: 'red_crescent',
    allowCrossOrg: true,
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'org-ihsan-dz',
    name: 'جمعية الإحسان الخيرية والإنسانية',
    nameEn: 'El-Ihsan Charity & Humanitarian Association',
    type: 'ngo',
    allowCrossOrg: true,
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'org-baraka-dz',
    name: 'جمعية البركة للإغاثة والأعمال الإنسانية',
    nameEn: 'Al-Baraka Relief & Humanitarian Works',
    type: 'ngo',
    allowCrossOrg: true,
    createdAt: '2026-02-01T08:00:00.000Z'
  }
];

export const DEMO_BRANCHES = [
  {
    id: 'branch-cra-blida',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    name: 'فرع ولاية البليدة (منطقة طوارئ)',
    wilaya: 'البليدة',
    address: 'شارع فلسطين، وسط مدينة البليدة',
    location: { lat: 36.4700, lng: 2.8300 },
    phone: '+213 550 11 22 33',
    status: 'disaster_zone',
    capabilities: ['warehouse', 'medical', 'volunteers', 'shelter'],
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'branch-cra-algiers',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    name: 'المقر المركزي والفرع الإقليمي - الجزائر العاصمة',
    wilaya: 'الجزائر العاصمة',
    address: 'شارع محمد الخامس، القبة، الجزائر العاصمة',
    location: { lat: 36.7538, lng: 3.0588 },
    phone: '+213 550 44 55 66',
    status: 'active',
    capabilities: ['warehouse', 'transport', 'medical', 'volunteers'],
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'branch-cra-oran',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    name: 'فرع ولاية وهران الإقليمي',
    wilaya: 'وهران',
    address: 'حي السعادة، وهران',
    location: { lat: 35.6971, lng: -0.6308 },
    phone: '+213 661 77 88 99',
    status: 'active',
    capabilities: ['warehouse', 'transport', 'volunteers'],
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'branch-ihsan-blida',
    orgId: 'org-ihsan-dz',
    orgName: 'جمعية الإحسان الخيرية والإنسانية',
    name: 'فرع البليدة - الإحسان',
    wilaya: 'البليدة',
    address: 'أولاد يعيش، البليدة',
    location: { lat: 36.4950, lng: 2.8550 },
    phone: '+213 770 12 34 56',
    status: 'disaster_zone',
    capabilities: ['volunteers', 'shelter'],
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'branch-ihsan-constantine',
    orgId: 'org-ihsan-dz',
    orgName: 'جمعية الإحسان الخيرية والإنسانية',
    name: 'فرع قسنطينة المركزي - الإحسان',
    wilaya: 'قسنطينة',
    address: 'حي زواغي سليمان، قسنطينة',
    location: { lat: 36.3650, lng: 6.6147 },
    phone: '+213 770 98 76 54',
    status: 'active',
    capabilities: ['warehouse', 'medical', 'transport'],
    createdAt: '2026-01-15T08:00:00.000Z'
  }
];

export const DEMO_USERS = {
  'admin@hopelink.dz': {
    uid: 'admin-uid',
    email: 'admin@hopelink.dz',
    displayName: 'مدير المنظمة العامة (Super Admin)',
    photoURL: '',
    phone: '+213 550 00 00 00',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    branchId: 'branch-cra-algiers',
    branchName: 'المقر المركزي والفرع الإقليمي - الجزائر العاصمة',
    role: 'super_admin',
    isProfileComplete: true,
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  'blida-cra@hopelink.dz': {
    uid: 'user-blida-cra',
    email: 'blida-cra@hopelink.dz',
    displayName: 'منسق فرع البليدة (منطقة منكوبة)',
    photoURL: '',
    phone: '+213 550 11 22 33',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    branchId: 'branch-cra-blida',
    branchName: 'فرع ولاية البليدة (منطقة طوارئ)',
    role: 'branch_member',
    isProfileComplete: true,
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  'algiers-cra@hopelink.dz': {
    uid: 'user-algiers-cra',
    email: 'algiers-cra@hopelink.dz',
    displayName: 'منسق فرع الجزائر العاصمة',
    photoURL: '',
    phone: '+213 550 44 55 66',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    branchId: 'branch-cra-algiers',
    branchName: 'المقر المركزي والفرع الإقليمي - الجزائر العاصمة',
    role: 'branch_member',
    isProfileComplete: true,
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  'oran-cra@hopelink.dz': {
    uid: 'user-oran-cra',
    email: 'oran-cra@hopelink.dz',
    displayName: 'منسق فرع وهران',
    photoURL: '',
    phone: '+213 661 77 88 99',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    branchId: 'branch-cra-oran',
    branchName: 'فرع ولاية وهران الإقليمي',
    role: 'branch_member',
    isProfileComplete: true,
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  'constantine-ihsan@hopelink.dz': {
    uid: 'user-ihsan-const',
    email: 'constantine-ihsan@hopelink.dz',
    displayName: 'منسق جمعية الإحسان - قسنطينة',
    photoURL: '',
    phone: '+213 770 98 76 54',
    orgId: 'org-ihsan-dz',
    orgName: 'جمعية الإحسان الخيرية والإنسانية',
    branchId: 'branch-ihsan-constantine',
    branchName: 'فرع قسنطينة المركزي - الإحسان',
    role: 'branch_member',
    isProfileComplete: true,
    createdAt: '2026-01-15T08:00:00.000Z'
  }
};

export const DEMO_NEEDS = [
  {
    id: 'need-blida-001',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    branchId: 'branch-cra-blida',
    branchName: 'فرع ولاية البليدة (منطقة طوارئ)',
    isCrossOrg: true,
    disasterType: 'flood',
    title: 'إغاثة عاجلة لمتضرري فيضانات وادي الشفة - البليدة',
    notes: 'غمرت مياه الأمطار الطوفانية أكثر من 120 مسكناً في بلدية الشفة مع انقطاع تام للمياه الصالحة للشرب.',
    priority: 'P1_critical',
    status: 'partially_fulfilled',
    items: [
      {
        itemId: 'item-food-01',
        category: 'food',
        description: 'طرود غذائية متكاملة (زيت، سكر، سميد، حليب، معلبات)',
        quantity: 300,
        unit: 'pack',
        quantityFulfilled: 150,
        priority: 'P1_critical'
      },
      {
        itemId: 'item-water-01',
        category: 'water',
        description: 'قارورات مياه معدنية سعة 5 لتر معقمة',
        quantity: 800,
        unit: 'unit',
        quantityFulfilled: 400,
        priority: 'P1_critical'
      },
      {
        itemId: 'item-med-01',
        category: 'medical',
        description: 'حقائب إسعافات أولية وضمادات جروح ومطهرات طبية',
        quantity: 50,
        unit: 'pack',
        quantityFulfilled: 0,
        priority: 'P2_urgent'
      }
    ],
    location: {
      wilaya: 'البليدة',
      address: 'بلدية الشفة، حي الشهداء، البليدة',
      lat: 36.4680,
      lng: 2.7660,
      accessStatus: 'obstructed'
    },
    branchLocation: { lat: 36.4700, lng: 2.8300 },
    branchPhone: '+213 550 11 22 33',
    affectedPopulation: {
      households: 120,
      individuals: 680
    },
    contactName: 'أحمد بن علي (مسؤول الطوارئ الميداني)',
    contactPhone: '+213 550 11 22 33',
    photos: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'need-blida-002',
    orgId: 'org-crescent-dz',
    orgName: 'الهلال الأحمر الجزائري',
    branchId: 'branch-cra-blida',
    branchName: 'فرع ولاية البليدة (منطقة طوارئ)',
    isCrossOrg: false,
    disasterType: 'earthquake',
    title: 'مستلزمات إيواء وأغطية شتوية لمركز الإيواء المؤقت - بوعينان',
    notes: 'إيواء 65 عائلة تضررت منازلهم جزئياً نتيجة الهزة الأرضية بمركز الشباب بوعينان.',
    priority: 'P2_urgent',
    status: 'active',
    items: [
      {
        itemId: 'item-shelter-01',
        category: 'shelter',
        description: 'خيام إيواء عائلية مقاومة للمطر والرياح',
        quantity: 40,
        unit: 'unit',
        quantityFulfilled: 0,
        priority: 'P2_urgent'
      },
      {
        itemId: 'item-cloth-01',
        category: 'clothing',
        description: 'بطانيات صوفية سميكة وأفرشة إسفنجية',
        quantity: 250,
        unit: 'unit',
        quantityFulfilled: 0,
        priority: 'P2_urgent'
      },
      {
        itemId: 'item-hygiene-01',
        category: 'hygiene',
        description: 'حقائب نظافة شخصية ومستلزمات أطفال ورضع',
        quantity: 100,
        unit: 'pack',
        quantityFulfilled: 0,
        priority: 'P3_high'
      }
    ],
    location: {
      wilaya: 'البليدة',
      address: 'مركز الإيواء المؤقت، بوعينان، البليدة',
      lat: 36.5310,
      lng: 2.9850,
      accessStatus: 'open'
    },
    branchLocation: { lat: 36.4700, lng: 2.8300 },
    branchPhone: '+213 550 11 22 33',
    affectedPopulation: {
      households: 65,
      individuals: 340
    },
    contactName: 'سفيان معوش (منسق الإيواء)',
    contactPhone: '+213 550 11 22 33',
    photos: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const DEMO_DISPATCHES = [
  {
    id: 'disp-001',
    orgId: 'org-crescent-dz',
    fromOrgName: 'الهلال الأحمر الجزائري',
    fromBranchId: 'branch-cra-algiers',
    fromBranchName: 'المقر المركزي والفرع الإقليمي - الجزائر العاصمة',
    toOrgId: 'org-crescent-dz',
    toOrgName: 'الهلال الأحمر الجزائري',
    toBranchId: 'branch-cra-blida',
    toBranchName: 'فرع ولاية البليدة (منطقة طوارئ)',
    needId: 'need-blida-001',
    status: 'in_transit',
    items: [
      {
        needItemId: 'item-food-01',
        category: 'food',
        description: 'طرود غذائية متكاملة',
        quantity: 150,
        unit: 'pack'
      },
      {
        needItemId: 'item-water-01',
        category: 'water',
        description: 'قارورات مياه معدنية 5 لتر',
        quantity: 400,
        unit: 'unit'
      }
    ],
    transportDetails: {
      vehiclePlate: '00145-124-16',
      driverName: 'مراد بلحاج',
      driverPhone: '+213 550 44 55 66',
      estimatedArrival: 'اليوم خلال ساعتين (قافلة إغاثة سريعة)'
    },
    dispatchedBy: 'user-algiers-cra',
    notes: 'قافلة شاحنتين انطلقت من مستودع القبة باتجاه وادي الشفة بالتنسيق مع الحماية المدنية.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

export const DEMO_NOTIFICATIONS = {
  'user-blida-cra': [
    {
      id: 'notif-001',
      type: 'dispatch_status_update',
      title: '🚚 قافلة إغاثة في الطريق إليكم',
      body: 'قام فرع الجزائر العاصمة بإرسال 150 طرد غذائي و 400 قارورة ماء. السائق: مراد بلحاج.',
      relatedNeedId: 'need-blida-001',
      relatedDispatchId: 'disp-001',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ]
};
