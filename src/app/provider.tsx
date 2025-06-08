'use client';

import { SessionProvider } from '@/components/SessionProvider';

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
} 