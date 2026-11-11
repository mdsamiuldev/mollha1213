/**
 * Pure helper functions for Molla Poribar calculations
 */
import {
  BalanceAdjustment,
  EidEvent,
  FamilyMember,
  KalyanTrustAid,
  SubscriptionRecord,
  UserRole,
} from '../types.ts';

export const ADMIN_PRIMARY_EMAIL = 'samiul122344@gmail.com';
export const ADMIN_EMAILS = [
  'samiul122344@gmail.com',
  'ariful.molla.admin@gmail.com',
  'anowar.molla.admin@gmail.com',
];

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}

export const MONTHLY_SUBSCRIPTION_AMOUNT = 500;

/**
 * Formats a number to Bengali numerals (e.g. 500 -> ৫০০)
 */
export function toBengaliNumerals(val: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

/**
 * Formats amount into Taka with Bengali symbols (e.g. 5000 -> ৳ ৫,০০০)
 */
export function formatTaka(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN').format(Math.round(amount));
  return `৳ ${toBengaliNumerals(formatted)}`;
}

/**
 * Masks the admin email so guests and non-admin members cannot see it
 */
export function maskAdminEmail(email: string, isViewerAdmin: boolean): string {
  if (isViewerAdmin) {
    return email;
  }
  if (!email) return 'অজানা';
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  const maskedUser = user.length > 2 
    ? `${user[0]}***${user[user.length - 1]}`
    : '***';
  return `${maskedUser}@${domain} (গোপন সংরক্ষিত)`;
}

/**
 * Calculates current month in YYYY-MM format
 */
export function getCurrentMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Converts "YYYY-MM" to Bengali month title, e.g. "2026-11" -> "নভেম্বর ২০২৬"
 */
export function getBengaliMonthTitle(monthYearKey: string): string {
  const [yearStr, monthStr] = monthYearKey.split('-');
  const monthNamesBn: Record<string, string> = {
    '01': 'জানুয়ারি',
    '02': 'ফেব্রুয়ারি',
    '03': 'মার্চ',
    '04': 'এপ্রিল',
    '05': 'মে',
    '06': 'জুন',
    '07': 'জুলাই',
    '08': 'আগস্ট',
    '09': 'সেপ্টেম্বর',
    '10': 'অক্টোবর',
    '11': 'নভেম্বর',
    '12': 'ডিসেম্বর',
  };
  const monthName = monthNamesBn[monthStr] || monthStr;
  const yearBn = toBengaliNumerals(yearStr);
  return `${monthName} ${yearBn}`;
}

/**
 * Calculates the complete financial state including Main Balance
 */
export interface CalculatedFinancials {
  baseBalance: number;
  totalSubscriptionCollected: number;
  totalEidSpent: number;
  totalAidDisbursed: number;
  totalAdjustments: number;
  mainBalance: number; // মেইন ব্যালেন্স
  pendingSubscriptionsCount: number; // অপেক্ষমাণ চাঁদা আবেদন সংখ্যা
  pendingSubscriptionsTotal: number; // অপেক্ষমাণ চাঁদার টাকার পরিমাণ
  pendingAidRequestsTotal: number;
  pendingAidRequestsCount: number;
}

export function calculateMainBalance(
  baseBalance: number,
  subscriptions: SubscriptionRecord[],
  eidEvents: EidEvent[],
  trustAids: KalyanTrustAid[],
  adjustments: BalanceAdjustment[]
): CalculatedFinancials {
  // CRITICAL RULE: Only confirmed / paid subscriptions add to Main Balance!
  // Pending verification subscriptions do NOT add to main balance until Admin approves them!
  const paidSubs = subscriptions.filter((s) => s.status === 'paid');
  const totalSubscriptionCollected = paidSubs.reduce((sum, s) => sum + (s.amount || 0), 0);

  const pendingSubs = subscriptions.filter((s) => s.status === 'pending_verification');
  const pendingSubscriptionsCount = pendingSubs.length;
  const pendingSubscriptionsTotal = pendingSubs.reduce((sum, s) => sum + (s.amount || 0), 0);

  // Sum of all Eid expenses across both Eid-ul-Fitr and Eid-ul-Adha
  const totalEidSpent = eidEvents.reduce((eventSum, event) => {
    const expensesSum = event.expenses.reduce((eSum, item) => eSum + (item.amount || 0), 0);
    return eventSum + expensesSum;
  }, 0);

  // Sum of disbursed aid
  const disbursedAids = trustAids.filter((a) => a.status === 'disbursed');
  const totalAidDisbursed = disbursedAids.reduce(
    (sum, a) => sum + (a.grantedAmount ?? a.requestedAmount ?? 0),
    0
  );

  // Adjustments (positive for deposits/donations, negative for direct withdrawals/deductions)
  const totalAdjustments = adjustments.reduce((sum, adj) => {
    return sum + (adj.amount || 0);
  }, 0);

  // Pending aid requested total for alerts
  const pendingAids = trustAids.filter((a) => a.status === 'pending');
  const pendingAidRequestsTotal = pendingAids.reduce((sum, a) => sum + (a.requestedAmount || 0), 0);
  const pendingAidRequestsCount = pendingAids.length;

  // Main balance
  const mainBalance =
    baseBalance +
    totalSubscriptionCollected +
    totalAdjustments -
    totalEidSpent -
    totalAidDisbursed;

  return {
    baseBalance,
    totalSubscriptionCollected,
    totalEidSpent,
    totalAidDisbursed,
    totalAdjustments,
    mainBalance,
    pendingSubscriptionsCount,
    pendingSubscriptionsTotal,
    pendingAidRequestsTotal,
    pendingAidRequestsCount,
  };
}

/**
 * Aggregates statistics for family members
 */
export interface FamilyCensusStats {
  totalMembers: number;
  maleCount: number;
  femaleCount: number;
  parentsCount: number;
  childrenCount: number;
  seniorsCount: number;
  bloodGroupsCount: Record<string, number>;
}

export function aggregateFamilyCensus(members: FamilyMember[]): FamilyCensusStats {
  let maleCount = 0;
  let femaleCount = 0;
  let parentsCount = 0;
  let childrenCount = 0;
  let seniorsCount = 0;

  const bloodGroupsCount: Record<string, number> = {
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'O+': 0,
    'O-': 0,
    'AB+': 0,
    'AB-': 0,
  };

  for (const m of members) {
    if (m.gender === 'male') maleCount++;
    if (m.gender === 'female') femaleCount++;

    if (m.relationType === 'father' || m.relationType === 'mother' || m.relationType === 'guardian') {
      parentsCount++;
    } else if (m.relationType === 'son' || m.relationType === 'daughter') {
      childrenCount++;
    }

    if (m.age >= 60 || m.relationType === 'senior') {
      seniorsCount++;
    }

    if (bloodGroupsCount[m.bloodGroup] !== undefined) {
      bloodGroupsCount[m.bloodGroup]++;
    }
  }

  return {
    totalMembers: members.length,
    maleCount,
    femaleCount,
    parentsCount,
    childrenCount,
    seniorsCount,
    bloodGroupsCount,
  };
}

/**
 * Validates login credentials strictly to prevent arbitrary/fake logins
 */
export interface LoginValidationResult {
  success: boolean;
  user?: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
  };
  error?: string;
}

