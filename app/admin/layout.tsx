'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import { AdminSidebarNav } from '@/components/AdminSidebarNav';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['abis@datacrumbs.org'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email ?? null;
      if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
        router.replace('/');
        return;
      }
      setIsAuthorized(true);
      setLoading(false);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null;
      if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
        router.replace('/');
        return;
      }
      setIsAuthorized(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col bg-slate-900 border-r border-slate-800">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Cortexa AI</p>
              <p className="text-[10px] text-slate-400 leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <AdminSidebarNav />

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Back to Portal
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
