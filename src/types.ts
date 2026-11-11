/**
 * Molla Poribar - Type Definitions
 */

export type UserRole = 'admin' | 'member' | 'guest';

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
  } | null;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type RelationType = 'father' | 'mother' | 'son' | 'daughter' | 'senior' | 'guardian' | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  nameEn?: string;
  gender: 'male' | 'female';
  relationType: RelationType;
  age: number;
  bloodGroup: BloodGroup;
  phone: string;
  occupation: string;
  education?: string;
  fatherName: string;
  motherName: string;
  address: string;
  branch: string; // শাখা / পরিবার খানা
  photoUrl?: string;
  isRegisteredUser?: boolean;
}

export interface SubscriptionRecord {
  id: string;
  memberId: string;
  memberName: string;
  monthYear: string; // "YYYY-MM", e.g., "2026-11"
  amount: number; // 500 Taka
  status: 'pending_verification' | 'paid' | 'rejected' | 'due';
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
  transactionId?: string;
  senderPhone?: string;
  paidAt?: string;
  verifiedByAdmin?: boolean;
  verifiedAt?: string;
  verifiedByEmail?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface EidExpenseItem {
  id: string;
  title: string;
  category: 'food' | 'decoration' | 'gifts' | 'qurbani' | 'sound' | 'entertainment' | 'other';
  amount: number;
  voucherNo?: string;
  date: string;
  notes?: string;
}

export interface EidEvent {
  id: 'eid_ul_fitr' | 'eid_ul_adha';
  title: string;
  hijriYear: string;
  gregorianYear: number;
  dateStr: string;
  venue: string;
  theme: string;
  totalBudget: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  expenses: EidExpenseItem[];
  photos: string[];
}

export type AidProblemCategory = 'medical' | 'education' | 'emergency_relief' | 'marriage' | 'business_support' | 'other';

export interface KalyanTrustAid {
  id: string;
  applicantName: string;
  applicantPhone: string;
  relationOrBranch: string;
  problemCategory: AidProblemCategory;
  problemTitle: string;
  description: string;
  requestedAmount: number;
  grantedAmount?: number;
  status: 'pending' | 'approved' | 'disbursed' | 'rejected';
  applicationDate: string;
  disbursedDate?: string;
  payoutMethod?: string;
  accountNumber?: string;
  reviewNotes?: string;
  isPubliclyShown: boolean; // Show in transparency board
}

export interface BalanceAdjustment {
  id: string;
  amount: number; // positive or negative
  type: 'deposit' | 'withdrawal' | 'correction' | 'direct_donation';
  reason: string;
  adjustedBy: string;
  date: string;
}

export interface Organizer {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  bio: string;
  photoUrl: string;
  address: string;
  whatsapp: string;
}

export type NotificationType = 'aid_status' | 'subscription_verified' | 'due_reminder' | 'system';

export interface AppNotification {
  id: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName?: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
  linkTab?: string;
  metadata?: {
    aidId?: string;
    subscriptionId?: string;
    newStatus?: string;
    amount?: number;
    emailSent?: boolean;
    emailRecipient?: string;
    monthYear?: string;
  };
}

export interface UserAccount {
  id: string;
  name: string;
  email: string; // Gmail
  phone: string;
  password: string; // PIN or password
  role: UserRole;
  createdAt: string;
  memberId?: string;
}
