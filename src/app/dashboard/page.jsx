// /app/dashboard/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  
  useEffect(() => {
    // Redirigir a overview si está conectado
    if (isConnected) {
      router.push('/dashboard/overview');
    } else {
      router.push('/');
    }
  }, [isConnected, router]);
  
  return null;
}