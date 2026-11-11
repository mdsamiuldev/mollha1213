import React from 'react';
import { Heart, ShieldCheck, Phone, Mail, Sparkles, Moon } from 'lucide-react';
import { maskAdminEmail } from '../utils/finance.ts';
import { ADMIN_EMAIL, INITIAL_ORGANIZERS } from '../data/initialData.ts';

interface FooterProps {
  isAdmin: boolean;
  onNavigate: (tab: string) => void;
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAdmin,
  onNavigate,
  onOpenLoginModal,
}) => {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-lg font-serif">
                মো
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                মোল্লা পরিবার
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              ঐক্য, সৌহার্দ্য ও ভ্রাতৃত্বের মেলবন্ধন। দুই ঈদের মহোৎসব, কল্যাণ ট্রাস্ট ও মাসিক ৫০০ টাকা চাঁদা তহবিলের নির্ভরযোগ্য ডিজিটাল পোর্টাল।
            </p>
            <div className="pt-2 text-xs text-stone-500">
              © ২০২৬ মোল্লা পরিবার কল্যাণ ট্রাস্ট। সর্বস্বত্ব সংরক্ষিত।
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              পারিবারিক সেবাসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('eid')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ঈদুল ফিতর ও ঈদুল আজহার খরচ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kalyan')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  কল্যাণ ট্রাস্টে সাহায্যের আবেদন
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monthly')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  মাসিক চাঁদা পরিশোধ (৳ ৫০০)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('members')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  সদস্য তালিকা ও ব্লাড ব্যাংক
                </button>
              </li>
            </ul>
          </div>

          {/* Organizers Contacts */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              উদ্যোক্তা ও অ্যাডমিন
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div>
                <strong className="text-stone-200 block">{INITIAL_ORGANIZERS[0].name}</strong>
                <span className="text-[11px] text-stone-500">উদ্যোক্তা ও পর্ষদ অ্যাডমিন</span>
              </div>
              <div>
                <strong className="text-stone-200 block">{INITIAL_ORGANIZERS[1].name}</strong>
                <span className="text-[11px] text-stone-500">উদ্যোক্তা ও পর্ষদ অ্যাডমিন</span>
              </div>
            </div>
          </div>

          {/* Admin Security Policy & Login */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>প্রশাসনিক নিরাপত্তা</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              ব্যবহারকারীর অনুরোধ অনুযায়ী, প্রধান অ্যাডমিনের জিমেইল সম্পূর্ণ সুরক্ষিত এবং সাধারণ দর্শকদের নিকট অপ্রকাশ্য।
            </p>
            <div className="p-2.5 bg-stone-800/80 rounded-xl border border-stone-700 text-xs">
              <span className="text-stone-400 block text-[11px]">অ্যাডমিন ইমেইল স্ট্যাটাস:</span>
              <span className="font-mono text-emerald-400 font-medium">
                {maskAdminEmail(ADMIN_EMAIL, isAdmin)}
              </span>
            </div>

            <div className="mt-3">
              {!isAdmin && (
                <button
                  onClick={onOpenLoginModal}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                >
                  অ্যাডমিন লগইন করুন
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
