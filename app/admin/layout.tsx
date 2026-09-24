'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Loader2 } from 'lucide-react';
import { AdminSidebarNav } from '@/components/AdminSidebarNav';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['abis@datacrumbs.org'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const email = user?.email ?? null;
      if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
        router.replace('/admin/login');
        return;
      }
      setIsAuthorized(true);
      setLoading(false);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isLoginPage) return;
      setUser(session?.user ?? null);
      const email = session?.user?.email ?? null;
      if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
        router.replace('/admin/login');
        return;
      }
      setIsAuthorized(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage, pathname]);

  // If viewing the dedicated login page, render it directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9f7]">
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-xl">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-sm font-bold text-slate-800">Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
  const userEmail = user?.email || 'abis@datacrumbs.org';
  const userAvatar = user?.user_metadata?.avatar_url || '/profile_image.png';

  return (
    <div className="min-h-screen flex bg-[#f5f9f7] text-slate-900 font-sans">
      
      {/* Desktop Dark Rail Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col h-screen bg-[#091715] border-r border-[#15342e] select-none justify-between p-4 text-[#a8b8b5]">
        <div className="space-y-6">
          {/* Header Logo */}
          <div className="flex items-center justify-between">
            <div className="font-black text-xl text-white tracking-tight flex items-center gap-1.5">
              <span>Cortexa</span>
              <span className="text-emerald-400 text-xs font-bold font-mono">AI</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wide ml-1">
                Admin
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <AdminSidebarNav />
        </div>

        {/* Footer Admin User Profile & Back to Portal */}
        <div className="space-y-2 pt-4 border-t border-[#183631]">
          <Link
            href="/"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#9cb0ab] hover:text-white hover:bg-[#132d28] transition-colors"
          >
            <LogOut className="w-4 h-4 text-[#758e89]" />
            <span>Back to Portal</span>
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d221f] border border-[#1b433c]">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-500/40"
              />
              <div className="truncate min-w-0">
                <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                  <span className="truncate">{userName}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[9px] text-emerald-300 shrink-0 font-bold">
                    Admin
                  </span>
                </div>
                <div className="text-[10px] text-[#6c8681] truncate">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Mobile Bar */}
        <div className="md:hidden flex items-center justify-between p-3.5 bg-[#091715] text-white border-b border-[#163a34] sticky top-0 z-40">
          <div className="font-black text-base tracking-tight flex items-center gap-1.5">
            <span>Cortexa</span>
            <span className="text-emerald-400 text-xs font-mono">Admin</span>
          </div>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full bg-[#163a34] border border-[#23534b] text-emerald-300 text-xs font-bold flex items-center gap-1.5"
          >
            <span>Exit Admin</span>
          </Link>
        </div>

        {/* Dynamic Admin View Container */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
