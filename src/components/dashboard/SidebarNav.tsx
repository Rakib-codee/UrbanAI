'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/app/i18n/hooks';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  translationKey: string;
}

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <nav className="grid items-start gap-2 py-4">
        {items.map((item, index) => {
          return (
            item.href && (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href ? 'bg-accent text-accent-foreground' : 'transparent',
                  item.disabled && 'cursor-not-allowed opacity-60'
                )}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{t(`nav.${item.translationKey}`)}</span>
              </Link>
            )
          );
        })}
      </nav>
    </div>
  );
} 