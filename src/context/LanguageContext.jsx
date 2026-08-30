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
    brandSubtitle: 'منصة التكافل والمساعدات الإنسانية',
    home: 'الرئيسية',
    myRequests: 'طلبات منظمتي',
    browseNeeds: 'تصفح الاحتياجات الحالية',
    myCommitments: 'التزاماتي بالمساعدة',
    postNeed: 'إضافة طلب مساعدة',
    logIn: 'تسجيل الدخول',
    registerOrg: 'تسجيل جمعية/منظمة',
    logOut: 'خروج',
    demoMode: 'وضع المعاينة التجريبي',
    quickTestLogin: 'دخول سريع للتجربة:',
    asRecipient: 'كجمعية محتاجة',
    asDonor: 'كجهة متبرعة',
    roleRecipient: 'جمعية محتاجة للمساعدة',
    roleDonor: 'جهة متبرعة/محسنة',

    // Google Auth Exclusive Flow
    googleAuthNotice: 'يتم تسجيل الحساب وتسجيل الدخول حصرياً عبر حساب Google لضمان الموثوقية والأمان.',
    continueWithGoogle: 'المتابعة بحساب Google',
    googleSignInBtn: 'تسجيل الدخول عبر حساب Google',
    googleSignUpBtn: 'التسجيل والمتابعة عبر حساب Google',
    chooseAccountRole: 'اختر نوع الحساب للمتابعة *',

    // Complete Profile Page
    completeProfileTitle: 'إكمال بيانات الحساب والمنظمة',
    completeProfileSubtitle: 'يرجى إدخال معلومات جمعيتك أو هويتك كجهة متبرعة للتواصل والتنسيق',
    accountTypeLabel: 'نوع الحساب في المنصة *',
    completeProfileBtn: 'حفظ وإكمال التسجيل',
    savingProfile: 'جاري الحفظ...',
    signedInAsGoogle: 'تم التحقق من حساب Google:',

    // Landing Page
    heroBadge: 'تنسيق العمل الخيري والإنساني في الجزائر',
    heroTitle: 'ربط الجمعيات المحلية بالمتبرعين والمحسنين مباشرة',
    heroSubtitle: 'منصة مجانية ومباشرة لربط الجمعيات والمبادرات الإنسانية في الجزائر التي تحتاج مواد غذائية، ألبسة، مستلزمات طبية، أو مأوى بالجهات والمتبرعين الجاهزين للمساعدة.',
    iNeedHelpCTA: 'نحن جمعية ونحتاج مساعدة',
    iWantToHelpCTA: 'نريد تقديم مساعدة وتبرعات',
    alreadyAccount: 'لديك حساب بالفعل؟',
    howItWorksTitle: 'كيف تعمل المنصة؟',
    howItWorksSub: 'تنسيق شفاف ومباشر للتكافل الإنساني في جميع الولايات الجزائرية',
    step1Title: '1. نشر احتياج حقيقي',
    step1Desc: 'تقوم الجمعية المحلية بتحديد المساعدات المطلوبة بدقة (طعام، ألبسة، دواء، مأوى)، الكمية، ومكان التسليم.',
    step2Title: '2. استعراض الاحتياجات والخريطة',
    step2Desc: 'يتصفح المتبرعون قائمة الاحتياجات المفتوحة حسب الولاية، الفئة، درجة الاستعجال، أو خريطة الولايات.',
    step3Title: '3. الاستفسار وقبول المهمة',
    step3Desc: 'يمكن للمتبرع الاتصال للاستفسار، أو تأكيد التزامه الرسمي بتوفير المساعدة مع تحديد الكمية وموعد التسليم.',
    supportedCategories: 'فئات المساعدات المدعومة',

    // Signup & Login Pages
    signupTitle: 'إنشاء حساب عبر Google',
    signupSubtitle: 'انضم إلى شبكة التكافل الخيري في الجزائر لطلب أو تقديم المساعدات',
    selectRoleTitle: 'ما هو هدفك في المنصة؟ *',
    roleNeedHelpSub: 'طلب مؤونة، ألبسة، أو مستلزمات للمحتاجين',
    roleWantHelpSub: 'التكفل بالاحتياجات وتوفير المساعدات',
    orgNameLabel: 'اسم الجمعية / المنظمة / المتبرع *',
    orgNamePlaceholder: 'مثال: جمعية الكافل الخيرية أو فاعل خير',
    phoneLabel: 'رقم الهاتف للتواصل *',
    phonePlaceholder: '0550 12 34 56',
    cityLabel: 'الولاية / المدينة *',
    cityPlaceholder: 'الجزائر العاصمة',
    alreadyRegistered: 'لديك حساب مسجل بالفعل؟',
    loginTitle: 'تسجيل الدخول',
    loginSubtitle: 'أهلاً بك مجدداً في منصة أمل الجزائر',
    instantDemoTitle: 'معاينة تجريبية فورية بدون حساب',
    instantDemoDesc: 'انقر لتجربة لوحة التحكم مباشرة:',
    demoRecipientBtn: 'تجربة كجمعية محتاجة',
    demoDonorBtn: 'تجربة كجهة متبرعة',
    dontHaveAccount: 'ليس لديك حساب بعد؟',

    // Categories
    catFood: 'مواد غذائية ومؤونة',
    catClothing: 'ألبسة وأغطية',
    catMedical: 'مستلزمات طبية وأدوية',
    catShelter: 'مأوى وسكن مؤقت',
    catOther: 'عام / احتياجات أخرى',

    // Urgency
    urgencyHigh: 'عاجل جداً (حالة طارئة)',
    urgencyMedium: 'متوسط (خلال أيام)',
    urgencyLow: 'عادي (احتياج مستمر)',
    urgencyLabel: 'درجة الاستعجال',

    // Forms & Inputs
    needDescLabel: 'تفاصيل الاحتياج المطلوب بالضبط *',
    needDescPlaceholder: 'اكتب هنا ما تحتاجه الجمعية بدقة... مثال: نحتاج 30 طرد غذائي يحتوي على زيت، سكر، ودقيق لعائلات معوزة قبل الشتاء.',
    quantityLabel: 'الكمية المطلوب توفيرها (اختياري)',
    quantityPlaceholder: 'مثال: 50 طرد / 20 بطانية / 15 علبة دواء',
    addressLabel: 'العنوان الكامل لاستلام المساعدات',
    addressPlaceholder: 'مثال: شارع ديدوش مراد، القبة، الجزائر العاصمة',

    // Location Picker & Map
    useGPS: 'تحديد موقعي الحالي تلقائياً (GPS)',
    searchAddressOSM: 'البحث عن العنوان في الجزائر (مجاني)',
    clickMapToPick: 'انقر على الخريطة لتحديد مكان الاستلام بدقة',
    locating: 'جاري تحديد موقعك...',
    locationFound: 'تم تحديد الموقع بنجاح!',
    locationError: 'تعذر تحديد الموقع تلقائياً، يرجى كتابته يدويًا أو النقر على الخريطة.',

    // Dashboards
    recipientDashTitle: 'لوحة قيادة الجمعية',
    donorDashTitle: 'قائمة الاحتياجات المفتوحة للمساعدات',
    totalPosted: 'إجمالي الطلبات',
    activeNeeds: 'طلبات جارية',
    fulfilledNeeds: 'طلبات مكتملة',
    allRequests: 'جميع الطلبات',
    openRequests: 'مفتوحة للتبرع',
    inProgressRequests: 'قيد التكفل والتنسيق',
    fulfilledRequests: 'تم تلبيتها',
    postFirstNeed: 'إضافة أول طلب مساعدة',
    noRequestsFound: 'لا توجد طلبات في هذه القائمة حالياً',
    filterByCity: 'تصفية حسب الولاية',
    allCities: 'جميع الولايات',
    filterByCategory: 'تصفية حسب نوع المساعدة',
    filterByUrgency: 'تصفية حسب درجة الاستعجال',
    searchPlaceholder: 'ابحث باسم الجمعية، الولاية، العنوان، أو نوع المساعدة...',
    resetFilters: 'إعادة ضبط الفلاتر',
    gridView: 'عرض بطاقات',
    mapView: 'خريطة تفاعلية',

    // Contact & Two-step Acceptance Modal
    orgContactInfo: 'معلومات الاتصال بالجمعية',
    directCallNotice: 'يمكنك الاتصال مباشرة للاستفسار والسؤال عن تفاصيل المساعدة:',
    callNow: 'اتصال هاتفي مباشر',
    copyPhone: 'نسخ الرقم',
    copied: 'تم النسخ!',
    closeWindow: 'إغلاق النافذة',
    quantityNeeded: 'الكمية المطلوبة:',
    markFulfilled: 'تعليم كـ مكتمل',
    reopenNeed: 'إعادة فتح الطلب',
    editRequest: 'تعديل الطلب',
    donorsReachedOut: 'جهة التزمت بالمساعدة',
    viewContacts: 'عرض المتكفلين بالمساعدة',
    hideDetails: 'إخفاء التفاصيل',

    // Mission Acceptance & Commitment Form
    pledgeSectionTitle: 'التكفل بهذه المساعدة (قبول المهمة)',
    pledgeSectionDesc: 'إذا قررت توفير هذه المساعدة، يمكنك تأكيد التزامك الرسمي ليتم التنسيق معك وإشعار الجمعية.',
    acceptMissionBtn: 'أؤكد التزامي بتقديم هذه المساعدة',
    youAreCommittedBadge: 'أنت ملتزم رسمياً بتقديم هذه المساعدة',
    committedDetails: 'تفاصيل التزامك المسجلة:',
    pledgedQtyLabel: 'الكمية التي ستوفرها (اختياري)',
    pledgedQtyPlaceholder: 'مثال: سأوفر 30 طرد غذائي بالكامل / 15 بطانية',
    deliveryDateLabel: 'الموعد المتوقع للتوصيل أو التسليم (اختياري)',
    deliveryDatePlaceholder: 'مثال: يوم السبت القادم بعد الزوال',
    donorNotesLabel: 'ملاحظات إضافية للتنسيق (اختياري)',
    donorNotesPlaceholder: 'مثال: سنقوم بنقل المساعدات بسيارتنا إلى مقر الجمعية',
    confirmCommitmentBtn: 'تأكيد التكفل بالمهمة الآن',
    cancelCommitmentBtn: 'إلغاء التزامي',
    cancelling: 'جاري الإلغاء...',
    commitmentSuccessTitle: 'تم تسجيل التزامك بنجاح!',
    commitmentSuccessMsg: 'شكراً لك! يرجى الاتصال بالجمعية هاتفياً لتنسيق موعد ومكان تسليم المساعدات.',

    // Status Badges
    statusOpen: 'مفتوح للتبرع',
    statusInProgress: 'قيد التكفل والتوصيل',
    statusFulfilled: 'تمت التلبية بنجاح',

    // Footer
    footerDesc: 'منصة مستقلة ومباشرة لربط الجمعيات الخيرية والمبادرات الإنسانية في جميع الولايات الجزائرية مع المتبرعين والمحسنين.',
    verifiedNetwork: 'شبكة العمل الخيري والتكافل الإنساني بالجزائر',
    categoriesHeader: 'فئات المساعدات',
    platformHeader: 'عن المنصة',
    copyright: '© جميع الحقوق محفوظة لمنصة أمل الجزائر للتكافل الخيري.',
    madeWithLove: 'صنع بحب لدعم الجمعيات الخيرية والمبادرات الإنسانية في الجزائر.',
    
    // 404
    pageNotFound: 'الصفحة غير موجودة',
    pageNotFoundDesc: 'الصفحة التي تحاول الوصول إليها غير متوفرة حالياً.',
    returnHome: 'العودة للصفحة الرئيسية'
  },
  en: {
    // Brand & Navigation
    brandName: 'HopeLink Algeria',
    brandSubtitle: 'Charity Needs & Donation Matching Platform',
    home: 'Home',
    myRequests: 'My Organization Requests',
    browseNeeds: 'Browse Open Needs',
    myCommitments: 'My Commitments',
    postNeed: 'Post Assistance Need',
    logIn: 'Log In',
    registerOrg: 'Register Organization',
    logOut: 'Log Out',
    demoMode: 'Demo Preview Mode',
    quickTestLogin: 'Quick Test Login:',
    asRecipient: 'As Recipient',
    asDonor: 'As Donor',
    roleRecipient: 'Recipient Organization (Need Help)',
    roleDonor: 'Donor Organization (Want to Give)',

    // Google Auth Exclusive Flow
    googleAuthNotice: 'Accounts and sign-ins are exclusively verified via Google Account for security and trust.',
    continueWithGoogle: 'Continue with Google Account',
    googleSignInBtn: 'Sign In with Google Account',
    googleSignUpBtn: 'Sign Up with Google Account',
    chooseAccountRole: 'Select account role to continue *',

    // Complete Profile Page
    completeProfileTitle: 'Complete Organization Details',
    completeProfileSubtitle: 'Please provide your organization or donor contact details to coordinate aid.',
    accountTypeLabel: 'Account Role on Platform *',
    completeProfileBtn: 'Save & Complete Setup',
    savingProfile: 'Saving...',
    signedInAsGoogle: 'Verified Google Account:',

    // Landing Page
    heroBadge: 'Humanitarian & Charity Matching in Algeria',
    heroTitle: 'Directly Connecting Local Charities with Donors',
    heroSubtitle: 'A free, direct platform connecting Algerian recipient charities in need of food, clothing, medical supplies, or shelter with generous donors ready to help.',
    iNeedHelpCTA: 'We Need Assistance (Recipient)',
    iWantToHelpCTA: 'We Want to Give (Donor)',
    alreadyAccount: 'Already have an account?',
    howItWorksTitle: 'How HopeLink Works',
    howItWorksSub: 'Direct, transparent coordination across Algerian Wilayas',
    step1Title: '1. Post Real Needs',
    step1Desc: 'Local charities post exact supplies required (food, clothes, medicine, shelter), scope, and drop-off address.',
    step2Title: '2. Browse & Map Search',
    step2Desc: 'Donors filter open requests by Algerian Wilaya, category, urgency level, or interactive map pins.',
    step3Title: '3. Inquire & Commit to Aid',
    step3Desc: 'Donors can call to ask details or officially accept and commit to fulfilling the mission with delivery info.',
    supportedCategories: 'Supported Aid Categories',

    // Signup & Login Pages
    signupTitle: 'Create Account with Google',
    signupSubtitle: 'Join Algeria charity network to request or provide vital relief aid.',
    selectRoleTitle: 'What is your goal on the platform? *',
    roleNeedHelpSub: 'Request food, clothing, medical aid or shelter',
    roleWantHelpSub: 'Sponsor and provide relief supplies to charities',
    orgNameLabel: 'Organization / Donor Name *',
    orgNamePlaceholder: 'e.g. Al Kafel Charity Association Algiers',
    phoneLabel: 'Contact Phone Number *',
    phonePlaceholder: '0550 12 34 56',
    cityLabel: 'Wilaya / City *',
    cityPlaceholder: 'Algiers',
    alreadyRegistered: 'Already registered?',
    loginTitle: 'Sign In',
    loginSubtitle: 'Welcome back to HopeLink Algeria',
    instantDemoTitle: 'Instant Demo Preview (No Account Required)',
    instantDemoDesc: 'Click to explore the dashboard immediately:',
    demoRecipientBtn: 'Test as Recipient Org',
    demoDonorBtn: 'Test as Donor Org',
    dontHaveAccount: "Don't have an account yet?",

    // Categories
    catFood: 'Food & Nutrition',
    catClothing: 'Clothing & Blankets',
    catMedical: 'Medical Supplies & First Aid',
    catShelter: 'Shelter & Bedding',
    catOther: 'General / Other Supplies',

    // Urgency
    urgencyHigh: 'Urgent (Emergency)',
    urgencyMedium: 'Moderate (Next Few Days)',
    urgencyLow: 'Low (Ongoing Need)',
    urgencyLabel: 'Urgency Level',

    // Forms & Inputs
    needDescLabel: 'Detailed Description of Need *',
    needDescPlaceholder: 'Describe exact supplies needed... e.g. 30 food parcels containing oil, flour, sugar for vulnerable families in Algiers before winter.',
    quantityLabel: 'Quantity / Scope (Optional)',
    quantityPlaceholder: 'e.g. 50 food packs / 20 blankets / 15 medicine boxes',
    addressLabel: 'Full Drop-off Address',
    addressPlaceholder: 'e.g. Didouche Mourad Street, Kouba, Algiers',

    // Location Picker & Map
    useGPS: 'Detect My Location (GPS)',
    searchAddressOSM: 'Search Address in Algeria (Free)',
    clickMapToPick: 'Click on map to pin drop-off location',
    locating: 'Detecting GPS location...',
    locationFound: 'GPS location detected successfully!',
    locationError: 'Could not auto-detect location. Please enter manually or click on the map.',

    // Dashboards
    recipientDashTitle: 'Recipient Organization Dashboard',
    donorDashTitle: 'Open Charity Needs Feed',
    totalPosted: 'Total Requests',
    activeNeeds: 'Active Needs',
    fulfilledNeeds: 'Fulfilled Needs',
    allRequests: 'All Requests',
    openRequests: 'Open for Aid',
    inProgressRequests: 'In Progress / Assigned',
    fulfilledRequests: 'Fulfilled',
    postFirstNeed: 'Post First Need',
    noRequestsFound: 'No requests found in this list currently',
    filterByCity: 'Filter by Wilaya',
    allCities: 'All Wilayas',
    filterByCategory: 'Filter by Aid Category',
    filterByUrgency: 'Filter by Urgency',
    searchPlaceholder: 'Search by organization, Wilaya, address, or item description...',
    resetFilters: 'Reset Filters',
    gridView: 'Grid Cards',
    mapView: 'Interactive Map',

    // Contact & Two-step Acceptance Modal
    orgContactInfo: 'Charity Contact Details',
    directCallNotice: 'You can call the recipient organization directly to ask questions before deciding:',
    callNow: 'Direct Phone Call',
    copyPhone: 'Copy Phone',
    copied: 'Copied!',
    closeWindow: 'Close Window',
    quantityNeeded: 'Quantity Needed:',
    markFulfilled: 'Mark as Fulfilled',
    reopenNeed: 'Re-open Need',
    editRequest: 'Edit Request',
    donorsReachedOut: 'Donor(s) Committed',
    viewContacts: 'View Committed Donors',
    hideDetails: 'Hide Details',

    // Mission Acceptance & Commitment Form
    pledgeSectionTitle: 'Commit to this Aid Request (Accept Mission)',
    pledgeSectionDesc: 'If you choose to fulfill this aid, officially confirm your commitment so the charity is notified.',
    acceptMissionBtn: 'Commit to Fulfilling this Request',
    youAreCommittedBadge: 'You are officially committed to this aid request',
    committedDetails: 'Your Commitment Details:',
    pledgedQtyLabel: 'Quantity You Will Provide (Optional)',
    pledgedQtyPlaceholder: 'e.g. We will provide 30 full food packs / 15 blankets',
    deliveryDateLabel: 'Estimated Delivery Date / Time (Optional)',
    deliveryDatePlaceholder: 'e.g. Next Saturday afternoon',
    donorNotesLabel: 'Additional Delivery Notes (Optional)',
    donorNotesPlaceholder: 'e.g. We will transport the aid in our van directly to the charity center',
    confirmCommitmentBtn: 'Confirm Commitment Now',
    cancelCommitmentBtn: 'Cancel My Commitment',
    cancelling: 'Cancelling...',
    commitmentSuccessTitle: 'Commitment Confirmed!',
    commitmentSuccessMsg: 'Thank you! Please call the charity to coordinate the exact delivery time and location.',

    // Status Badges
    statusOpen: 'Open for Donors',
    statusInProgress: 'In Progress / Assigned',
    statusFulfilled: 'Fulfilled',

    // Footer
    footerDesc: 'Direct humanitarian platform connecting local Algerian charities with generous donors across all Wilayas.',
    verifiedNetwork: 'Humanitarian Charity & Relief Network in Algeria',
    categoriesHeader: 'Aid Categories',
    platformHeader: 'Platform',
    copyright: '© All rights reserved. HopeLink Algeria Charity Matching Platform.',
    madeWithLove: 'Made for supporting charitable relief organizations in Algeria.',

    // 404
    pageNotFound: 'Page Not Found',
    pageNotFoundDesc: 'The page you are looking for could not be found.',
    returnHome: 'Return Home'
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
