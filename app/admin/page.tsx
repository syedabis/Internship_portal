'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, ShoppingBag, BookOpen, HelpCircle, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Stats = {
  announcements: number;
  products: number;
  resources: number;
  openTickets: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [annRes, prodRes, resRes, ticketRes] = await Promise.all([
        supabase.from('announcements').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('resources').select('id', { count: 'exact', head: true }),
        supabase.from('support_messages').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      ]);
      setStats({
        announcements: annRes.count ?? 0,
        products: prodRes.count ?? 0,
        resources: resRes.count ?? 0,
        openTickets: ticketRes.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Official Announcements',
      value: stats?.announcements,
      icon: Bell,
      iconBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      href: '/admin/announcements',
      desc: 'Published news & updates',
    },
    {
      label: 'Products & Perks',
      value: stats?.products,
      icon: ShoppingBag,
      iconBg: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      href: '/admin/products',
      desc: 'Listed in AI tools catalogue',
    },
    {
      label: 'Learning Resources',
      value: stats?.resources,
      icon: BookOpen,
      iconBg: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
      href: '/admin/resources',
      desc: 'Masterclasses & tutorials',
    },
    {
      label: 'Open Support Tickets',
      value: stats?.openTickets,
      icon: HelpCircle,
      iconBg: (stats?.openTickets ?? 0) > 0 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-slate-100 text-slate-600 border border-slate-200',
      href: '/admin/support',
      desc: 'Awaiting your team reply',
      urgent: (stats?.openTickets ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Hero Dark Textured Banner */}
      <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: "url('/progress_card_bg.jpeg')" }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Administrator Control Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Portal Management & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Content Studio</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Manage announcements, update the AI software marketplace, publish masterclasses, and handle intern support tickets seamlessly.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live Database Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Supabase Backend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, iconBg, href, desc, urgent }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between relative group"
          >
            {urgent && (
              <span className="absolute top-4 right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}

            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className="w-6 h-6" />
              </div>

              <div>
                {loading ? (
                  <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse mb-1" />
                ) : (
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {value ?? 0}
                  </div>
                )}
                <div className="font-bold text-slate-800 text-sm mt-1">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Manage</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              href: '/admin/announcements',
              title: 'Post Official Announcement',
              desc: 'Broadcast updates directly to all registered intern dashboards.',
              icon: Bell,
              btnText: 'Create Announcement',
            },
            {
              href: '/admin/products',
              title: 'Add Product to Perks',
              desc: 'Add new AI tools, software licenses, or developer accounts.',
              icon: ShoppingBag,
              btnText: 'Add Product',
            },
            {
              href: '/admin/support',
              title: 'Review Support Inbox',
              desc: 'Respond to technical issues or submission inquiries.',
              icon: HelpCircle,
              btnText: 'View Inbox',
            },
          ].map(({ href, title, desc, icon: Icon, btnText }) => (
            <div
              key={href}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>

              <Link
                href={href}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>{btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
