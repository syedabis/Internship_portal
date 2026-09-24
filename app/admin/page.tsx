'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, ShoppingBag, BookOpen, HelpCircle, ArrowRight, Plus, Loader2, Users } from 'lucide-react';
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
      label: 'Announcements',
      value: stats?.announcements,
      icon: Bell,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/announcements',
      desc: 'Published updates',
    },
    {
      label: 'Products & Perks',
      value: stats?.products,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/products',
      desc: 'Listed in catalogue',
    },
    {
      label: 'Resources',
      value: stats?.resources,
      icon: BookOpen,
      color: 'from-violet-500 to-violet-600',
      href: '/admin/resources',
      desc: 'Masterclasses & tutorials',
    },
    {
      label: 'Open Tickets',
      value: stats?.openTickets,
      icon: HelpCircle,
      color: stats?.openTickets ? 'from-amber-500 to-orange-500' : 'from-slate-600 to-slate-700',
      href: '/admin/support',
      desc: 'Awaiting your reply',
      urgent: (stats?.openTickets ?? 0) > 0,
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Cortexa AI Internship Portal — manage content at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, href, desc, urgent }) => (
          <Link
            key={label}
            href={href}
            className={`relative rounded-xl p-5 flex flex-col gap-3 bg-gradient-to-br ${color} shadow-lg hover:scale-[1.02] transition-transform`}
          >
            {urgent && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            )}
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-12 bg-white/20 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-white">{value ?? 0}</p>
              )}
              <p className="text-white/90 font-semibold text-sm mt-0.5">{label}</p>
              <p className="text-white/60 text-xs">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/admin/announcements', label: 'Post Announcement', desc: 'Publish news to all interns', icon: Bell, action: 'Go to Announcements' },
          { href: '/admin/products', label: 'Add Product', desc: 'List a new AI tool or software perk', icon: ShoppingBag, action: 'Manage Products' },
          { href: '/admin/support', label: 'View Support Inbox', desc: 'Reply to intern queries and issues', icon: HelpCircle, action: 'Open Inbox' },
        ].map(({ href, label, desc, icon: Icon, action }) => (
          <Link
            key={href}
            href={href}
            className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:bg-slate-800 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-300" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="mt-3 font-semibold text-white text-sm">{label}</p>
            <p className="text-slate-400 text-xs mt-1">{desc}</p>
            <p className="text-emerald-400 text-xs font-semibold mt-3 group-hover:underline">{action} →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
