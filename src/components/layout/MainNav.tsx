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

interface MainNavProps {
  items: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">UrbanAI</span>
      </Link>
      <nav className="flex gap-6">
        {items?.map(
          (item, index) =>
            item.href && (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center text-sm font-medium text-muted-foreground',
                  item.href.startsWith(`/${pathname.split('/')[1]}`)
                    ? 'text-foreground'
                    : 'hover:text-foreground',
                  item.disabled && 'cursor-not-allowed opacity-80'
                )}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
              >
                {t(`nav.${item.translationKey}`)}
              </Link>
            )
        )}
      </nav>
      <div className="ml-auto flex items-center space-x-4">
      </div>
    </div>
  );
} 