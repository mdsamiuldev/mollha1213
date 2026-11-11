import React from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  Users,
  Lock,
  Clock,
  UserCheck,
} from 'lucide-react';
import { INITIAL_ORGANIZERS, ADMIN_PRIMARY_EMAIL } from '../data/initialData.ts';
import { maskAdminEmail } from '../utils/finance.ts';

interface OrganizersViewProps {
  isAdmin: boolean;
  onOpenLoginModal: () => void;
}

export const OrganizersView: React.FC<OrganizersViewProps> = ({
  isAdmin,
  onOpenLoginModal,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>উদ্যোক্তা ও ৩-অ্যাডমিন পরিচালনা পর্ষদ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            মোল্লা পরিবারের সম্মানিত উদ্যোক্তাবৃন্দ
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            মোল্লা পরিবারের আত্মীয়তার বন্ধন অটুট রাখা, কল্যাণ ট্রাস্ট পরিচালনা, মাসিক চাঁদা সংগ্রহ ও দুই ঈদের সার্বিক আয়োজনে নেতৃত্ব দিচ্ছেন আমাদের সম্মানিত উদ্যোক্তাগণ।
          </p>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Featured Organizers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_ORGANIZERS.map((org, index) => (
          <div
            key={org.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                    {index === 0 ? 'আ' : 'আ'}
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-1">
                      {org.role}
                    </span>
                    <h3 className="text-xl font-bold text-stone-900">
                      {org.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{org.address}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio & Status */}
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
                {org.bio}
              </p>
            </div>

            {/* Contact Notice (As requested: Phone & Gmail hidden until provided) */}
            <div className="mt-5 p-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>প্রশাসনিক মর্যাদা: অনুমোদিত পর্ষদ অ্যাডমিন</span>
              </div>
              <p className="text-[11px] text-stone-500">
                মোবাইল নম্বর ও অফিশিয়াল জিমেইল শীঘ্রই অ্যাডমিন কর্তৃক যুক্ত করা হবে।
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3-Admin Structure Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-400 text-stone-950">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                মোল্লা পরিবারের ৩-অ্যাডমিন পরিচালনা কাঠামো
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              প্ল্যাটফর্মে মোট ৩ জন অ্যাডমিন দায়িত্ব পালন করবেন: প্রধান অ্যাডমিন (সামিউল) এবং ২ জন উদ্যোক্তা (মোঃ আরিফুল ইসলাম ও মোঃ আনোয়ার)। সাধারণ কোনো মেহমানের নিকট অ্যাডমিনদের ব্যক্তিগত জিমেইল প্রকাশিত হবে না।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div className="text-amber-300 font-bold">১. প্রধান অ্যাডমিন</div>
                <div className="text-stone-300 text-[11px] mt-0.5">
                  {maskAdminEmail(ADMIN_PRIMARY_EMAIL, isAdmin)}
                </div>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div className="text-emerald-300 font-bold">২. উদ্যোক্তা অ্যাডমিন</div>
                <div className="text-stone-300 text-[11px] mt-0.5">মোঃ আরিফুল ইসলাম</div>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div className="text-emerald-300 font-bold">৩. উদ্যোক্তা অ্যাডমিন</div>
                <div className="text-stone-300 text-[11px] mt-0.5">মোঃ আনোয়ার</div>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {!isAdmin ? (
              <button
                onClick={onOpenLoginModal}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition-all text-center"
              >
                অ্যাডমিন প্যানেলে লগইন করুন
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                ✓ অ্যাডমিন অধিবেশন সক্রিয়
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
