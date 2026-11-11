import React, { useState } from 'react';
import { X, LogIn, Lock, Mail, User, ShieldCheck, UserPlus, Phone, Home, Sparkles } from 'lucide-react';
import { AuthState, FamilyMember, UserAccount, UserRole } from '../types.ts';
import { ADMIN_PASSWORDS } from '../data/initialData.ts';
import { validateUserLogin, validateMemberRegistration } from '../utils/finance.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string; role: UserRole; phone?: string }) => void;
  onRegisterAccount: (accountData: {
    name: string;
    phone: string;
    email: string;
    password: string;
    fatherName?: string;
    branch?: string;
  }) => { success: boolean; error?: string };
  authState: AuthState;
  members: FamilyMember[];
  accounts: UserAccount[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegisterAccount,
  authState,
  members,
  accounts,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFatherName, setRegFatherName] = useState('');
  const [regBranch, setRegBranch] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const result = validateUserLogin(identifier, password, accounts, ADMIN_PASSWORDS);

    if (!result.success || !result.user) {
      setErrorMsg(result.error || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।');
      return;
    }

    onLogin(result.user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = validateMemberRegistration(
      {
        name: regName,
        phone: regPhone,
        email: regEmail,
        password: regPassword,
      },
      accounts
    );

    if (!validation.success) {
      setErrorMsg(validation.error || 'নিবন্ধন তথ্য যাচাই ব্যর্থ হয়েছে।');
      return;
    }

    const regResult = onRegisterAccount({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
      fatherName: regFatherName.trim(),
      branch: regBranch.trim(),
    });

    if (!regResult.success) {
      setErrorMsg(regResult.error || 'নিবন্ধন সম্পন্ন করা যায়নি।');
      return;
    }

    // Auto-login the registered member
    onLogin({
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      role: 'member',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
              {mode === 'login' ? (
                <LogIn className="w-6 h-6 text-amber-300" />
              ) : (
                <UserPlus className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">মোল্লা পরিবার পোর্টাল</h3>
              <p className="text-xs text-emerald-200">
                {mode === 'login' ? 'অ্যাকাউন্টে নিরাপদ প্রবেশ' : 'পারিবারিক সদস্য নতুন অ্যাকাউন্ট তৈরি'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch buttons */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 grid grid-cols-2 gap-2 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন করুন</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন সদস্য নিবন্ধন</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            /* SECURE LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  জিমেইল অথবা মোবাইল নম্বর
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="আপনার জিমেইল বা মোবাইল নম্বর লিখুন..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  অ্যাডমিনরা তাদের নির্ধারিত জিমেইল এবং সদস্যরা নিবন্ধিত জিমেইল/মোবাইল ব্যবহার করবেন।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  পাসওয়ার্ড / পিন (বাধ্যতামূলক)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার গোপন পাসওয়ার্ড লিখুন..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div className="font-semibold text-stone-800">নিরাপত্তা নোটিশ:</div>
                <p>
                  যেকোনো ভুয়া বা অনিবন্ধিত তথ্যে এখন প্রবেশাধিকার সংরক্ষিত। নতুন সদস্য হলে উপরের "নতুন সদস্য নিবন্ধন" বাটনে ক্লিক করে তথ্য সংরক্ষণ করুন।
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>যাচাই করে লগইন করুন</span>
              </button>
            </form>
          ) : (
            /* NEW MEMBER REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  সদস্যের পুরো নাম *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="উদা: মোঃ আব্দুর রহিম মোল্লা"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর (১১ ডিজিট) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  সদস্যের জিমেইল ঠিকানা *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[10px] text-emerald-700 font-medium mt-1">
                  💡 এই জিমেইলে মাসিক চাঁদার রসিদ ও অটো রিমাইন্ডার নোটিফিকেশন পৌঁছাবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  লগইন পাসওয়ার্ড নির্ধারণ করুন *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ সংখ্যার পিন বা পাসওয়ার্ড..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    পিতার নাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={regFatherName}
                    onChange={(e) => setRegFatherName(e.target.value)}
                    placeholder="পিতার নাম"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    শাখা / গ্রাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    placeholder="মোল্লা বাড়ি / প্রধান শাখা"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>অ্যাকাউন্ট তৈরি ও সরাসরি প্রবেশ</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

