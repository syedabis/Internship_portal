'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bell, ShoppingBag, BookOpen, HelpCircle, Briefcase, Users } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/chapters', label: 'Ambassadors & Chapters', icon: Users },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/products', label: 'Products & Perks', icon: ShoppingBag },
  { href: '/admin/resources', label: 'Resources', icon: BookOpen },
  { href: '/admin/support', label: 'Support Inbox', icon: HelpCircle },
];

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 text-xs">
      <div className="text-[10px] font-bold tracking-widest text-[#5c736f] uppercase px-2 mb-2">
        ADMINISTRATION
      </div>

      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={() => onNavigate?.()}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
              isActive
                ? 'bg-[#1b3d37] text-white font-bold shadow-xs border border-[#26554d]'
                : 'text-[#9cb0ab] hover:text-white hover:bg-[#132d28]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-[#758e89]'}`} />
              <span className="truncate">{label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
