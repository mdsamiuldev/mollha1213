import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMainBalance,
  aggregateFamilyCensus,
  maskAdminEmail,
  isUserAdmin,
  formatTaka,
  toBengaliNumerals,
  getBengaliMonthTitle,
  validateUserLogin,
  checkMemberMonthlyPaid,
  ADMIN_PRIMARY_EMAIL,
} from './finance.ts';
import {
  BalanceAdjustment,
  EidEvent,
  FamilyMember,
  KalyanTrustAid,
  SubscriptionRecord,
} from '../types.ts';

test('isUserAdmin correctly validates all 3 admins', () => {
  assert.equal(isUserAdmin('samiul122344@gmail.com'), true);
  assert.equal(isUserAdmin('SAMIUL122344@gmail.com'), true); // case insensitive
  assert.equal(isUserAdmin('ariful.molla.admin@gmail.com'), true);
  assert.equal(isUserAdmin('anowar.molla.admin@gmail.com'), true);
  assert.equal(isUserAdmin('random.user@gmail.com'), false);
  assert.equal(isUserAdmin(null), false);
});

test('maskAdminEmail hides admin email for guests and reveals to admin', () => {
  const hidden = maskAdminEmail(ADMIN_PRIMARY_EMAIL, false);
  assert.equal(hidden.includes('samiul122344@gmail.com'), false);
  assert.equal(hidden.includes('s***4@gmail.com'), true);

  const revealed = maskAdminEmail(ADMIN_PRIMARY_EMAIL, true);
  assert.equal(revealed, 'samiul122344@gmail.com');
});

test('calculateMainBalance ONLY adds approved paid subscriptions, NOT pending ones', () => {
  const baseBalance = 0;

  const mockSubscriptions: SubscriptionRecord[] = [
    {
      id: 'sub-1',
      memberId: 'mem-1',
      memberName: 'আরিফুল ইসলাম',
      monthYear: '2026-11',
      amount: 500,
      status: 'pending_verification', // Submitted but NOT yet verified by admin
      paymentMethod: 'bKash',
      transactionId: 'TRX-BK123456',
    },
    {
      id: 'sub-2',
      memberId: 'mem-2',
      memberName: 'আনোয়ার মোল্লা',
      monthYear: '2026-11',
      amount: 500,
      status: 'paid', // Verified and confirmed by admin
      paymentMethod: 'bKash',
      transactionId: 'TRX-BK987654',
      verifiedByAdmin: true,
    },
  ];

  const result = calculateMainBalance(
    baseBalance,
    mockSubscriptions,
    [],
    [],
    []
  );

  // Only the verified 500 Tk is added to main balance!
  assert.equal(result.totalSubscriptionCollected, 500);
  assert.equal(result.mainBalance, 500);
  assert.equal(result.pendingSubscriptionsCount, 1);
  assert.equal(result.pendingSubscriptionsTotal, 500);
});

test('aggregateFamilyCensus handles empty members array gracefully', () => {
  const census = aggregateFamilyCensus([]);
  assert.equal(census.totalMembers, 0);
  assert.equal(census.maleCount, 0);
  assert.equal(census.femaleCount, 0);
  assert.equal(census.parentsCount, 0);
  assert.equal(census.childrenCount, 0);
  assert.equal(census.seniorsCount, 0);
  assert.equal(census.bloodGroupsCount['O+'], 0);
});

test('validateUserLogin prevents unauthorized or random logins', () => {
  const accounts = [
    {
      name: 'করিম মোল্লা',
      email: 'karim.molla@gmail.com',
      phone: '01711000001',
      password: '1234',
      role: 'member' as const,
    },
  ];

  // 1. Admin login with correct password succeeds
  const adminOk = validateUserLogin('samiul122344@gmail.com', 'admin123', accounts);
  assert.equal(adminOk.success, true);
  assert.equal(adminOk.user?.role, 'admin');

  // 2. Admin login with incorrect password fails
  const adminFail = validateUserLogin('samiul122344@gmail.com', 'wrongpass', accounts);
  assert.equal(adminFail.success, false);
  assert.equal(adminFail.error?.includes('পাসওয়ার্ড'), true);

  // 3. Member login with correct password succeeds
  const memberOk = validateUserLogin('karim.molla@gmail.com', '1234', accounts);
  assert.equal(memberOk.success, true);
  assert.equal(memberOk.user?.name, 'করিম মোল্লা');

  // 4. Member login with wrong password fails
  const memberWrongPass = validateUserLogin('01711000001', 'wrong', accounts);
  assert.equal(memberWrongPass.success, false);
  assert.equal(memberWrongPass.error?.includes('পাসওয়ার্ড সঠিক নয়'), true);

  // 5. Random unregistered user fails
  const randomFail = validateUserLogin('stranger@gmail.com', 'anypass', accounts);
  assert.equal(randomFail.success, false);
  assert.equal(randomFail.error?.includes('কোনো নিবন্ধিত অ্যাকাউন্ট পাওয়া যায়নি'), true);
});

test('checkMemberMonthlyPaid correctly identifies paid vs unpaid', () => {
  const mockSubs: SubscriptionRecord[] = [
    {
      id: 'sub-1',
      memberId: 'm1',
      memberName: 'করিম মোল্লা',
      monthYear: '2026-11',
      amount: 500,
      status: 'paid',
      paymentMethod: 'bKash',
      senderPhone: '01711000001',
    },
  ];

  // Karim has paid for 2026-11
  const karimCheck = checkMemberMonthlyPaid(
    { name: 'করিম মোল্লা', phone: '01711000001' },
    '2026-11',
    mockSubs
  );
  assert.equal(karimCheck.isPaid, true);

  // Unpaid member for 2026-11
  const unpaidCheck = checkMemberMonthlyPaid(
    { name: 'আকবর মোল্লা', phone: '01999999999' },
    '2026-11',
    mockSubs
  );
  assert.equal(unpaidCheck.isPaid, false);
});