export function validateUserLogin(
  identifier: string,
  pinOrPass: string,
  accounts: { email: string; phone: string; password?: string; name: string; role: UserRole }[],
  adminPasswords: string[] = ['admin123', 'molla2026', '122344', 'samiul2026']
): LoginValidationResult {
  const trimmedInput = (identifier || '').trim();
  const trimmedPass = (pinOrPass || '').trim();

  if (!trimmedInput) {
    return { success: false, error: 'অনুগ্রহ করে আপনার জিমেইল অথবা মোবাইল নম্বর প্রদান করুন।' };
  }

  if (!trimmedPass) {
    return { success: false, error: 'অনুগ্রহ করে অ্যাকাউন্টের পাসওয়ার্ড বা পিন প্রদান করুন।' };
  }

  const lowerInput = trimmedInput.toLowerCase();

  // 1. Check if trying to log in as an Admin
  if (isUserAdmin(lowerInput)) {
    const isPassValid = adminPasswords.some((p) => p === trimmedPass);
    if (!isPassValid) {
      return {
        success: false,
        error: 'অ্যাডমিনের পাসওয়ার্ড সঠিক নয়! সঠিক গোপন পিন বা পাসওয়ার্ড প্রদান করুন।',
      };
    }

    let adminName = 'প্রধান অ্যাডমিন';
    if (lowerInput === ADMIN_PRIMARY_EMAIL.toLowerCase()) {
      adminName = 'প্রধান অ্যাডমিন (সামিউল)';
    } else if (lowerInput.includes('ariful')) {
      adminName = 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)';
    } else if (lowerInput.includes('anowar')) {
      adminName = 'মোঃ আনোয়ার (অ্যাডমিন)';
    }

    return {
      success: true,
      user: {
        name: adminName,
        email: lowerInput,
        role: 'admin',
      },
    };
  }

  // 2. Member validation: Account MUST exist in registered accounts list
  const cleanPhoneInput = trimmedInput.replace(/[^0-9]/g, '');
  const foundAccount = accounts.find((acc) => {
    const emailMatch = acc.email && acc.email.toLowerCase() === lowerInput;
    const phoneMatch = cleanPhoneInput && acc.phone && acc.phone.replace(/[^0-9]/g, '') === cleanPhoneInput;
    const nameMatch = acc.name && acc.name.toLowerCase() === lowerInput;
    return emailMatch || phoneMatch || nameMatch;
  });

  if (!foundAccount) {
    return {
      success: false,
      error: 'এই তথ্য দিয়ে কোনো নিবন্ধিত অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে "নতুন সদস্য নিবন্ধন" ট্যাবে গিয়ে আপনার পরিবার অ্যাকাউন্ট তৈরি করুন।',
    };
  }

  // Verify member password
  if (foundAccount.password && foundAccount.password.trim() !== trimmedPass) {
    return {
      success: false,
      error: 'পাসওয়ার্ড সঠিক নয়! অনুগ্রহ করে আপনার অ্যাকাউন্টের সঠিক পাসওয়ার্ড প্রদান করুন।',
    };
  }

  return {
    success: true,
    user: {
      name: foundAccount.name,
      email: foundAccount.email,
      phone: foundAccount.phone,
      role: foundAccount.role || 'member',
    },
  };
}

