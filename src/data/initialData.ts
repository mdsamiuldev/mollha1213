import {
  BalanceAdjustment,
  EidEvent,
  FamilyMember,
  KalyanTrustAid,
  Organizer,
  SubscriptionRecord,
  AppNotification,
  UserAccount,
} from '../types.ts';

// ৩ জন প্রধান অ্যাডমিন: মূল অ্যাডমিন (সামিউল) এবং ২ জন উদ্যোক্তা (মোঃ আরিফুল ইসলাম ও মোঃ আনোয়ার)
export const ADMIN_PRIMARY_EMAIL = 'samiul122344@gmail.com';
export const ADMIN_EMAIL = ADMIN_PRIMARY_EMAIL;
export const ADMIN_ENTREPRENEUR_1_EMAIL = 'ariful.molla.admin@gmail.com';
export const ADMIN_ENTREPRENEUR_2_EMAIL = 'anowar.molla.admin@gmail.com';

export const ADMIN_EMAILS: string[] = [
  ADMIN_PRIMARY_EMAIL.toLowerCase(),
  ADMIN_ENTREPRENEUR_1_EMAIL.toLowerCase(),
  ADMIN_ENTREPRENEUR_2_EMAIL.toLowerCase(),
];

// গ্রহণযোগ্য অ্যাডমিন পাসওয়ার্ড / পিন (অ্যাডমিনরা এই পাসওয়ার্ড দিয়ে সুরক্ষিতভাবে লগইন করবেন)
export const ADMIN_PASSWORDS = ['admin123', 'molla2026', '122344', 'samiul2026'];

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-admin-1',
    name: 'প্রধান অ্যাডমিন (সামিউল)',
    email: ADMIN_PRIMARY_EMAIL.toLowerCase(),
    phone: '',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-01-01',
  },
  {
    id: 'acc-admin-2',
    name: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
    email: ADMIN_ENTREPRENEUR_1_EMAIL.toLowerCase(),
    phone: '',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-01-01',
  },
  {
    id: 'acc-admin-3',
    name: 'মোঃ আনোয়ার (অ্যাডমিন)',
    email: ADMIN_ENTREPRENEUR_2_EMAIL.toLowerCase(),
    phone: '',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-01-01',
  },
  {
    id: 'acc-member-1',
    name: 'করিম মোল্লা',
    email: 'karim.molla@gmail.com',
    phone: '01711000001',
    password: '1234',
    role: 'member',
    createdAt: '2026-02-01',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_ORGANIZERS: Organizer[] = [
  {
    id: 'org-1',
    name: 'মোঃ আরিফুল ইসলাম (Md Ariful Islam)',
    role: 'উদ্যোক্তা, প্রধান সমন্বয়ক ও অ্যাডমিন',
    phone: '', // নাম্বার পরবর্তীতে অ্যাডমিন প্রদান করবেন
    email: '', // জিমেইল পরবর্তীতে অ্যাডমিন প্রদান করবেন
    whatsapp: '',
    bio: 'মোল্লা পরিবারের সম্মানিত উদ্যোক্তা ও ট্রাস্ট পরিচালনা পর্ষদের অন্যতম অ্যাডমিন।',
    address: 'মোল্লা পরিবার প্রধান শাখা',
    photoUrl: '',
  },
  {
    id: 'org-2',
    name: 'মোঃ আনোয়ার (Md Anowar)',
    role: 'উদ্যোক্তা, অর্থ সম্পাদক ও অ্যাডমিন',
    phone: '', // নাম্বার পরবর্তীতে অ্যাডমিন প্রদান করবেন
    email: '', // জিমেইল পরবর্তীতে অ্যাডমিন প্রদান করবেন
    whatsapp: '',
    bio: 'মোল্লা পরিবারের সম্মানিত উদ্যোক্তা ও ট্রাস্ট পরিচালনা পর্ষদের অন্যতম অ্যাডমিন।',
    address: 'মোল্লা পরিবার দক্ষিণ শাখা',
    photoUrl: '',
  },
];

// ব্যবহারকারীর নির্দেশ অনুযায়ী ডেমো ডেটা মুছে খালি রাখা হয়েছে, যাতে পাবলিক করার পর প্রকৃত সদস্যরা তথ্য ইনপুট দিতে পারেন
export const INITIAL_MEMBERS: FamilyMember[] = [];

export const INITIAL_EID_EVENTS: EidEvent[] = [
  {
    id: 'eid_ul_fitr',
    title: 'পবিত্র ঈদুল ফিতর পারিবারিক পুনর্মিলনী ২০২৬',
    hijriYear: '১৪৪৭ হিজরি',
    gregorianYear: 2026,
    dateStr: 'পবিত্র ঈদুল ফিতরের দিন',
    venue: 'মোল্লা বাড়ি প্রাঙ্গণ',
    theme: 'ভ্রাতৃত্ব, আন্তরিকতা ও সৌহার্দ্যপূর্ণ পারিবারিক মিলনমেলা',
    totalBudget: 35000,
    status: 'upcoming',
    expenses: [],
    photos: [],
  },
  {
    id: 'eid_ul_adha',
    title: 'পবিত্র ঈদুল আজহা কোরবানি ও উৎসব ২০২৬',
    hijriYear: '১৪৪৭ হিজরি',
    gregorianYear: 2026,
    dateStr: 'পবিত্র ঈদুল আজহার দিন',
    venue: 'মোল্লা বাড়ি প্রাঙ্গণ',
    theme: 'কোরবানি, সমবণ্টন ও পারিবারিক মহাভোজ',
    totalBudget: 45000,
    status: 'upcoming',
    expenses: [],
    photos: [],
  },
];

// ব্যবহারকারীর নির্দেশ অনুযায়ী সাহায্যপ্রাপ্তদের ডেমো ডেটা রিমুভ করা হয়েছে (বর্তমানে খালি)
export const INITIAL_KALYAN_AIDS: KalyanTrustAid[] = [];

// চাঁদা সংগ্রহের প্রাথমিক ডেটা খালি
export const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [];

export const INITIAL_ADJUSTMENTS: BalanceAdjustment[] = [];

export const BASE_INITIAL_BALANCE = 0;
