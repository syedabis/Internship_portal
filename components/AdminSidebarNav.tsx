'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bell, ShoppingBag, BookOpen, MessageSquare, HelpCircle } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/products', label: 'Products & Perks', icon: ShoppingBag },
  { href: '/admin/resources', label: 'Resources', icon: BookOpen },
  { href: '/admin/support', label: 'Support Inbox', icon: HelpCircle },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3 space-y-0.5">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group ${
              isActive
                ? 'bg-emerald-600/10 text-emerald-400 font-medium'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon 
              className={`w-4 h-4 transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
              }`} 
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