/**
 * Validates registration for new family member
 */
export function validateMemberRegistration(
  data: { name: string; phone: string; email: string; password: string },
  existingAccounts: { email: string; phone: string }[]
): { success: boolean; error?: string } {
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: 'অনুগ্রহ করে সদস্যের পুরো নাম লিখুন।' };
  }

  const cleanPhone = data.phone.replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, error: 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)।' };
  }

  const trimmedEmail = (data.email || '').trim().toLowerCase();
  if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
    return { success: false, error: 'সঠিক জিমেইল ঠিকানা দিন, যাতে স্বয়ংক্রিয় নোটিফিকেশন পৌঁছাতে পারে।' };
  }

  if (!data.password || data.password.trim().length < 4) {
    return { success: false, error: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' };
  }

  // Check uniqueness
  const isEmailTaken = existingAccounts.some(
    (a) => a.email && a.email.toLowerCase() === trimmedEmail
  );
  if (isEmailTaken) {
    return { success: false, error: 'এই জিমেইলটি ইতোমধ্যে অন্য একটি অ্যাকাউন্টে ব্যবহৃত হয়েছে।' };
  }

  const isPhoneTaken = existingAccounts.some(
    (a) => a.phone && a.phone.replace(/[^0-9]/g, '') === cleanPhone
  );
  if (isPhoneTaken) {
    return { success: false, error: 'এই মোবাইল নম্বরটি দিয়ে ইতোমধ্যে সদস্য অ্যাকাউন্ট নিবন্ধিত রয়েছে।' };
  }

  return { success: true };
}

/**
 * Checks if a member has paid their subscription for the specified month
 */
export function checkMemberMonthlyPaid(
  user: { email?: string; phone?: string; name?: string },
  monthYear: string,
  subscriptions: SubscriptionRecord[]
): { isPaid: boolean; hasPending: boolean; subscription?: SubscriptionRecord } {
  const normalizedEmail = (user.email || '').toLowerCase().trim();
  const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
  const normalizedName = (user.name || '').toLowerCase().trim();

  const userSubs = subscriptions.filter((sub) => {
    if (sub.monthYear !== monthYear) return false;
    const subPhone = (sub.senderPhone || '').replace(/[^0-9]/g, '');
    const phoneMatch = cleanPhone && subPhone && (cleanPhone === subPhone || subPhone.includes(cleanPhone));
    const nameMatch = normalizedName && sub.memberName && sub.memberName.toLowerCase().trim() === normalizedName;
    return phoneMatch || nameMatch;
  });

  const paidSub = userSubs.find((s) => s.status === 'paid');
  if (paidSub) {
    return { isPaid: true, hasPending: false, subscription: paidSub };
  }

  const pendingSub = userSubs.find((s) => s.status === 'pending_verification');
  if (pendingSub) {
    return { isPaid: false, hasPending: true, subscription: pendingSub };
  }

  return { isPaid: false, hasPending: false };
}

