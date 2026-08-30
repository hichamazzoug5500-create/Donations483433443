import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const TRANSLATIONS = {
  ar: {
    // Brand & Navigation
    brandName: 'أمل الجزائر',
    brandTag: 'تكافل وطني',
    brandSubtitle: 'منصة التنسيق المباشر بين الجمعيات والمحسنين',
    home: 'الرئيسية',
    myRequests: 'طلبات منظمتي',
    browseNeeds: 'تصفح الطلبات',
    openNeeds: 'الاحتياجات المفتوحة',
    myCommitments: 'التزاماتي بالمساعدة',
    postNeed: 'نشر طلب مساعدة',
    logIn: 'تسجيل الدخول',
    registerOrg: 'تسجيل جمعية/منظمة',
    logOut: 'تسجيل الخروج',
    myAccount: 'حسابي',
    charityOrg: 'جمعية خيرية',
    donorOrg: 'محسن متبرع',
    dashboard: 'لوحة القيادة',
    myDashboard: 'لوحتي',
    howItWorksNav: 'كيف تعمل المنصة؟',

    // Landing Page
    heroBadge: 'المنصة الوطنية المباشرة للتكافل الخيري بالجزائر 🇩🇿',
    heroTitle: 'نربط الجمعيات الخيرية بالمحسنين مباشرة',
    heroTitleSub: 'دون وسيط مالي • تسليم يداً بيد',
    heroSubtitle: 'الجمعيات المعتمدة تنشر احتياجاتها الواقعية (طرود غذائية، ملابس، أدوية)، والمتبرعون يتكفلون بها مباشرة مع التواصل الهاتفي الفوري للتسليم.',
    
    // Path 1 (Recipient)
    iAmCharity: 'أنا جمعية أو مبادرة خيرية',
    charityPathDesc: 'لديكم عائلات معوزة أو أيتام بحاجة إلى مؤونة أو ألبسة أو أدوية؟ انشروا طلب المساعدة ليظهر فوراً للمحسنين في ولايتكم.',
    publishNeedsCTA: 'أنشر احتياجاتك للمحسنين',

    // Path 2 (Donor)
    iAmDonor: 'أنا محسن / أريد تقديم مساعدة',
    donorPathDesc: 'تريد التكفل بطرود غذائية، أدوية، أو ملابس شتوية؟ انضم إلى المنصة وتصفح جميع الطلبات الحية عبر 58 ولاية وتكفل بما يناسب مقدرتك.',
    browseAndPledgeCTA: 'تسجيل وتصفح الطلبات',

    // How It Works
    howItWorksBadge: 'آلية العمل والتنسيق المباشر',
    howItWorksTitle: 'كيف تتم عملية التكفل والمساعدة في 3 خطوات؟',
    step1Title: '1. الجمعية تنشر الاحتياج',
    step1Desc: 'تحدد الجمعية نوع المساعدة (قفة، دواء، ملابس)، والكمية المطلوبة، والولاية، ورقم هاتف المسؤول.',
    step2Title: '2. المحسن يتكفل بالطلب',
    step2Desc: 'يسجل المتبرع دخوله، يتصفح الطلبات الحية، ويؤكد التزامه بتوفير المساعدة مع تحديد الكمية وموعد التسليم.',
    step3Title: '3. التواصل الهاتفي والتسليم',
    step3Desc: 'يتواصل الطرفان هاتفياً لتحديد نقطة الاستلام والتسليم يداً بيد على أرض الواقع بكل شفافية.',

    // Categories
    categoriesTitle: 'فئات المساعدات المدعومة',
    catAll: 'جميع الاحتياجات',
    catFood: 'مواد غذائية ومؤونة',
    catClothing: 'ألبسة وأغطية',
    catMedical: 'أدوية ومستلزمات طبية',
    catShelter: 'مأوى وسكن مؤقت',
    catOther: 'عام / احتياجات أخرى',

    // Call To Action Donor Lock
    donorPortalCardTitle: 'بوابة المحسنين والمتبرعين',
    donorPortalCardDesc: 'لضمان الجدية والأمان، يتطلب استعراض تفاصيل الطلبات الحية والتكفل بها تسجيل الدخول بحساب Google.',
    donorPortalBenefit1: 'تصفح كافة احتياجات العائلات والأيتام في 58 ولاية',
    donorPortalBenefit2: 'اتصال هاتفي مباشر مع مسؤولي الجمعيات',
    donorPortalBenefit3: 'تأكيد التزامك ومتابعة تسليم المساعدات',
    loginToViewNeeds: 'تسجيل الدخول لاستعراض الطلبات',
    registerAsCharityCTA: 'تسجيل كجمعية خيرية',

    // Urgency
    urgencyHigh: 'حالة عاجلة',
    urgencyMedium: 'خلال أيام',
    urgencyLow: 'مستمر',
    urgencyLabel: 'درجة الاستعجال',

    // Donor Dashboard
    donorDashBadge: 'لوحة المحسن والمتبرع',
    donorDashTitle: 'قائمة الاحتياجات والطلبات المفتوحة',
    donorDashSubtitle: 'استعرض احتياجات الجمعيات وتكفل بما يناسبك للتواصل معهم مباشرة',
    tabAllNeeds: 'جميع الاحتياجات المفتوحة',
    tabMyCommitments: 'التزاماتي بالمساعدة',
    tabAllCommitments: 'جميع الالتزامات',
    tabInProgress: 'قيد التكفل',
    tabFulfilled: 'مكتملة',
    totalCommitments: 'إجمالي الالتزامات',
    activeCommitments: 'قيد التكفل والتنسيق',
    fulfilledCommitments: 'تمت تلبية الاحتياج',
    availableNeedsCount: 'طلب متاح للمساعدة',
    searchPlaceholder: 'ابحث باسم الجمعية، الولاية، أو نوع المساعدة...',
    filterWilaya: 'جميع الولايات (58 ولاية)',
    filterCategory: 'جميع فئات المساعدات',
    filterUrgency: 'درجة الاستعجال (الكل)',
    resetFilters: 'إعادة ضبط الفلاتر',
    gridView: 'عرض القائمة',
    mapView: 'الخريطة التفاعلية',
    noNeedsFound: 'لا توجد طلبات تطابق هذا البحث',
    noNeedsFoundSub: 'جرب اختيار ولاية أخرى أو فئة مختلفة',
    noCommitmentsYet: 'لم تلتزم بأي طلب مساعدة بعد',
    noCommitmentsYetSub: 'تصفح قائمة الاحتياجات المفتوحة واختر ما يناسب مقدرتك للتكفل به ومساعدة الجمعيات.',
    browseOpenNeedsBtn: 'تصفح الاحتياجات المفتوحة',

    // Recipient Dashboard
    recipientDashBadge: 'لوحة قيادة الجمعية',
    addNewNeedBtn: 'إضافة طلب مساعدة جديد',
    totalPostedRequests: 'إجمالي الطلبات',
    openRequestsCount: 'مفتوحة للمساعدة',
    inProgressRequestsCount: 'قيد التكفل',
    fulfilledRequestsCount: 'مكتملة',
    allRequestsTab: 'جميع الطلبات',
    openRequestsTab: 'مفتوحة',
    inProgressRequestsTab: 'قيد التكفل',
    fulfilledRequestsTab: 'مكتملة',
    noRequestsInList: 'لا توجد طلبات في هذه القائمة حالياً',
    postFirstNeedCTA: 'إضافة أول طلب مساعدة',
    committedDonorInfo: 'معلومات المتبرع المتكفل:',
    committedBadge: 'ملتزم بالتكفل',
    donorNameLabel: 'اسم المتبرع / الجهة:',
    donorPhoneLabel: 'رقم هاتف المتبرع:',
    pledgedQtyLabel: 'الكمية المتعهد بها:',
    deliveryDateLabel: 'موعد التسليم المقترح:',
    donorNotesLabel: 'ملاحظات إضافية للتنسيق:',
    callDonorBtn: 'اتصال بالمتبرع',
    callNow: 'اتصال هاتفي',
    copyPhoneBtn: 'نسخ الرقم',
    copiedPhone: 'تم النسخ!',
    markFulfilledBtn: 'تعليم كمكتمل',
    reopenRequestBtn: 'إعادة فتح',
    editRequestBtn: 'تعديل الطلب',
    deleteRequestBtn: 'حذف الطلب',
    confirmFulfillTitle: 'تعليم الطلب كمكتمل؟',
    confirmFulfillMsg: 'هل تم استلام المساعدات وتلبية هذا الاحتياج بالفعل من المتبرع؟',
    confirmReopenTitle: 'إعادة فتح الطلب؟',
    confirmReopenMsg: 'سيتم إعادة عرض هذا الطلب في قائمة الاحتياجات المفتوحة للمتبرعين.',
    confirmDeleteTitle: 'حذف طلب المساعدة',
    confirmDeleteMsg: 'هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟ لن يمكن التراجع عن هذه الخطوة.',
    cancelBtn: 'إلغاء',
    confirmBtn: 'تأكيد',

    // Card Actions & Badges
    viewAndPledge: 'استعراض والتكفل',
    quantityNeeded: 'الكمية المطلوبة:',
    statusOpen: 'مفتوح للمساعدة',
    statusInProgress: 'قيد التكفل',
    statusFulfilled: 'مكتمل',
    cancelCommitmentLink: 'إلغاء التكفل بهذا الطلب',
    confirmCancelCommitment: 'هل أنت متأكد من رغبتك في إلغاء التزامك بهذه المساعدة؟',
    commitmentCancelledSuccess: 'تم إلغاء التكفل بنجاح.',

    // Request Detail Modal & Full/Partial Pledging
    requestDetailTitle: 'تفاصيل طلب المساعدة',
    charityContactSection: 'معلومات الجمعية للتواصل المباشر',
    charityPhoneLabel: 'رقم هاتف الجمعية المباشر:',
    directCallTip: 'يمكنك الاتصال مباشرة للاستفسار والسؤال عن تفاصيل المساعدة:',
    dropoffLocationTitle: 'موقع الاستلام والتسليم:',
    detailsOfNeedTitle: 'تفاصيل الاحتياج المطلوب:',
    pledgeSectionHeader: 'التكفل بهذه المساعدة (قبول المهمة)',
    pledgeSectionExpl: 'إذا قررت توفير هذه المساعدة، يمكنك اختيار التكفل بالطلب كاملاً أو التكفل بجزء منه وتحديد ما تبقى للمحسنين الآخرين.',
    commitmentTypeLabel: 'مدى التكفل بالطلب *',
    fullCommitmentOption: 'تكفل كامل (تغطية الطلب كلياً)',
    fullCommitmentDesc: 'سيتم إخفاء هذا الطلب من قائمة المحسنين والتكفل به بالكامل من طرفكم.',
    partialCommitmentOption: 'تكفل جزئي (تغطية جزء من الاحتياج)',
    partialCommitmentDesc: 'سيبقى الطلب متاحاً للمحسنين الآخرين لتغطية ما تبقى من الاحتياج.',
    remainingQtyLabel: 'الكمية المتبقية المطلوبة للمحسنين الآخرين *',
    remainingQtyPlaceholder: 'مثال: متبقي 30 قفة غذائية / 10 بطانيات',
    partialAidBadge: 'تكفل جزئي',
    remainingNeededTag: 'المتبقي المطلوب:',
    fullCoverageBadge: 'تغطية كاملة',
    confirmPledgeActionBtn: 'أؤكد التزامي بتقديم هذه المساعدة',
    pledgeFormQtyPlaceholder: 'مثال: سأوفر 30 طرد غذائي / 15 بطانية',
    pledgeFormDatePlaceholder: 'مثال: يوم السبت القادم بعد الزوال',
    pledgeFormNotesPlaceholder: 'مثال: سنقوم بنقل المساعدات بسيارتنا إلى مقر الجمعية',
    submitPledgeBtn: 'تأكيد التكفل الآن',
    backBtn: 'تراجع',
    closeModalBtn: 'إغلاق النافذة',
    pledgeSuccessTitle: 'تم تسجيل التزامك بنجاح!',
    pledgeSuccessMsg: 'شكراً لك! يرجى الاتصال بالجمعية هاتفياً لتنسيق موعد ومكان تسليم المساعدات.',
    alreadyPledgedBadge: 'أنت ملتزم رسمياً بتقديم هذه المساعدة',
    alreadyPledgedMsg: 'تم إشعار الجمعية بالتزامك. يرجى التواصل معهم هاتفياً للتنسيق والتسليم.',
    fulfilledNotice: 'تم تلبية هذا الاحتياج بالكامل. شكراً لجميع المحسنين.',

    // Post Request Modal
    postModalTitleNew: 'نشر احتياج مساعدة جديد',
    postModalTitleEdit: 'تعديل طلب المساعدة',
    needDescLabel: 'تفاصيل الاحتياج المطلوب بدقة *',
    needDescPlaceholder: 'اكتب هنا ما تحتاجه الجمعية... مثال: نحتاج 30 طرد غذائي يحتوي على زيت، سكر ودقيق.',
    aidCategoryLabel: 'نوع المساعدة *',
    urgencyLevelLabel: 'درجة الاستعجال *',
    quantityOptionalLabel: 'الكمية المطلوبة (اختياري)',
    quantityOptionalPlaceholder: 'مثال: 50 طرد / 20 بطانية / 10 علب دواء',
    wilayaLabel: 'الولاية *',
    contactPhoneLabel: 'رقم الهاتف للتواصل *',
    addressNeighborhoodLabel: 'العنوان أو الحي',
    addressPlaceholder: 'مثال: شارع ديدوش مراد، القبة، الجزائر',
    saveAndPublishBtn: 'نشر الطلب الآن',
    saveUpdateBtn: 'تحديث الطلب',
    savingBtn: 'جاري الحفظ...',

    // Auth Pages
    loginHeaderTitle: 'تسجيل الدخول إلى المنصة',
    loginHeaderSubtitle: 'شبكة التكافل الخيري والإنساني في الجزائر لربط الجمعيات بالمتبرعين مباشرة',
    signupHeaderTitle: 'إنشاء حساب في المنصة',
    signupHeaderSubtitle: 'انضم إلى شبكة الجمعيات والمتبرعين في الجزائر عبر حساب Google الخاص بك',
    googleContinueBtn: 'المتابعة عبر حساب Google',
    googleSignInBtn: 'الدخول عبر حساب Google',
    connectingGoogle: 'جاري الاتصال...',
    googleAuthVerifiedNote: 'يتم التحقق من الحساب تلقائياً وبأمان عبر Google.',
    nextStepRoleNote: 'ستحدد نوع حسابك (جمعية أو متبرع) في الخطوة التالية مباشرة.',

    // Complete Profile Page
    completeProfileTitle: 'إكمال معلومات الحساب',
    completeProfileSubtitle: 'أدخل معلومات التواصل لتتمكن من إضافة أو تقديم المساعدات',
    verifiedGoogleEmail: 'حساب Google المعتمد:',
    activityTypeLabel: 'نوع النشاط في المنصة *',
    roleRecipientTitle: 'جمعية محتاجة',
    roleRecipientSubtitle: 'طلب مؤونة وإعانات',
    roleDonorTitle: 'جهة متبرعة',
    roleDonorSubtitle: 'تقديم المساعدات والتكفل',
    orgOrDonorNameLabel: 'اسم الجمعية أو المتبرع *',
    orgOrDonorNamePlaceholder: 'مثال: جمعية الإحسان الخيرية أو فاعل خير',
    saveAndEnterBtn: 'حفظ وإكمال الدخول',

    // Location Picker
    useGPSBtn: 'تحديد موقعي الحالي تلقائياً (GPS)',
    searchAddressInAlgeria: 'البحث عن العنوان في الجزائر (مجاني)',
    clickMapToPinLocation: 'انقر على الخريطة لتحديد مكان الاستلام بدقة',
    locatingStatus: 'جاري تحديد موقعك...',
    locationSuccessStatus: 'تم تحديد الموقع بنجاح!',
    locationErrorStatus: 'تعذر تحديد الموقع تلقائياً، يرجى كتابته يدويًا أو النقر على الخريطة.',

    // Footer
    footerDescription: 'منصة وطنية مباشرة للتنسيق والتكافل الإنساني بين الجمعيات الخيرية والمحسنين عبر 58 ولاية جزائرية دون وسيط مالي.',
    footerNetworkBadge: 'شبكة العمل الخيري والتكافل الإنساني بالجزائر',
    footerAidCategories: 'فئات المساعدات',
    footerPlatformLinks: 'عن المنصة',
    footerCopyright: '© جميع الحقوق محفوظة لمنصة أمل الجزائر للتكافل الخيري.',
    footerHandcrafted: 'صنع بحب لدعم الجمعيات الخيرية والمبادرات الإنسانية في الجزائر.'
  },
  en: {
    // Brand & Navigation
    brandName: 'HopeLink Algeria',
    brandTag: 'National Relief',
    brandSubtitle: 'Direct Aid Coordination Platform for Charities & Donors',
    home: 'Home',
    myRequests: 'My Organization Requests',
    browseNeeds: 'Browse Requests',
    openNeeds: 'Open Needs',
    myCommitments: 'My Commitments',
    postNeed: 'Post Aid Request',
    logIn: 'Sign In',
    registerOrg: 'Register Organization',
    logOut: 'Sign Out',
    myAccount: 'My Account',
    charityOrg: 'Charity Organization',
    donorOrg: 'Donor / Contributor',
    dashboard: 'Dashboard',
    myDashboard: 'Dashboard',
    howItWorksNav: 'How It Works',

    // Landing Page
    heroBadge: 'Direct Humanitarian & Charity Matching in Algeria 🇩🇿',
    heroTitle: 'Directly Connecting Local Charities with Donors',
    heroTitleSub: 'Zero Financial Intermediary • Direct In-Person Handover',
    heroSubtitle: 'Verified charities publish real supplies needed (food packs, clothes, medicine), and donors fulfill them directly with instant phone coordination for delivery.',
    
    // Path 1 (Recipient)
    iAmCharity: 'We Are a Charity / Initiative',
    charityPathDesc: 'Do you support vulnerable families or orphans in need of food, clothing, or medicine? Post your request to immediately reach donors in your Wilaya.',
    publishNeedsCTA: 'Post Needs for Donors',

    // Path 2 (Donor)
    iAmDonor: 'I Want to Help / Donate',
    donorPathDesc: 'Want to provide food packs, medicines, or winter blankets? Sign in to browse all active needs across 58 Wilayas and commit to what fits your capacity.',
    browseAndPledgeCTA: 'Sign In & Browse Needs',

    // How It Works
    howItWorksBadge: 'Direct Coordination Workflow',
    howItWorksTitle: 'How HopeLink Works in 3 Simple Steps',
    step1Title: '1. Charity Posts a Real Need',
    step1Desc: 'The charity specifies the needed aid (food, medicine, clothing), required quantity, Wilaya, and coordinator phone number.',
    step2Title: '2. Donor Commits to Aid',
    step2Desc: 'The donor signs in, browses live requests, and confirms commitment to fulfill the need with quantity and estimated delivery date.',
    step3Title: '3. Direct Phone Call & Handover',
    step3Desc: 'Both parties coordinate via direct phone call to arrange the drop-off location and transparent in-person delivery.',

    // Categories
    categoriesTitle: 'Supported Aid Categories',
    catAll: 'All Needs',
    catFood: 'Food & Nutrition',
    catClothing: 'Clothing & Blankets',
    catMedical: 'Medicine & Medical Supplies',
    catShelter: 'Temporary Shelter & Bedding',
    catOther: 'General / Other Needs',

    // Call To Action Donor Lock
    donorPortalCardTitle: 'Donors & Contributors Portal',
    donorPortalCardDesc: 'To ensure reliability and security, exploring live charity requests and committing to aid requires signing in with a Google account.',
    donorPortalBenefit1: 'Browse all verified needs for families & orphans across 58 Wilayas',
    donorPortalBenefit2: 'Direct phone contact with charity coordinators',
    donorPortalBenefit3: 'Track your active commitments and coordinate direct drop-offs',
    loginToViewNeeds: 'Sign In to Browse Requests',
    registerAsCharityCTA: 'Register as Charity',

    // Urgency
    urgencyHigh: 'Urgent (Emergency)',
    urgencyMedium: 'Within Days',
    urgencyLow: 'Ongoing',
    urgencyLabel: 'Urgency Level',

    // Donor Dashboard
    donorDashBadge: 'Donor & Philanthropist Hub',
    donorDashTitle: 'Open Charity Needs & Requests',
    donorDashSubtitle: 'Explore active community needs and commit to fulfilling them with direct phone coordination',
    tabAllNeeds: 'All Open Needs',
    tabMyCommitments: 'My Commitments',
    tabAllCommitments: 'All Commitments',
    tabInProgress: 'In Progress',
    tabFulfilled: 'Fulfilled',
    totalCommitments: 'Total Commitments',
    activeCommitments: 'In Progress / Coordinating',
    fulfilledCommitments: 'Fulfilled Needs',
    availableNeedsCount: 'Requests Available for Aid',
    searchPlaceholder: 'Search by charity name, Wilaya, or item description...',
    filterWilaya: 'All Wilayas (58 Wilayas)',
    filterCategory: 'All Aid Categories',
    filterUrgency: 'Urgency (All)',
    resetFilters: 'Reset Filters',
    gridView: 'Grid View',
    mapView: 'Interactive Map',
    noNeedsFound: 'No requests match your current search',
    noNeedsFoundSub: 'Try choosing another Wilaya or a different aid category',
    noCommitmentsYet: 'You have not committed to any requests yet',
    noCommitmentsYetSub: 'Browse the open requests feed and pick what matches your capacity to support local charities.',
    browseOpenNeedsBtn: 'Browse Open Needs',

    // Recipient Dashboard
    recipientDashBadge: 'Charity Dashboard',
    addNewNeedBtn: 'Post New Aid Request',
    totalPostedRequests: 'Total Requests',
    openRequestsCount: 'Open for Aid',
    inProgressRequestsCount: 'In Progress',
    fulfilledRequestsCount: 'Fulfilled',
    allRequestsTab: 'All Requests',
    openRequestsTab: 'Open',
    inProgressRequestsTab: 'In Progress',
    fulfilledRequestsTab: 'Fulfilled',
    noRequestsInList: 'No requests in this list currently',
    postFirstNeedCTA: 'Post Your First Need',
    committedDonorInfo: 'Committed Donor Details:',
    committedBadge: 'Committed to Help',
    donorNameLabel: 'Donor / Org Name:',
    donorPhoneLabel: 'Donor Phone Number:',
    pledgedQtyLabel: 'Pledged Quantity:',
    deliveryDateLabel: 'Proposed Delivery Date:',
    donorNotesLabel: 'Additional Coordination Notes:',
    callDonorBtn: 'Call Donor',
    callNow: 'Direct Phone Call',
    copyPhoneBtn: 'Copy Phone',
    copiedPhone: 'Copied!',
    markFulfilledBtn: 'Mark as Fulfilled',
    reopenRequestBtn: 'Re-open',
    editRequestBtn: 'Edit Request',
    deleteRequestBtn: 'Delete Request',
    confirmFulfillTitle: 'Mark Request as Fulfilled?',
    confirmFulfillMsg: 'Has the aid been physically delivered and received from the donor?',
    confirmReopenTitle: 'Re-open Request?',
    confirmReopenMsg: 'This request will become visible again in the open needs feed for donors.',
    confirmDeleteTitle: 'Delete Aid Request',
    confirmDeleteMsg: 'Are you sure you want to permanently delete this request? This action cannot be undone.',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',

    // Card Actions & Badges
    viewAndPledge: 'View & Commit',
    quantityNeeded: 'Quantity Needed:',
    statusOpen: 'Open for Donors',
    statusInProgress: 'In Progress',
    statusFulfilled: 'Fulfilled',
    cancelCommitmentLink: 'Cancel My Commitment for this Request',
    confirmCancelCommitment: 'Are you sure you want to cancel your commitment to this aid request?',
    commitmentCancelledSuccess: 'Commitment cancelled successfully.',

    // Request Detail Modal & Full/Partial Pledging
    requestDetailTitle: 'Aid Request Details',
    charityContactSection: 'Charity Direct Contact Details',
    charityPhoneLabel: 'Charity Coordinator Phone:',
    directCallTip: 'You can call the charity directly to inquire before making your commitment:',
    dropoffLocationTitle: 'Drop-off & Delivery Location:',
    detailsOfNeedTitle: 'Details of Needed Supplies:',
    pledgeSectionHeader: 'Commit to this Aid Request (Accept Mission)',
    pledgeSectionExpl: 'Choose whether you want to cover the entire mission (ALL) or provide a partial contribution and state the remaining amount needed.',
    commitmentTypeLabel: 'Commitment Scope *',
    fullCommitmentOption: 'Full Commitment (Cover entire need)',
    fullCommitmentDesc: 'This request will be fully assigned to you and removed from the open feed for other donors.',
    partialCommitmentOption: 'Partial Commitment (Cover part of need)',
    partialCommitmentDesc: 'The request will remain open in the feed so other donors can contribute the remaining quantity.',
    remainingQtyLabel: 'Remaining Quantity Needed from Other Donors *',
    remainingQtyPlaceholder: 'e.g. Remaining: 30 food packs / 10 blankets',
    partialAidBadge: 'Partial Aid',
    remainingNeededTag: 'Remaining Needed:',
    fullCoverageBadge: 'Full Coverage',
    confirmPledgeActionBtn: 'I Commit to Fulfilling this Request',
    pledgeFormQtyPlaceholder: 'e.g. We will provide 30 full food packs / 15 blankets',
    pledgeFormDatePlaceholder: 'e.g. Next Saturday afternoon',
    pledgeFormNotesPlaceholder: 'e.g. We will deliver the supplies in our van directly to the charity center',
    submitPledgeBtn: 'Confirm Commitment Now',
    backBtn: 'Back',
    closeModalBtn: 'Close Window',
    pledgeSuccessTitle: 'Commitment Confirmed!',
    pledgeSuccessMsg: 'Thank you! Please call the charity coordinator to arrange the exact delivery time and location.',
    alreadyPledgedBadge: 'You are officially committed to this aid request',
    alreadyPledgedMsg: 'The charity has been notified. Please contact them by phone to coordinate delivery.',
    fulfilledNotice: 'This request has been completely fulfilled. Thank you to all donors.',

    // Post Request Modal
    postModalTitleNew: 'Post New Aid Request',
    postModalTitleEdit: 'Edit Aid Request',
    needDescLabel: 'Detailed Description of Needed Supplies *',
    needDescPlaceholder: 'Describe exact supplies needed... e.g. 30 food parcels containing oil, flour, sugar for vulnerable families before winter.',
    aidCategoryLabel: 'Aid Category *',
    urgencyLevelLabel: 'Urgency Level *',
    quantityOptionalLabel: 'Quantity / Scope (Optional)',
    quantityOptionalPlaceholder: 'e.g. 50 food packs / 20 blankets / 10 medicine boxes',
    wilayaLabel: 'Wilaya *',
    contactPhoneLabel: 'Contact Phone Number *',
    addressNeighborhoodLabel: 'Street Address or Neighborhood',
    addressPlaceholder: 'e.g. Didouche Mourad Street, Kouba, Algiers',
    saveAndPublishBtn: 'Publish Request Now',
    saveUpdateBtn: 'Update Request',
    savingBtn: 'Saving...',

    // Auth Pages
    loginHeaderTitle: 'Sign In to HopeLink',
    loginHeaderSubtitle: 'Humanitarian and charity matching network connecting local Algerian charities directly with donors',
    signupHeaderTitle: 'Create Account on HopeLink',
    signupHeaderSubtitle: 'Join the network of verified charities and donors across Algeria using your Google account',
    googleContinueBtn: 'Continue with Google Account',
    googleSignInBtn: 'Sign In with Google Account',
    connectingGoogle: 'Connecting...',
    googleAuthVerifiedNote: 'Accounts are securely and automatically verified via Google.',
    nextStepRoleNote: 'You will choose your role (Charity or Donor) in the very next step.',

    // Complete Profile Page
    completeProfileTitle: 'Complete Account Details',
    completeProfileSubtitle: 'Please provide your organization or donor contact details to coordinate aid',
    verifiedGoogleEmail: 'Verified Google Account:',
    activityTypeLabel: 'Activity Role on Platform *',
    roleRecipientTitle: 'Recipient Charity',
    roleRecipientSubtitle: 'Request food, clothing, medical relief',
    roleDonorTitle: 'Donor / Contributor',
    roleDonorSubtitle: 'Provide supplies and sponsor needs',
    orgOrDonorNameLabel: 'Charity or Donor Name *',
    orgOrDonorNamePlaceholder: 'e.g. El Ihssan Charity Association or Contributor Name',
    saveAndEnterBtn: 'Save & Enter Platform',

    // Location Picker
    useGPSBtn: 'Detect My Location (GPS)',
    searchAddressInAlgeria: 'Search Address in Algeria (Free)',
    clickMapToPinLocation: 'Click on map to pin drop-off location',
    locatingStatus: 'Detecting GPS location...',
    locationSuccessStatus: 'GPS location detected successfully!',
    locationErrorStatus: 'Could not auto-detect location. Please enter manually or click on the map.',

    // Footer
    footerDescription: 'A direct national platform for humanitarian coordination between charitable organizations and donors across 58 Algerian Wilayas with zero financial intermediary.',
    footerNetworkBadge: 'Humanitarian & Charity Relief Network in Algeria',
    footerAidCategories: 'Aid Categories',
    footerPlatformLinks: 'About HopeLink',
    footerCopyright: '© All rights reserved. HopeLink Algeria Charity Matching Platform.',
    footerHandcrafted: 'Handcrafted with care to support charitable initiatives across Algeria.'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('hopelink_lang') || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('hopelink_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
