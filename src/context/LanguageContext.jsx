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
    brandName: 'منصة تنسيق الإغاثة',
    brandTag: 'تنسيق بين الفروع',
    brandSubtitle: 'شبكة الاستجابة الإنسانية وإدارة قوافل المساعدات بالجزائر',
    home: 'الرئيسية',
    dashboard: 'لوحة القيادة',
    map: 'الخريطة الميدانية',
    admin: 'الإدارة العامة',
    logIn: 'تسجيل الدخول',
    logOut: 'تسجيل الخروج',
    myAccount: 'حسابي',
    switchAccountBtn: 'تبديل الحساب / الفرع',
    broadcastNeedBtn: 'إطلاق نداء إغاثة',

    // Priorities
    priorityP1: 'P1 - حرج (0-24 ساعة)',
    priorityP2: 'P2 - عاجل (24-48 ساعة)',
    priorityP3: 'P3 - أولوية مرتفعة',
    priorityP4: 'P4 - متوسط',

    // Dispatches
    sendAid: 'إرسال معونة / قافلة',
    commitDispatch: 'تجهيز وإرسال قافلة',
    cargo: 'حمولة القافلة',
    driver: 'السائق',
    vehiclePlate: 'ترقيم الشاحنة',
    eta: 'الموعد المقدر للوصول',
    statusPledged: 'تم الالتزام',
    statusPacking: 'قيد التجهيز والتحميل',
    statusDispatched: 'انطلقت القافلة',
    statusInTransit: 'في الطريق',
    statusDelivered: 'وصلت للموقع',
    statusConfirmed: 'تم الاستلام والتفريغ بالمستودع',

    // Road Access Status
    accessOpen: 'مسالك سالكة ومفتوحة',
    accessObstructed: 'مسالك بها عوائق وصعبة',
    accessCutOff: 'منطقة مقطوعة ومعزولة',

    // Disaster Types
    disasterFlood: 'فيضانات وسيول',
    disasterEarthquake: 'زلزال / هزة أرضية',
    disasterFire: 'حرائق غابات',
    disasterDrought: 'جفاف وموجة حر',
    disasterCold: 'موجة برد وثلوج',
    disasterMedical: 'طارئ صحي / وبائي',

    // Categories
    catFood: 'طرود غذائية ومؤونة',
    catWater: 'مياه شرب معقمة',
    catMedical: 'أدوية وإسعافات أولية',
    catShelter: 'خيام وإيواء طارئ',
    catClothing: 'أغطية وألبسة شتوية',
    catHygiene: 'مستلزمات نظافة شخصية',
    catVolunteers: 'فرق متطوعين ومسعفين',
    catEquipment: 'معدات ومضخات',
    catOther: 'مستلزمات أخرى',

    // General UI
    cancel: 'إلغاء',
    save: 'حفظ',
    confirm: 'تأكيد',
    delete: 'حذف',
    edit: 'تعديل',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات حالياً'
  },
  en: {
    // Brand & Navigation
    brandName: 'Relief Coordination Platform',
    brandTag: 'Inter-Branch Network',
    brandSubtitle: 'Disaster Relief & Aid Logistics Network in Algeria',
    home: 'Home',
    dashboard: 'Dashboard',
    map: 'National Map',
    admin: 'Admin Hub',
    logIn: 'Sign In',
    logOut: 'Sign Out',
    myAccount: 'My Account',
    switchAccountBtn: 'Switch Account / Branch',
    broadcastNeedBtn: 'Broadcast Need',

    // Priorities
    priorityP1: 'P1 - Critical (0-24h)',
    priorityP2: 'P2 - Urgent (24-48h)',
    priorityP3: 'P3 - High Priority',
    priorityP4: 'P4 - Medium Priority',

    // Dispatches
    sendAid: 'Send Aid / Convoy',
    commitDispatch: 'Prepare & Dispatch Convoy',
    cargo: 'Cargo Load',
    driver: 'Driver',
    vehiclePlate: 'Vehicle Plate',
    eta: 'Estimated Arrival (ETA)',
    statusPledged: 'Pledged',
    statusPacking: 'Packing & Loading',
    statusDispatched: 'Dispatched',
    statusInTransit: 'In Transit',
    statusDelivered: 'Delivered',
    statusConfirmed: 'Received & Stored',

    // Road Access Status
    accessOpen: 'Open / Accessible',
    accessObstructed: 'Obstructed',
    accessCutOff: 'Cut Off / Isolated',

    // Disaster Types
    disasterFlood: 'Flood',
    disasterEarthquake: 'Earthquake',
    disasterFire: 'Wildfire',
    disasterDrought: 'Drought',
    disasterCold: 'Cold Wave',
    disasterMedical: 'Health Emergency',

    // Categories
    catFood: 'Food Packs',
    catWater: 'Clean Water',
    catMedical: 'Medicines & First Aid',
    catShelter: 'Tents & Shelter',
    catClothing: 'Blankets & Warm Clothing',
    catHygiene: 'Hygiene Kits',
    catVolunteers: 'Volunteers & First-Responders',
    catEquipment: 'Equipment & Pumps',
    catOther: 'Other Supplies',

    // General UI
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    noData: 'No records available'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('relief_lang') || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('relief_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const isRtl = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isRtl, isRTL: isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};
